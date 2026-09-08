'use client';

import React from 'react';
import { Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';
import { WebJSONHeroSection } from '@/types/webjson';

interface HeroProps {
  section: WebJSONHeroSection;
  accentColor: string;
}

export const HeroSection: React.FC<HeroProps> = ({ section, accentColor }) => {
  return (
    <section className="relative pt-44 pb-28 px-6 text-center space-y-8 max-w-4xl mx-auto">
      <div
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a1410] border border-[#2e2724] text-xs font-mono font-semibold"
        style={{ color: accentColor }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{section.badge}</span>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#f5efe9] leading-[1.05]">
        {section.headline}
      </h1>

      <p className="text-base sm:text-xl text-[#a89f91] max-w-2xl mx-auto leading-relaxed">
        {section.subheadline}
      </p>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={section.primaryCta.href}
          className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-[#090706] hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl"
          style={{ backgroundColor: accentColor, boxShadow: `0 12px 30px -6px ${accentColor}50` }}
        >
          <span>{section.primaryCta.label}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
        {section.secondaryCta && (
          <a
            href={section.secondaryCta.href}
            className="w-full sm:w-auto px-7 py-4 rounded-full text-sm font-semibold text-[#f5efe9] bg-[#1a1410] border border-[#2e2724] hover:bg-[#221c19] transition-all flex items-center justify-center gap-2"
          >
            <span>{section.secondaryCta.label}</span>
            <ArrowUpRight className="w-4 h-4 text-[#a89f91]" />
          </a>
        )}
      </div>

      {section.metrics && section.metrics.length > 0 && (
        <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-[#2e2724]">
          {section.metrics.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#f5efe9] font-mono">{m.value}</div>
              <div className="text-[11px] font-mono text-[#a89f91] uppercase tracking-widest">{m.label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
