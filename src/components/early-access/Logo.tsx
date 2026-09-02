import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`} id="namma-stores-logo">
      {/* Brand Icon: House-top + Shopping Bag with 'N' */}
      <div className={`relative shrink-0 ${iconSizes[size]} flex flex-col items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
          aria-hidden="true"
        >
          {/* Orange Roof / House Top */}
          <path
            d="M 50 8 L 88 35 L 12 35 Z"
            fill="#F97316"
            className="transition-transform duration-300"
          />
          {/* Green Shopping Bag Body with curved bottom */}
          <path
            d="M 10 38 L 86 38 L 82 82 C 80 91 74 94 65 94 L 31 94 C 22 94 16 91 14 82 Z"
            fill="#22C55E"
          />
          {/* Letter 'N' inside bag */}
          <path
            d="M 28 80 L 28 50 C 28 47.5 30 46 32.5 46 C 34.5 46 36 47 37.5 49 L 58 77 L 58 50 C 58 47.5 60 46 62.5 46 C 65 46 67 47.5 67 50 L 67 80 C 67 82.5 65 84 62.5 84 C 60.5 84 59 83 57.5 81 L 37 53 L 37 80 C 37 82.5 35 84 32.5 84 C 30 84 28 82.5 28 80 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {/* Brand Name & Tagline */}
      <div className="flex flex-col justify-center leading-tight">
        <div className={`font-black tracking-tight font-['Outfit',sans-serif] ${titleSizes[size]} flex items-baseline gap-1.5`}>
          <span className="text-[#0F172A]">Namma</span>
          <span className="text-[#F97316]">Stores</span>
        </div>
        {showTagline && (
          <div className={`font-semibold tracking-wide text-[#334155] mt-0.5 flex items-center gap-1.5 ${taglineSizes[size]}`}>
            <span>Local</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] inline-block" />
            <span>Fresh</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] inline-block" />
            <span>Trusted</span>
          </div>
        )}
      </div>
    </div>
  );
};
