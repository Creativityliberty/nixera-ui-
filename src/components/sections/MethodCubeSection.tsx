'use client';

import React, { useState } from 'react';

interface MethodCubeProps {
  accentColor: string;
}

export const MethodCubeSection: React.FC<MethodCubeProps> = ({ accentColor }) => {
  const [methodStep, setMethodStep] = useState<number>(0);

  const steps = [
    { title: '01 Discovery', header: 'Evidence Harvesting & Deconstruction', desc: 'Surgical extraction of content, tone, and brand intelligence without styling pollution.' },
    { title: '02 Architecture', header: 'WebJSON Specification & World-State Mapping', desc: 'Structuring data into typed modular contracts and persistent reactive states.' },
    { title: '03 Synthesis', header: 'Modular Component Assembly & 3D Shaders', desc: 'Assembling Three.js physical materials, tactile tilt cards and kinetic springs.' },
    { title: '04 Release', header: 'Deterministic Release & 1-Click Vercel Deploy', desc: 'Complete TypeScript safety, zero watermarks, and high-performance bundles.' },
  ];

  return (
    <section className="p-8 sm:p-12 rounded-[32px] bg-[#140f0c] border border-[#2e2724] space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
            ACT 06 • METHODOLOGY STATE MACHINE
          </div>
          <h3 className="text-2xl font-bold">Linear Engineering Sequence</h3>
        </div>
        <div className="flex items-center gap-2">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setMethodStep(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                methodStep === idx
                  ? 'text-[#090706] font-bold'
                  : 'bg-[#1e1713] text-[#a89f91] hover:text-[#f5efe9]'
              }`}
              style={methodStep === idx ? { backgroundColor: accentColor } : {}}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-[#090706] border border-[#2e2724] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-2 max-w-lg">
          <div className="text-xs font-mono" style={{ color: accentColor }}>
            PHASE 0{methodStep + 1} PROTOCOL
          </div>
          <h4 className="text-2xl font-extrabold text-[#f5efe9]">{steps[methodStep].header}</h4>
          <p className="text-sm text-[#a89f91]">{steps[methodStep].desc}</p>
        </div>
        <div
          className="w-24 h-24 rounded-2xl bg-[#1a1410] border flex items-center justify-center text-3xl font-black font-mono shadow-2xl"
          style={{
            borderColor: `${accentColor}40`,
            color: accentColor,
            boxShadow: `0 10px 30px -5px ${accentColor}30`,
          }}
        >
          0{methodStep + 1}
        </div>
      </div>
    </section>
  );
};
