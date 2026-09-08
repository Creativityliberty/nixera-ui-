'use client';

import React from 'react';
import { WebJSONTestimonialSection } from '@/types/webjson';

interface TestimonialProps {
  section: WebJSONTestimonialSection;
  accentColor: string;
}

export const TestimonialSection: React.FC<TestimonialProps> = ({ section, accentColor }) => {
  return (
    <section className="py-28 px-6 border-t border-[#2e2724] max-w-4xl mx-auto text-center space-y-10">
      <div className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>
        {section.tag}
      </div>
      <blockquote className="text-2xl sm:text-3xl font-light text-[#f5efe9] leading-relaxed italic">
        "{section.quote}"
      </blockquote>
      <div className="space-y-1">
        <p className="text-sm font-mono font-bold text-[#f5efe9]">— {section.author}</p>
        {section.role && <p className="text-xs font-mono text-[#786e64]">{section.role}</p>}
      </div>
    </section>
  );
};
