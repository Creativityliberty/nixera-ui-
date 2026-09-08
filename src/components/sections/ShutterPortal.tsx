'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ShutterPortalProps {
  brandName: string;
  tagline: string;
  description: string;
  accentColor: string;
  onEnter: () => void;
}

export const ShutterPortal: React.FC<ShutterPortalProps> = ({
  brandName,
  tagline,
  description,
  accentColor,
  onEnter,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-8 bg-[#090706] text-[#f5efe9] transition-all duration-1000 ease-out">
      <div className="flex items-center justify-between text-xs font-mono text-[#a89f91]">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          NÜMTEMA M03.7 • EXPERIENCE ENGINE ARCHITECTURE
        </span>
        <span>PARIS • ZURICH • TOKYO</span>
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a1410] border border-[#2e2724] text-xs font-mono font-semibold"
          style={{ color: accentColor }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{brandName.toUpperCase()} • DUAL-MODE CINEMATIC CONTINUUM</span>
        </div>
        <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-[1.05]">
          {tagline}
        </h1>
        <p className="text-sm sm:text-lg text-[#a89f91] max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="pt-4">
          <button
            onClick={onEnter}
            className="px-10 py-4 rounded-full text-white font-bold text-sm uppercase tracking-wider transition-all shadow-2xl cursor-pointer flex items-center gap-3 mx-auto hover:opacity-90"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 20px 40px -10px ${accentColor}60`,
            }}
          >
            <span>Enter The Experience</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-[#786e64]">
        <span>ENGINE: THREE.JS + FRAMER MOTION v12</span>
        <span>WORLD STATE: PERSISTENT</span>
      </div>
    </div>
  );
};
