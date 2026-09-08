'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { WebJSONDocument } from '@/types/webjson';
import { EngineCanvas } from './canvas/EngineCanvas';
import { Navbar } from './sections/Navbar';
import { ShutterPortal } from './sections/ShutterPortal';
import { HeroSection } from './sections/HeroSection';
import { ManifestoSection } from './sections/ManifestoSection';
import { ProofRingSection } from './sections/ProofRingSection';
import { PortfolioSection } from './sections/PortfolioSection';
import { BentoSection } from './sections/BentoSection';
import { MethodCubeSection } from './sections/MethodCubeSection';
import { CmsFieldNotesSection } from './sections/CmsFieldNotesSection';
import { PricingSection } from './sections/PricingSection';
import { ProjectEstimatorSection } from './sections/ProjectEstimatorSection';
import { FaqSection } from './sections/FaqSection';
import { TestimonialSection } from './sections/TestimonialSection';
import { LiquidContactSection } from './sections/LiquidContactSection';
import { SpatialAtlasView } from './sections/SpatialAtlasView';
import { Footer } from './sections/Footer';

interface ExperienceRendererProps {
  data: WebJSONDocument;
}

export function ExperienceRenderer({ data }: ExperienceRendererProps) {
  const [shutterOpen, setShutterOpen] = useState(false);
  const [navMode, setNavMode] = useState<'journey' | 'atlas'>('journey');
  const [activeProject, setActiveProject] = useState<string>('KRONOS HYPER-CHRONO');
  const [temperature, setTemperature] = useState<string>('cold-ink');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [atlasPan, setAtlasPan] = useState<{ x: number; y: number; zoom: number }>({ x: 0, y: 0, zoom: 1 });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const accent = data.theme.accentColor;

  const portfolioSection = data.sections.find((s) => s.type === 'portfolio') as any;
  const projectsList = portfolioSection?.projects || [];

  // Scroll listener for temperature gradation
  useEffect(() => {
    const handleScroll = () => {
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      if (totalH <= 0) return;
      const p = Math.min(Math.max(window.scrollY / totalH, 0), 1);
      setScrollProgress(p);

      if (p < 0.2) setTemperature('cold-ink');
      else if (p < 0.45) setTemperature('warm-charcoal');
      else if (p < 0.7) setTemperature('carmin-ember');
      else if (p < 0.88) setTemperature('cyan-night');
      else setTemperature('deep-ink');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSwitchMode = (mode: 'journey' | 'atlas') => {
    setNavMode(mode);
  };

  const handleSelectFromAtlas = (title: string) => {
    setActiveProject(title);
    setNavMode('journey');
    const el = document.getElementById('portfolio');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#090706] text-[#f5efe9] antialiased overflow-x-hidden">
      
      {/* ── 00 SHUTTER PORTAL ENTRY ───────────────────────────────────────── */}
      {!shutterOpen && (
        <ShutterPortal
          brandName={data.meta.brandName}
          tagline={data.sections.find((s) => s.type === 'hero')?.headline || data.meta.title}
          description={data.meta.description}
          accentColor={accent}
          onEnter={() => setShutterOpen(true)}
        />
      )}

      {/* ── VELOCITY SCROLL INDICATOR ─────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] origin-left z-[100]"
        style={{
          scaleX,
          background: `linear-gradient(to right, ${accent}, #ffffff, ${accent})`,
        }}
      />

      {/* ── THREE.JS WEBGL SPATIAL ENGINE ─────────────────────────────────── */}
      <EngineCanvas
        navMode={navMode}
        scrollProgress={scrollProgress}
        activeProject={activeProject}
        atlasPan={atlasPan}
      />

      {/* ── TOP DUAL-MODE CONTROLLER NAVBAR ───────────────────────────────── */}
      <Navbar
        nav={data.navigation}
        accentColor={accent}
        navMode={navMode}
        temperature={temperature}
        onSwitchMode={handleSwitchMode}
      />

      {/* ── SPATIAL ATLAS RADAR (MODE 2) ─────────────────────────────────── */}
      {navMode === 'atlas' ? (
        <SpatialAtlasView
          projects={projectsList}
          activeProject={activeProject}
          accentColor={accent}
          atlasPan={atlasPan}
          onZoomIn={() => setAtlasPan((p) => ({ ...p, zoom: Math.min(p.zoom + 0.2, 2.2) }))}
          onZoomOut={() => setAtlasPan((p) => ({ ...p, zoom: Math.max(p.zoom - 0.2, 0.6) }))}
          onSelectProject={handleSelectFromAtlas}
          onBackToJourney={() => setNavMode('journey')}
        />
      ) : (
        /* ── 12-ACT GUIDED JOURNEY CONTINUUM (MODE 1) ─────────────────────── */
        <main className="relative z-10 max-w-7xl mx-auto px-6 space-y-36">
          {data.sections.map((section, idx) => {
            switch (section.type) {
              case 'hero':
                return (
                  <React.Fragment key={idx}>
                    <HeroSection
                      section={section}
                      accentColor={accent}
                      onExploreAtlas={() => handleSwitchMode('atlas')}
                    />
                    <ManifestoSection accentColor={accent} />
                    <ProofRingSection accentColor={accent} />
                  </React.Fragment>
                );
              case 'portfolio':
                return (
                  <PortfolioSection
                    key={idx}
                    section={section}
                    accentColor={accent}
                    activeProject={activeProject}
                    onSelectProject={(title) => setActiveProject(title)}
                  />
                );
              case 'bento':
                return (
                  <React.Fragment key={idx}>
                    <BentoSection section={section} accentColor={accent} />
                    <MethodCubeSection accentColor={accent} />
                    <CmsFieldNotesSection accentColor={accent} />
                  </React.Fragment>
                );
              case 'pricing':
                return (
                  <React.Fragment key={idx}>
                    <PricingSection section={section} accentColor={accent} />
                    <ProjectEstimatorSection accentColor={accent} />
                  </React.Fragment>
                );
              case 'faq':
                return <FaqSection key={idx} section={section} accentColor={accent} />;
              case 'testimonial':
                return <TestimonialSection key={idx} section={section} accentColor={accent} />;
              default:
                return null;
            }
          })}

          {/* ACT 10 & 11: LIQUID CONTACT FIELD & WORDMARK FOOTER */}
          <LiquidContactSection brandName={data.meta.brandName} accentColor={accent} />

          {/* FOOTER */}
          <Footer copyright={data.footer.copyright} links={data.footer.links} />
        </main>
      )}

    </div>
  );
}
