'use client';

import React from 'react';

interface LiquidContactProps {
  brandName: string;
  accentColor: string;
}

export const LiquidContactSection: React.FC<LiquidContactProps> = ({ brandName, accentColor }) => {
  return (
    <footer className="space-y-16 pt-16 border-t border-[#2e2724] text-center">
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
          ACT 10 • LIQUID CONTACT FIELD
        </div>
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          Make something impossible to confuse with anyone else.
        </h2>
        <p className="text-sm text-[#a89f91]">
          Engineered with Nümtema Experience Engine M03.7 • Paris • Zurich • Tokyo
        </p>
        <div className="pt-2">
          <a
            href="mailto:hello@example.studio"
            className="inline-block px-8 py-4 rounded-full text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xl"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 12px 30px -6px ${accentColor}50`,
            }}
          >
            Start A Project Protocol
          </a>
        </div>
      </div>

      {/* ACT 11: EDGE-TO-EDGE SCALED WORDMARK */}
      <div className="pt-12 text-center select-none overflow-hidden">
        <div
          className="text-[12vw] font-black tracking-tighter text-[#140f0c] hover:opacity-50 transition-all leading-none truncate"
        >
          {brandName.toUpperCase()}
        </div>
      </div>
    </footer>
  );
};
