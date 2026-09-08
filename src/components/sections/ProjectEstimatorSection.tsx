'use client';

import React, { useState } from 'react';

interface ProjectEstimatorProps {
  accentColor: string;
}

export const ProjectEstimatorSection: React.FC<ProjectEstimatorProps> = ({ accentColor }) => {
  const [estimatorStep, setEstimatorStep] = useState<{ goal: string; scope: string; timeline: string }>({
    goal: 'Spatial Experience',
    scope: 'Flagship + 3D System',
    timeline: '4-6 Weeks',
  });

  return (
    <section className="p-8 sm:p-14 rounded-[36px] bg-[#140f0c] border border-[#2e2724] space-y-8">
      <div className="space-y-2">
        <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
          ACT 09 • MORPHING PROJECT ESTIMATOR
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">Configure Your Engagement</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="text-xs font-mono text-[#a89f91]">GOAL</label>
          {['Brand Flagship', 'Spatial Experience', 'Full Product Suite'].map((g) => (
            <button
              key={g}
              onClick={() => setEstimatorStep((p) => ({ ...p, goal: g }))}
              className={`w-full p-3.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                estimatorStep.goal === g
                  ? 'text-[#090706] font-bold'
                  : 'bg-[#1e1713] text-[#a89f91] hover:text-[#f5efe9]'
              }`}
              style={estimatorStep.goal === g ? { backgroundColor: accentColor } : {}}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-mono text-[#a89f91]">SCOPE</label>
          {['Design Sprint (14d)', 'Flagship + 3D System', 'Yearly Retainer'].map((s) => (
            <button
              key={s}
              onClick={() => setEstimatorStep((p) => ({ ...p, scope: s }))}
              className={`w-full p-3.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                estimatorStep.scope === s
                  ? 'text-[#090706] font-bold'
                  : 'bg-[#1e1713] text-[#a89f91] hover:text-[#f5efe9]'
              }`}
              style={estimatorStep.scope === s ? { backgroundColor: accentColor } : {}}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="p-6 rounded-2xl bg-[#1e1713] border border-[#2e2724] flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-mono" style={{ color: accentColor }}>
              ESTIMATED ARCHITECTURE
            </div>
            <div className="text-lg font-bold text-[#f5efe9]">{estimatorStep.goal}</div>
            <div className="text-xs text-[#a89f91]">{estimatorStep.scope}</div>
          </div>
          <a
            href="mailto:hello@example.studio"
            className="w-full py-3 rounded-xl text-white font-bold text-xs text-center transition-all shadow-lg"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 8px 20px -4px ${accentColor}40`,
            }}
          >
            Initiate Sprint Protocol
          </a>
        </div>
      </div>
    </section>
  );
};
