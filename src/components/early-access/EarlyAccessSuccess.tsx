import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MessageCircle, Instagram, Bell, Sparkles, MapPin } from 'lucide-react';

interface EarlyAccessSuccessProps {
  userName: string;
  phone: string;
  isDuplicate?: boolean;
  onReset?: () => void;
}

export const EarlyAccessSuccess: React.FC<EarlyAccessSuccessProps> = ({
  isDuplicate,
}) => {
  // Pre-filled WhatsApp message
  const prefilledText = encodeURIComponent(
    'Hi Namma Stores! I just joined Early Access and would like to join the WhatsApp community.'
  );
  const whatsappUrl = 'https://chat.whatsapp.com/GsRyrfB4lzRASwYiAp9Ont';
  const instagramUrl = 'https://www.instagram.com/namma.stores/';

  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#22C55E', '#F97316', '#0F172A', '#EAB308'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div
      id="early-access-success-card"
      className="bg-white rounded-2xl md:rounded-3xl border border-emerald-200 shadow-xl p-5 sm:p-8 md:p-10 text-center relative overflow-hidden"
    >
      {/* Celebration Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 mb-4 sm:mb-5">
        <span className="text-3xl sm:text-4xl" role="img" aria-label="Celebration party popper">
          🎉
        </span>
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
        🎉 You&apos;re on the list!
      </h2>

      <p className="text-emerald-800 font-extrabold text-base sm:text-lg mt-2 font-['Outfit',sans-serif]">
        {isDuplicate
          ? "You're already on the Namma Stores Early Access list."
          : 'You’re now part of the Namma Stores Early Access community.'}
      </p>

      {/* Main Announcement & Benefits */}
      <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-slate-700 text-sm sm:text-base leading-relaxed max-w-lg mx-auto text-left space-y-2">
        <p className="font-bold text-slate-900">
          We&apos;re launching soon in Whitefield.
        </p>
        <p className="text-slate-700 text-xs sm:text-sm">
          We&apos;ll notify you when Namma Stores goes live.
        </p>
        <p className="text-slate-700 text-xs sm:text-sm">
          You&apos;ll also get access to special launch offers reserved for our early community.
        </p>
      </div>

      {/* What's waiting for Early Access members */}
      <div className="my-6 max-w-lg mx-auto text-left">
        <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
          <span>🎁</span> What&apos;s waiting for Early Access members?
        </h3>

        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">1. Early launch updates</p>
              <p className="text-xs text-slate-600">Be among the first to know when Namma Stores goes live.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">2. Exclusive launch offers</p>
              <p className="text-xs text-slate-600">Get special offers reserved for our early-access community.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">3. Local updates</p>
              <p className="text-xs text-slate-600">Get updates about what&apos;s coming to your neighbourhood.</p>
            </div>
          </div>
        </div>

        {/* Curiosity Note */}
        <p className="mt-3 text-xs sm:text-sm font-bold text-emerald-800 text-center bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200/60">
          P.S. Early members may get something special when we launch. 👀
        </p>
      </div>

      {/* Action Buttons: Priority 1 WhatsApp, Priority 2 Instagram */}
      <div className="space-y-3 max-w-md mx-auto mt-6">
        {/* Primary Conversion: WhatsApp Community */}
        <div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-join-whatsapp-community"
            className="w-full py-4 px-5 rounded-xl sm:rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base tracking-wide uppercase shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>JOIN OUR WHATSAPP COMMUNITY</span>
          </a>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 font-medium">
            Join the community for launch updates, offers and early-access benefits.
          </p>
        </div>

        {/* Secondary Conversion: Instagram Follow */}
        <div className="pt-2">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-follow-instagram"
            className="w-full py-3 px-5 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-xs sm:text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <Instagram className="w-4 h-4 text-rose-600" />
            <span>FOLLOW @namma.stores</span>
          </a>
        </div>
      </div>
    </div>
  );
};
