'use client';

import React from 'react';
import { Compass, ZoomIn, ZoomOut, ArrowUpRight } from 'lucide-react';
import { WebJSONPortfolioItem } from '@/types/webjson';

interface SpatialAtlasViewProps {
  projects: WebJSONPortfolioItem[];
  activeProject: string;
  accentColor: string;
  atlasPan: { x: number; y: number; zoom: number };
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSelectProject: (title: string) => void;
  onBackToJourney: () => void;
}

export const SpatialAtlasView: React.FC<SpatialAtlasViewProps> = ({
  projects,
  activeProject,
  accentColor,
  onZoomIn,
  onZoomOut,
  onSelectProject,
  onBackToJourney,
}) => {
  return (
    <div className="fixed inset-0 z-30 pt-24 px-6 flex flex-col justify-between pointer-events-auto bg-[#090706]/70 backdrop-blur-md">
      {/* Atlas Control Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between bg-[#140f0c]/90 border border-[#2e2724] p-4 rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 text-xs font-mono text-[#a89f91]">
          <Compass className="w-4 h-4" style={{ color: accentColor }} />
          <span>SPATIAL ATLAS RADAR • PERSISTENT WORLD STATE</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onZoomIn}
            className="p-2 rounded-xl bg-[#1e1713] hover:bg-[#2e2724] text-[#f5efe9] transition-all cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={onZoomOut}
            className="p-2 rounded-xl bg-[#1e1713] hover:bg-[#2e2724] text-[#f5efe9] transition-all cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Atlas Project Nodes Radar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full my-auto">
        {projects.map((proj, idx) => {
          const isSelected = activeProject === proj.title;
          return (
            <div
              key={idx}
              onClick={() => onSelectProject(proj.title)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 backdrop-blur-2xl ${
                isSelected
                  ? 'bg-[#1e1713] scale-105 shadow-2xl'
                  : 'bg-[#140f0c]/80 border-[#2e2724] hover:border-white/30'
              }`}
              style={isSelected ? { borderColor: accentColor, boxShadow: `0 15px 35px -5px ${accentColor}30` } : {}}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#a89f91]">
                  <span>0{idx + 1} / 04</span>
                  <span style={{ color: accentColor }}>{proj.category}</span>
                </div>
                <h3 className="text-xl font-black text-[#f5efe9]">{proj.title}</h3>
                <p className="text-xs text-[#a89f91]">{proj.client}</p>
              </div>

              <div className="pt-4 border-t border-[#2e2724] flex items-center justify-between text-xs">
                <span className="font-mono font-bold" style={{ color: accentColor }}>
                  {proj.impact}
                </span>
                <span className="flex items-center gap-1 font-bold text-[#f5efe9]">
                  Enter Case <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Back Prompt */}
      <div className="text-center pb-8">
        <button
          onClick={onBackToJourney}
          className="px-6 py-2.5 rounded-full bg-[#1e1713] border border-[#2e2724] text-xs font-mono text-[#a89f91] hover:text-[#f5efe9] transition-all cursor-pointer"
        >
          ← Back to Guided 12-Act Journey
        </button>
      </div>
    </div>
  );
};
