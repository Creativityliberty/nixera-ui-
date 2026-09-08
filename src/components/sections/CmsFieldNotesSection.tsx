'use client';

import React, { useState } from 'react';

interface CmsFieldNotesProps {
  accentColor: string;
}

export const CmsFieldNotesSection: React.FC<CmsFieldNotesProps> = ({ accentColor }) => {
  const [fieldComparison, setFieldComparison] = useState<number>(50);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
          ACT 07 • INTERACTIVE CMS COMPONENT
        </div>
        <h2 className="text-3xl font-bold">Interactive Spatial Density Comparator</h2>
      </div>

      <div className="p-8 rounded-3xl bg-[#140f0c] border border-[#2e2724] space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-[#a89f91]">
          <span>2D FLAT ARCHITECTURE ({100 - fieldComparison}%)</span>
          <span>3D SPATIAL CONTINUUM ({fieldComparison}%)</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={fieldComparison}
          onChange={(e) => setFieldComparison(Number(e.target.value))}
          className="w-full cursor-pointer"
          style={{ accentColor }}
        />
        <p className="text-xs text-[#a89f91] font-mono text-center">
          Drag slider to dynamically balance between DOM accessibility and GPU WebGL density.
        </p>
      </div>
    </section>
  );
};
