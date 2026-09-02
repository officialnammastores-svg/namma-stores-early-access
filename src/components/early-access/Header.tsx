import React from 'react';
import { Logo } from './Logo';
import { Sparkles, MapPin } from 'lucide-react';

interface HeaderProps {
  onScrollToForm: () => void;
  showCta?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToForm, showCta = true }) => {
  return (
    <header className="w-full border-b border-slate-200 bg-[#FAF9F6]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
        <Logo size="md" />

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Whitefield, Bangalore</span>
          </div>

          {showCta && (
            <button
              type="button"
              onClick={onScrollToForm}
              id="header-cta-btn"
              className="px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden xs:inline">JOIN EARLY ACCESS</span>
              <span className="xs:hidden">JOIN ACCESS</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
