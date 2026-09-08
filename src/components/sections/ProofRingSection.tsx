'use client';

import React from 'react';

interface ProofRingProps {
  accentColor: string;
}

export const ProofRingSection: React.FC<ProofRingProps> = ({ accentColor }) => {
  return (
    <section className="space-y-12">
      <div className="text-center space-y-3">
        <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
          ACT 02 • ORBITAL PROOF RING
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Proof with Gravitational Pull</h2>
        <p className="text-sm text-[#a89f91]">Metrics orbit a central thesis instead of sitting in a static grid.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { val: '+420%', label: 'ENGAGEMENT VELOCITY' },
          { val: '14 Days', label: 'SPRINT DELIVERY' },
          { val: '$45M+', label: 'SERIES B CAPTURED' },
          { val: '0.00ms', label: 'RUNTIME DESYNC' },
        ].map((m, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-[#140f0c] border border-[#2e2724] text-center space-y-2">
            <div className="text-3xl font-black font-mono" style={{ color: accentColor }}>
              {m.val}
            </div>
            <div className="text-[11px] font-mono text-[#a89f91] uppercase tracking-wider">{m.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
