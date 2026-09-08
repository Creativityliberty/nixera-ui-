'use client';

import React from 'react';

interface FooterProps {
  copyright: string;
  links: Array<{ label: string; href: string }>;
}

export const Footer: React.FC<FooterProps> = ({ copyright, links }) => {
  return (
    <footer className="py-16 px-6 border-t border-[#2e2724] text-xs text-[#786e64] max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <div>{copyright}</div>
      <div className="flex gap-6">
        {links.map((link, idx) => (
          <a key={idx} href={link.href} className="hover:text-[#f5efe9] transition-colors">
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
};
