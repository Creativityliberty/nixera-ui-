'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { WebJSONPricingSection } from '@/types/webjson';
import { TactileCard } from '@/components/ui/TactileCard';

interface PricingProps {
  section: WebJSONPricingSection;
  accentColor: string;
}

export const PricingSection: React.FC<PricingProps> = ({ section, accentColor }) => {
  return (
    <section id="pricing" className="py-28 px-6 border-t border-[#2e2724] max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
          {section.tag}
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5efe9]">{section.title}</h2>
        <p className="text-sm text-[#a89f91]">{section.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {section.tiers.map((tier, idx) => (
          <TactileCard
            key={idx}
            className={`p-8 rounded-[28px] border flex flex-col justify-between space-y-8 ${
              tier.popular ? 'bg-[#1a1410] scale-105 z-10' : 'bg-[#140f0c] border-[#2e2724]'
            }`}
            {...(tier.popular ? { style: { borderColor: accentColor } } : {})}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#f5efe9]">{tier.name}</h3>
                <div className="text-xs text-[#a89f91] mt-1">Structured Deliverable</div>
              </div>
              <div className="text-4xl font-extrabold text-[#f5efe9]">
                {tier.price} <span className="text-xs text-[#786e64]">{tier.period}</span>
              </div>
              <div className="space-y-3 pt-4 border-t border-[#2e2724] text-xs text-[#f5efe9]/90">
                {tier.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="w-full py-3.5 rounded-full text-xs font-bold text-[#090706] hover:opacity-90 transition-all cursor-pointer shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              Select {tier.name}
            </button>
          </TactileCard>
        ))}
      </div>
    </section>
  );
};
