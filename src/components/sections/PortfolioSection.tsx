'use client';

import React from 'react';
import { WebJSONPortfolioSection } from '@/types/webjson';
import { TactileCard } from '@/components/ui/TactileCard';

interface PortfolioProps {
  section: WebJSONPortfolioSection;
  accentColor: string;
  activeProject?: string;
  onSelectProject?: (title: string) => void;
}

export const PortfolioSection: React.FC<PortfolioProps> = ({
  section,
  accentColor,
  activeProject,
  onSelectProject,
}) => {
  return (
    <section id="portfolio" className="py-28 px-6 border-t border-[#2e2724] max-w-7xl mx-auto space-y-16">
      <div className="space-y-3 max-w-2xl">
        <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
          ACT 03 • 3D ARCHITECTURAL WORK CORRIDOR
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5efe9]">{section.title}</h2>
        <p className="text-sm text-[#a89f91]">{section.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {section.projects.map((proj, idx) => {
          const isSelected = activeProject === proj.title;
          return (
            <div
              key={idx}
              onClick={() => onSelectProject && onSelectProject(proj.title)}
              className="cursor-pointer"
            >
              <TactileCard
                className={`p-8 sm:p-10 rounded-[32px] border transition-all flex flex-col justify-between space-y-8 group ${
                  isSelected
                    ? 'bg-[#1a1410] scale-[1.02] shadow-2xl'
                    : 'bg-[#140f0c] border-[#2e2724] hover:border-white/30'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-[#786e64]">
                    <span>0{idx + 1} / 04</span>
                    <span style={{ color: accentColor }}>{proj.category}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#f5efe9] group-hover:text-white transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-[#a89f91] font-mono">{proj.client}</p>
                </div>
                <div className="pt-6 border-t border-[#2e2724] flex items-center justify-between text-xs">
                  <span className="text-[#a89f91]">Key Impact</span>
                  <span
                    className="font-mono font-bold px-3 py-1 rounded-full border"
                    style={{
                      color: accentColor,
                      backgroundColor: `${accentColor}15`,
                      borderColor: `${accentColor}30`,
                    }}
                  >
                    {proj.impact}
                  </span>
                </div>
              </TactileCard>
            </div>
          );
        })}
      </div>
    </section>
  );
};
