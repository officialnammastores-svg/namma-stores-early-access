import React from 'react';
import { Bell, Sparkles, HeartHandshake } from 'lucide-react';

export const WhyJoinEarly: React.FC = () => {
  const benefits = [
    {
      title: 'Be among the first to know',
      desc: 'Get notified when Namma Stores goes live in your neighbourhood.',
      icon: Bell,
      badge: 'Early Alert',
      color: 'emerald',
    },
    {
      title: 'Get exclusive launch offers',
      desc: 'Receive special early-access offers and launch deals reserved for our early community.',
      icon: Sparkles,
      badge: 'Exclusive Perks',
      color: 'orange',
    },
    {
      title: 'Stay connected with Namma Stores',
      desc: "Get launch updates, sneak peeks and updates about what's coming to Whitefield.",
      icon: HeartHandshake,
      badge: 'Community',
      color: 'blue',
    },
  ];

  return (
    <section id="why-join-section" className="my-8 sm:my-12">
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif]">
          Why join early?
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-1.5">
          Reserve your spot to stay in the loop as we bring your favorite Whitefield neighborhood stores online.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      benefit.color === 'emerald'
                        ? 'bg-emerald-100 text-emerald-700'
                        : benefit.color === 'orange'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {benefit.badge}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 mb-1.5 font-['Outfit',sans-serif]">
                  {benefit.title}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
