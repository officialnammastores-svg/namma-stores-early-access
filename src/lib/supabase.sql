-- ========================================================
-- NAMMA STORES: EARLY ACCESS LEADS TABLE & RLS POLICIES
-- Target database: Supabase PostgreSQL
-- ========================================================

-- 1. Create or update the early_access_leads table
CREATE TABLE IF NOT EXISTS public.early_access_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    area TEXT NOT NULL,
    shopping_preferences TEXT[] DEFAULT '{}',
    
    -- UTM attribution fields
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    
    -- Traffic origin
    landing_page TEXT,
    
    -- Community tracking
    whatsapp_joined BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure email column exists if table was previously created
ALTER TABLE public.early_access_leads ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Create optimized indexes for quick lookups & ad reporting
CREATE INDEX IF NOT EXISTS idx_early_access_leads_phone 
    ON public.early_access_leads(phone);

CREATE INDEX IF NOT EXISTS idx_early_access_leads_area 
    ON public.early_access_leads(area);

CREATE INDEX IF NOT EXISTS idx_early_access_leads_created_at 
    ON public.early_access_leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_early_access_leads_utm_campaign 
    ON public.early_access_leads(utm_campaign);

-- Optional: Unique constraint on phone if you want strict 1-lead-per-number at DB level
-- (Our API route also gracefully handles duplicate submissions)
-- CREATE UNIQUE INDEX IF NOT EXISTS idx_early_access_leads_unique_phone ON public.early_access_leads(phone);

-- 3. Automatic timestamp updater trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_early_access_leads_updated_at ON public.early_access_leads;
CREATE TRIGGER set_early_access_leads_updated_at
    BEFORE UPDATE ON public.early_access_leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ========================================================
-- 4. ROW LEVEL SECURITY (RLS) STRATEGY
-- ========================================================
-- Enable RLS on the table to protect customer contact data
ALTER TABLE public.early_access_leads ENABLE ROW LEVEL SECURITY;

-- Block all direct public reads (SELECT) so phone numbers can NEVER be scraped by users or competitors
CREATE POLICY "Deny public select" 
    ON public.early_access_leads
    FOR SELECT 
    TO public
    USING (false);

-- Block public updates and deletions
CREATE POLICY "Deny public update" 
    ON public.early_access_leads
    FOR UPDATE 
    TO public
    USING (false);

CREATE POLICY "Deny public delete" 
    ON public.early_access_leads
    FOR DELETE 
    TO public
    USING (false);

-- Allow server-side service_role full access (service_role automatically bypasses RLS)
-- If you also want to allow direct anon inserts with validation from client:
CREATE POLICY "Allow anon insert only"
    ON public.early_access_leads
    FOR INSERT
    TO anon
    WITH CHECK (
        length(trim(name)) >= 2 AND
        length(trim(phone)) >= 10 AND
        length(trim(area)) >= 2
    );

-- ========================================================
-- 5. SECURE RPC FUNCTION: submit_early_access_lead
-- ========================================================
-- This stored function accepts the lead payload (including email) and inserts it
-- with SECURITY DEFINER privileges, returning true on success or if duplicate.

CREATE OR REPLACE FUNCTION public.submit_early_access_lead(
    p_name TEXT,
    p_phone TEXT,
    p_area TEXT,
    p_shopping_preferences TEXT[] DEFAULT '{}',
    p_utm_source TEXT DEFAULT NULL,
    p_utm_medium TEXT DEFAULT NULL,
    p_utm_campaign TEXT DEFAULT NULL,
    p_utm_content TEXT DEFAULT NULL,
    p_utm_term TEXT DEFAULT NULL,
    p_whatsapp_consent BOOLEAN DEFAULT false,
    p_email TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    clean_phone TEXT;
    clean_name TEXT;
    clean_area TEXT;
    clean_email TEXT;
BEGIN
    -- Normalize inputs
    clean_phone := regexp_replace(p_phone, '\D', '', 'g');
    IF length(clean_phone) = 12 AND clean_phone LIKE '91%' THEN
        clean_phone := substring(clean_phone FROM 3);
    END IF;

    clean_name := trim(p_name);
    clean_area := trim(p_area);
    clean_email := lower(trim(p_email));

    -- Basic validations
    IF length(clean_phone) != 10 THEN
        RAISE EXCEPTION 'Invalid phone number length';
    END IF;

    IF length(clean_name) < 2 THEN
        RAISE EXCEPTION 'Name must be at least 2 characters';
    END IF;

    -- Insert into early_access_leads table
    INSERT INTO public.early_access_leads (
        name,
        email,
        phone,
        area,
        shopping_preferences,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        whatsapp_consent
    )
    VALUES (
        clean_name,
        clean_email,
        clean_phone,
        clean_area,
        p_shopping_preferences,
        p_utm_source,
        p_utm_medium,
        p_utm_campaign,
        p_utm_content,
        p_utm_term,
        COALESCE(p_whatsapp_consent, false)
    );

    RETURN true;
EXCEPTION
    WHEN unique_violation THEN
        -- Return true for duplicate leads to ensure smooth UX
        RETURN true;
    WHEN OTHERS THEN
        RAISE;
END;
$$;

-- Grant execution permission on the function to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.submit_early_access_lead TO anon, authenticated, service_role;

