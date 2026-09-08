'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { WebJSONDocument } from '@/types/webjson';
import { EngineCanvas } from './canvas/EngineCanvas';
import { Navbar } from './sections/Navbar';
import { HeroSection } from './sections/HeroSection';
import { PortfolioSection } from './sections/PortfolioSection';
import { BentoSection } from './sections/BentoSection';
import { PricingSection } from './sections/PricingSection';
import { FaqSection } from './sections/FaqSection';
import { TestimonialSection } from './sections/TestimonialSection';
import { Footer } from './sections/Footer';

interface ExperienceRendererProps {
  data: WebJSONDocument;
}

export function ExperienceRenderer({ data }: ExperienceRendererProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const accent = data.theme.accentColor;

  return (
    <div className="relative w-full min-h-screen bg-[#090706] text-[#f5efe9] antialiased overflow-x-hidden">
      {/* Scroll Progress Velocity Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] origin-left z-[100]"
        style={{
          scaleX,
          background: `linear-gradient(to right, ${accent}, #ffffff, ${accent})`,
        }}
      />

      {/* 3D WebGL Canvas Layer */}
      <EngineCanvas />

      {/* Top Navbar */}
      <Navbar nav={data.navigation} accentColor={accent} />

      {/* Dynamic Section Dispatcher from WebJSON */}
      <main className="relative z-10">
        {data.sections.map((section, idx) => {
          switch (section.type) {
            case 'hero':
              return <HeroSection key={idx} section={section} accentColor={accent} />;
            case 'portfolio':
              return <PortfolioSection key={idx} section={section} accentColor={accent} />;
            case 'bento':
              return <BentoSection key={idx} section={section} accentColor={accent} />;
            case 'pricing':
              return <PricingSection key={idx} section={section} accentColor={accent} />;
            case 'faq':
              return <FaqSection key={idx} section={section} accentColor={accent} />;
            case 'testimonial':
              return <TestimonialSection key={idx} section={section} accentColor={accent} />;
            default:
              return null;
          }
        })}
      </main>

      {/* Modular Footer */}
      <Footer copyright={data.footer.copyright} links={data.footer.links} />
    </div>
  );
}
