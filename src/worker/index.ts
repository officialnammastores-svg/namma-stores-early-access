import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { validateEarlyAccessForm } from '../lib/validation';

export interface Env {
  SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ANON_KEY?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  ASSETS?: {
    fetch: (request: Request | string) => Promise<Response>;
  };
}

export interface WorkerExecutionContext {
  waitUntil: (promise: Promise<unknown>) => void;
  passThroughOnException: () => void;
}

/**
 * Creates a Supabase client using Cloudflare Worker environment variables.
 * Prefers SUPABASE_SERVICE_ROLE_KEY for secure server-side operations.
 */
function getSupabaseClient(env: Env): SupabaseClient | null {
  const url =
    env.SUPABASE_URL ||
    env.NEXT_PUBLIC_SUPABASE_URL ||
    (typeof process !== 'undefined' ? process.env?.SUPABASE_URL || process.env?.NEXT_PUBLIC_SUPABASE_URL : '') ||
    '';

  const key =
    env.SUPABASE_SERVICE_ROLE_KEY ||
    env.SUPABASE_ANON_KEY ||
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    (typeof process !== 'undefined' ? process.env?.SUPABASE_SERVICE_ROLE_KEY || process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY : '') ||
    '';

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...headers,
    },
  });
}

export default {
  async fetch(request: Request, env: Env, _ctx?: WorkerExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // Health check endpoint
    if (url.pathname === '/api/health') {
      if (request.method !== 'GET') {
        return jsonResponse({ success: false, error: 'Method Not Allowed' }, 405, { Allow: 'GET' });
      }

      const hasConfig = Boolean(
        (env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || (typeof process !== 'undefined' && (process.env?.SUPABASE_URL || process.env?.NEXT_PUBLIC_SUPABASE_URL))) &&
        (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof process !== 'undefined' && (process.env?.SUPABASE_SERVICE_ROLE_KEY || process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)))
      );

      return jsonResponse({
        status: 'ok',
        worker: 'namma-stores-early-access',
        configured: hasConfig,
        timestamp: new Date().toISOString(),
      });
    }

    // Early Access Lead Submission API
    if (url.pathname === '/api/early-access') {
      if (request.method !== 'POST') {
        return jsonResponse({ success: false, error: 'Method Not Allowed' }, 405, { Allow: 'POST' });
      }

      let body: Record<string, unknown>;
      try {
        body = await request.json();
      } catch {
        return jsonResponse(
          { success: false, error: 'Invalid JSON request payload.' },
          400
        );
      }

      const {
        name,
        email,
        phone,
        area,
        shoppingPreferences,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        whatsappConsent,
      } = body || {};

      // Validate inputs using centralized validation rules
      const validation = validateEarlyAccessForm({
        name,
        email,
        phone,
        area,
        shoppingPreferences,
        whatsappConsent,
      });

      if (!validation.isValid || !validation.normalizedData) {
        return jsonResponse(
          {
            success: false,
            error: 'Validation failed',
            details: validation.errors,
          },
          400
        );
      }

      const {
        name: validName,
        email: validEmail,
        normalizedPhone,
        area: validArea,
        shoppingPreferences: validPreferences,
        whatsappConsent: validConsent,
      } = validation.normalizedData;

      const supabase = getSupabaseClient(env);

      if (!supabase) {
        console.warn('[Namma Stores Worker] Supabase credentials not configured.');
        return jsonResponse({
          success: true,
          leadId: 'preview_' + Date.now(),
          isDuplicate: false,
          note: 'Recorded in preview mode',
        });
      }

      try {
        // 1. Check if phone number is already registered in public.early_access_leads
        const { data: existingLeads, error: selectError } = await supabase
          .from('early_access_leads')
          .select('id, phone, email')
          .eq('phone', normalizedPhone)
          .limit(1);

        if (selectError) {
          console.error('[Namma Stores Worker] Query error:', selectError.message);
        }

        if (existingLeads && existingLeads.length > 0) {
          const existingLead = existingLeads[0];

          // If lead was previously registered without email, update it with newly provided email
          if (!existingLead.email && validEmail) {
            await supabase
              .from('early_access_leads')
              .update({ email: validEmail })
              .eq('id', existingLead.id);
          }

          return jsonResponse({
            success: true,
            leadId: existingLead.id,
            isDuplicate: true,
            message: 'You are already on the Namma Stores early-access list.',
          });
        }

        // 2. Prepare clean lead record
        const leadRecord = {
          name: validName,
          email: validEmail || null,
          phone: normalizedPhone,
          area: validArea,
          shopping_preferences: validPreferences,
          utm_source: utmSource ? String(utmSource).trim() : null,
          utm_medium: utmMedium ? String(utmMedium).trim() : null,
          utm_campaign: utmCampaign ? String(utmCampaign).trim() : null,
          utm_content: utmContent ? String(utmContent).trim() : null,
          utm_term: utmTerm ? String(utmTerm).trim() : null,
          whatsapp_consent: Boolean(validConsent),
        };

        // 3. Insert record into public.early_access_leads
        const { data: insertedLead, error: insertError } = await supabase
          .from('early_access_leads')
          .insert([leadRecord])
          .select('id, email, phone')
          .single();

        if (insertError) {
          const isDuplicate =
            insertError.code === '23505' ||
            insertError.message?.toLowerCase().includes('duplicate') ||
            insertError.message?.toLowerCase().includes('already') ||
            insertError.message?.toLowerCase().includes('unique');

          if (isDuplicate) {
            return jsonResponse({
              success: true,
              isDuplicate: true,
              message: 'You are already on the Namma Stores early-access list.',
            });
          }

          console.error('[Namma Stores Worker] Supabase insert error:', insertError.message);
          return jsonResponse(
            {
              success: false,
              error: 'Failed to record lead in database',
            },
            500
          );
        }

        return jsonResponse({
          success: true,
          leadId: insertedLead?.id,
          isDuplicate: false,
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown database error';
        console.error('[Namma Stores Worker] Server exception:', errorMsg);
        return jsonResponse(
          {
            success: false,
            error: 'An unexpected server error occurred. Please try again.',
          },
          500
        );
      }
    }

    // Serve static assets if running in Cloudflare Workers Assets runtime
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
