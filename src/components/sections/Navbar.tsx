'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WebJSONNavigation } from '@/types/webjson';

interface NavbarProps {
  nav: WebJSONNavigation;
  accentColor: string;
}

export const Navbar: React.FC<NavbarProps> = ({ nav, accentColor }) => {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#090706]/80 backdrop-blur-xl border-b border-[#2e2724]">
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

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-[#a89f91]">
          {nav.links.map((link, idx) => (
            <a key={idx} href={link.href} className="hover:text-[#f5efe9] transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <a
          href={nav.cta.href}
          className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#090706] hover:opacity-90 transition-all flex items-center gap-1.5 shadow-lg"
          style={{ backgroundColor: accentColor, boxShadow: `0 8px 20px -4px ${accentColor}50` }}
        >
          <span>{nav.cta.label}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </nav>
  );
};
