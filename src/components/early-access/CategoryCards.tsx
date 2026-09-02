import React from 'react';
import { ShoppingCart, Apple, Drumstick } from 'lucide-react';

export const CategoryCards: React.FC = () => {
  const categories = [
    {
      title: 'Groceries',
      emoji: '🛒',
      icon: ShoppingCart,
      desc: 'Daily essentials from nearby stores.',
      border: 'border-emerald-200/80',
      bg: 'bg-emerald-50/70',
    },
    {
      title: 'Fresh Fruits & Vegetables',
      emoji: '🥦',
      icon: Apple,
      desc: 'Fresh produce from nearby stores.',
      border: 'border-green-200/80',
      bg: 'bg-green-50/70',
    },
    {
      title: 'Meat',
      emoji: '🍗',
      icon: Drumstick,
      desc: 'Quality meat from local stores.',
      border: 'border-orange-200/80',
      bg: 'bg-orange-50/70',
    },
  ];

  return (
    <section id="categories-section" className="my-8 sm:my-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className={`rounded-2xl p-4 sm:p-5 border ${cat.border} ${cat.bg} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-2xl sm:text-3xl" role="img" aria-label={cat.title}>
                  {cat.emoji}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 font-['Outfit',sans-serif]">
                {cat.title}
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {cat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
