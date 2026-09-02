import React, { useState, useEffect } from 'react';
import { Header } from './components/early-access/Header';
import { CategoryCards } from './components/early-access/CategoryCards';
import { WhyJoinEarly } from './components/early-access/WhyJoinEarly';
import { EarlyAccessForm } from './components/early-access/EarlyAccessForm';
import { EarlyAccessSuccess } from './components/early-access/EarlyAccessSuccess';
import { UTMParams } from './types';
import { ArrowRight, Instagram, MapPin } from 'lucide-react';

export default function App() {
  const [utmParams, setUtmParams] = useState<UTMParams>({});

  const [submittedLead, setSubmittedLead] = useState<{
    name: string;
    phone: string;
    isDuplicate?: boolean;
  } | null>(null);

  // Read and persist UTM parameters dynamically from current URL / sessionStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const search = new URLSearchParams(window.location.search);
      const urlSource = search.get('utm_source');
      const urlMedium = search.get('utm_medium');
      const urlCampaign = search.get('utm_campaign');
      const urlContent = search.get('utm_content');
      const urlTerm = search.get('utm_term');

      const savedUtmRaw = sessionStorage.getItem('namma_stores_utm_params');
      const savedUtm: UTMParams = savedUtmRaw ? JSON.parse(savedUtmRaw) : {};

      const finalParams: UTMParams = {
        utm_source: urlSource !== null ? urlSource : savedUtm.utm_source,
        utm_medium: urlMedium !== null ? urlMedium : savedUtm.utm_medium,
        utm_campaign: urlCampaign !== null ? urlCampaign : savedUtm.utm_campaign,
        utm_content: urlContent !== null ? urlContent : savedUtm.utm_content,
        utm_term: urlTerm !== null ? urlTerm : savedUtm.utm_term,
        landing_page: window.location.pathname || '/early-access',
      };

      setUtmParams(finalParams);
      sessionStorage.setItem('namma_stores_utm_params', JSON.stringify(finalParams));
    } catch {
      // Safe fallback
    }
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById('early-access-form-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const instagramUrl = 'https://www.instagram.com/namma.stores/';

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sticky Compact Header */}
      <Header onScrollToForm={scrollToForm} showCta={!submittedLead} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-5 sm:py-8">
        {!submittedLead ? (
          <>
            {/* HERO SECTION */}
            <section id="hero-section" className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 pt-1 sm:pt-3">
              {/* Location Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-[11px] sm:text-xs font-bold tracking-wide mb-4 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Launching soon in Whitefield, Bangalore.</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] font-['Outfit',sans-serif]">
                Something local is coming to Whitefield.{' '}
                <span className="inline-block" role="img" aria-label="eyes">
                  👀
                </span>
              </h1>

              {/* Supporting text */}
              <p className="text-base sm:text-lg md:text-xl text-slate-700 font-semibold mt-3.5 leading-snug">
                Your nearby stores are getting ready to come online.
              </p>

              {/* Additional copy */}
              <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
                Namma Stores is bringing your local stores closer to you with a convenient way to discover and shop from nearby businesses.
              </p>

              {/* Hero Primary CTA Button */}
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={scrollToForm}
                  id="hero-cta-btn"
                  className="w-full sm:w-auto py-3.5 px-7 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base tracking-wide uppercase shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>JOIN EARLY ACCESS →</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* CATEGORIES SECTION */}
            <CategoryCards />

            {/* WHY JOIN EARLY SECTION */}
            <WhyJoinEarly />

            {/* EARLY ACCESS FORM SECTION */}
            <div className="max-w-xl mx-auto my-6 sm:my-8">
              <EarlyAccessForm
                utmParams={utmParams}
                onSuccess={(data) => {
                  setSubmittedLead(data);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </>
        ) : (
          /* SUCCESS STATE */
          <div className="max-w-xl mx-auto py-4 sm:py-8">
            <EarlyAccessSuccess
              userName={submittedLead.name}
              phone={submittedLead.phone}
              isDuplicate={submittedLead.isDuplicate}
              onReset={() => setSubmittedLead(null)}
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-600 mt-auto">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Brand Info */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 text-center sm:text-left">
            <span className="font-extrabold text-slate-900 text-sm font-['Outfit',sans-serif]">
              Namma Stores
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="font-semibold text-slate-600">Local • Fresh • Trusted</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="text-slate-500">Whitefield, Bangalore</span>
          </div>

          {/* Instagram Link */}
          <div className="flex items-center gap-3">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="footer-instagram-link"
              className="inline-flex items-center gap-1.5 font-bold text-rose-600 hover:text-rose-700 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow us on Instagram</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
