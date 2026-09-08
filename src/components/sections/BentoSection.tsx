'use client';

import React from 'react';
import { WebJSONBentoSection } from '@/types/webjson';
import { TactileCard } from '@/components/ui/TactileCard';

interface BentoProps {
  section: WebJSONBentoSection;
  accentColor: string;
}

export const BentoSection: React.FC<BentoProps> = ({ section, accentColor }) => {
  return (
    <section id="capabilities" className="py-28 px-6 border-t border-[#2e2724] max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
          {section.tag}
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5efe9]">{section.title}</h2>
        <p className="text-sm text-[#a89f91]">{section.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.items.map((item, idx) => (
          <TactileCard
            key={idx}
            className="p-8 sm:p-10 rounded-[28px] bg-[#140f0c] border border-[#2e2724] hover:border-white/20 transition-all flex flex-col justify-between space-y-8"
          >
            <div className="space-y-4">
              <div
                className="w-12 h-12 rounded-2xl bg-[#1e1713] border border-[#2e2724] flex items-center justify-center font-bold"
                style={{ color: accentColor }}
              >
                {item.badge || `0${idx + 1}`}
              </div>
              <h3 className="text-2xl font-bold text-[#f5efe9]">{item.title}</h3>
              <p className="text-sm text-[#a89f91] leading-relaxed">{item.desc}</p>
            </div>
            {item.outcome && (
              <div className="pt-6 border-t border-[#2e2724] flex items-center justify-between text-xs">
                <span className="text-[#786e64] font-mono uppercase">Key Benefit</span>
                <span className="font-semibold font-mono" style={{ color: accentColor }}>
                  {item.outcome}
                </span>
              </div>
            )}
          </TactileCard>
        ))}
      </div>
    </section>
  );
};
