'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { WebJSONFaqSection } from '@/types/webjson';

interface FaqProps {
  section: WebJSONFaqSection;
  accentColor: string;
}

export const FaqSection: React.FC<FaqProps> = ({ section, accentColor }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 px-6 border-t border-[#2e2724] max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
          {section.tag}
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#f5efe9]">{section.title}</h2>
      </div>

      <div className="space-y-4">
        {section.faqs.map((item, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div key={idx} className="rounded-2xl bg-[#140f0c] border border-[#2e2724] overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
              >
                <span className="font-semibold text-sm sm:text-base text-[#f5efe9]">{item.q}</span>
                <span style={{ color: accentColor }}>{isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}</span>
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-xs sm:text-sm text-[#a89f91] border-t border-[#2e2724] pt-4 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
