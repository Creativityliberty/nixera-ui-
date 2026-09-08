'use client';

import React from 'react';

interface ManifestoSectionProps {
  accentColor: string;
}

export const ManifestoSection: React.FC<ManifestoSectionProps> = ({ accentColor }) => {
  return (
    <section className="p-8 sm:p-14 rounded-[36px] bg-[#140f0c]/90 border border-[#2e2724] backdrop-blur-2xl space-y-8">
      <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
        ACT 01 • SCROLL-LIT MANIFESTO
      </div>
      <div className="text-2xl sm:text-4xl font-extrabold leading-relaxed text-[#f5efe9] space-y-4">
        <p>
          Every word becomes luminous as your gaze traverses the field.
        </p>
        <p className="text-[#a89f91] text-lg sm:text-2xl font-normal">
          Color temperature drifts continuously from cold ink to warm charcoal and rich carmin, establishing emotional narrative progression without abrupt style breaks.
        </p>
      </div>
    </section>
  );
};
