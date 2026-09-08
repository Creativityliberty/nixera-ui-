'use client';

import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { WebJSONNavigation } from '@/types/webjson';

interface NavbarProps {
  nav: WebJSONNavigation;
  accentColor: string;
  navMode: 'journey' | 'atlas';
  temperature: string;
  onSwitchMode: (mode: 'journey' | 'atlas') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  nav,
  accentColor,
  navMode,
  temperature,
  onSwitchMode,
}) => {
  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-[#090706]/85 backdrop-blur-xl border-b border-[#2e2724]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-[#090706] shadow-lg"
            style={{ backgroundColor: accentColor, boxShadow: `0 10px 25px -5px ${accentColor}40` }}
          >
            {nav.logoText.charAt(0)}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-[#f5efe9]">{nav.logoText}</span>
            {nav.badge && (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#1a1410] text-[#a89f91] border border-[#2e2724]">
                {nav.badge}
              </span>
            )}
          </div>
        </a>

        {/* DUAL MODE CONTROLLER (JOURNEY ⇄ ATLAS) */}
        <div className="flex items-center bg-[#140f0c] p-1 rounded-full border border-[#2e2724] shadow-2xl">
          <button
            onClick={() => onSwitchMode('journey')}
            className={`px-3.5 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
              navMode === 'journey'
                ? 'text-white shadow-md'
                : 'text-[#a89f91] hover:text-[#f5efe9]'
            }`}
            style={navMode === 'journey' ? { backgroundColor: accentColor } : {}}
          >
            Journey (12 Acts)
          </button>
          <button
            onClick={() => onSwitchMode('atlas')}
            className={`px-3.5 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
              navMode === 'atlas'
                ? 'text-white shadow-md'
                : 'text-[#a89f91] hover:text-[#f5efe9]'
            }`}
            style={navMode === 'atlas' ? { backgroundColor: accentColor } : {}}
          >
            Spatial Atlas
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-[#a89f91]">
          <span className="font-bold uppercase" style={{ color: accentColor }}>
            {temperature}
          </span>
          <span className="text-[#2e2724]">|</span>
          <a
            href={nav.cta.href}
            className="px-4 py-2 rounded-full text-xs font-semibold text-[#090706] hover:opacity-90 transition-all flex items-center gap-1.5 shadow-lg"
            style={{ backgroundColor: accentColor }}
          >
            <span>{nav.cta.label}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </nav>
  );
};
