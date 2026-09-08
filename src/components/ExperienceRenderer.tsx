'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { 
  Sparkles, ArrowRight, ArrowUpRight, Check, Plus, Minus,
  Layers, Compass, Zap, Workflow, Bot, Globe, ShieldCheck,
  Activity, Eye, ChevronRight, Sliders, Volume2, VolumeX,
  Play, Terminal, Clock, Flame, ChevronDown, CheckCircle2, Lock
} from 'lucide-react';
import { EngineCanvas } from './canvas/EngineCanvas';
import { TactileCard } from './ui/TactileCard';
import { WebJSONDocument } from '@/types/webjson';

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
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [methodStep, setMethodStep] = useState<number>(0);
  const [fieldComparison, setFieldComparison] = useState<number>(65);
  const [activeTab, setActiveTab] = useState<'flagships' | 'spatial' | 'motion' | 'systems'>('flagships');
  const [estimator, setEstimator] = useState({
    goal: 'Spatial Experience',
    scope: 'Flagship + 3D System',
    timeline: '4-6 Weeks',
  });
  const [telemetry, setTelemetry] = useState({ fps: '60', latency: '2.4ms', dpr: '2.0', sync: 'LIVE' });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const accent = data.theme?.accentColor || '#C61C09';
  const brandName = data.meta?.brandName || 'Pixera Studio';

  // ── 1. LENIS BUTTERY SMOOTH MOMENTUM SCROLL ──────────────────────────────
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 2.0,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', (e: any) => {
      const progress = e.progress || 0;
      setScrollProgress(progress);

      if (progress < 0.2) setTemperature('cold-ink');
      else if (progress < 0.45) setTemperature('warm-charcoal');
      else if (progress < 0.7) setTemperature('carmin-ember');
      else if (progress < 0.88) setTemperature('cyan-night');
      else setTemperature('deep-ink');
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  const marqueeClients = [
    'SWISS HOROLOGY', 'VESPER GENEVA', 'MAISON ELYSIAN', 'NEURA LABS AI', 
    'VELOX MOBILITY', 'KRONOS LABS', 'ATELIER VOGUE', 'AETHER AUDIO', 'NÜMTEMA OS'
  ];

  const projects = [
    {
      title: 'KRONOS HYPER-CHRONO',
      client: 'Swiss Haute Horlogerie',
      category: '3D Spatial Flagship',
      impact: '+320% Presales',
      year: '2026',
      accent: '#C61C09',
      desc: 'Interactive WebGL timepiece customizer delivering photorealistic diamond-cut reflections and micro-haptic crown physics.',
      tags: ['Three.js WebGL2', 'Custom GLSL Shaders', 'Spatial HUD'],
    },
    {
      title: 'ATELIER VOGUE',
      client: 'Haute Parfumerie (Paris)',
      category: 'Editorial E-Commerce',
      impact: 'Awwwards Site of the Day',
      year: '2025',
      accent: '#e8b4a0',
      desc: 'Cinematic sensory commerce with fluid editorial typography and dynamic aroma visualization shaders.',
      tags: ['Editorial Design', 'Lenis Smooth Scroll', 'Next.js 15'],
    },
    {
      title: 'NEURA LABS',
      client: 'Silicon Valley AI',
      category: 'Brand Identity & Web',
      impact: '$45M Series B Captured',
      year: '2026',
      accent: '#38bdf8',
      desc: 'Autonomous agent runtime dashboard with sub-50ms glass HUDs and live telemetry streams.',
      tags: ['Next.js 15 App Router', 'Live Telemetry', 'Micro-Interactions'],
    },
    {
      title: 'VELOX MOBILITY',
      client: 'Autonomous EV Flagship',
      category: 'Spatial Experience',
      impact: '1.2M Unique Visits',
      year: '2026',
      accent: '#22c55e',
      desc: 'Full-screen 3D vehicle configurator with real-time aerodynamics simulation and custom GLSL lighting.',
      tags: ['GLTF 3D Models', 'Spatial Continuum', 'Vercel Edge'],
    },
  ];

  const capabilities = [
    {
      badge: '01',
      title: 'Brand Architecture & Identity',
      desc: 'Custom visual systems, proprietary typography, and design tokens that command premium market authority.',
      outcome: 'Unmistakable market authority',
      icon: Compass,
      tags: ['Token Architecture', 'Type Systems', 'Art Direction'],
    },
    {
      badge: '02',
      title: '3D WebGL & Spatial Continuum',
      desc: 'Three.js hardware-accelerated glass stacks, procedural shaders, and sub-50ms render engines.',
      outcome: '3.8x visitor engagement',
      icon: Sparkles,
      tags: ['GLSL Shaders', 'Three.js / WebGL2', 'Spatial Cameras'],
    },
    {
      badge: '03',
      title: 'Kinetic Motion & Micro-Interactions',
      desc: 'Physics-based spring dynamics, 3D tilt tracking, and tactile haptics that make products unforgettable.',
      outcome: 'Zero generic templates',
      icon: Zap,
      tags: ['Framer Motion v12', 'Spring Physics', 'Layout Continuity'],
    },
    {
      badge: '04',
      title: 'Next.js 15 Flagship Engineering',
      desc: 'App Router architecture with React Server Components, zero CMS lock-in, and 1-click Vercel deployment.',
      outcome: 'Sub-90s initial load',
      icon: Workflow,
      tags: ['Next.js 15', 'TypeScript Strict', 'Vercel Edge'],
    },
  ];

  const pricingTiers = [
    {
      name: 'Design Sprint',
      price: '$8,500',
      period: '/ sprint',
      popular: false,
      desc: 'Rapid high-impact flagship delivery for ambitious launches.',
      features: [
        'Complete brand identity & art direction',
        'Spatial 3D Three.js WebGL integration',
        'Framer Motion v12 kinetic system',
        'Next.js 15 App Router codebase',
        '14 days delivery guarantee',
      ],
    },
    {
      name: 'Studio Flagship',
      price: '$18,000',
      period: '/ flagship',
      popular: true,
      desc: 'End-to-end iconic digital world engineered for market leadership.',
      features: [
        'Multi-page continuous 3D architecture',
        'Dual-Mode (Guided Journey + Spatial Atlas)',
        'Custom GLSL shaders & audio haptics',
        'Design system token vault & CMS sync',
        'Dedicated senior art director & engineer',
        '30-day post-launch optimization',
      ],
    },
    {
      name: 'Partner Retainer',
      price: '$6,500',
      period: '/ month',
      popular: false,
      desc: 'Continuous creative evolution and priority feature sprints.',
      features: [
        'Bi-weekly design & code sprints',
        'Continuous 3D world expansion',
        'Performance & conversion audits',
        'Direct Slack access to founders',
        'Priority SLA support',
      ],
    },
  ];

  const faqs = [
    {
      q: 'How does Pixera differ from traditional Webflow or Framer agencies?',
      a: 'We engineer native, production-grade Next.js 15 App Router codebases powered by custom Three.js WebGL2 spatial physics and Framer Motion v12. You receive 100% type-safe TypeScript code without proprietary CMS lock-in or subscription bloat.',
    },
    {
      q: 'Can the generated repository be deployed straight to Vercel?',
      a: 'Yes. The repository is pre-configured with standard Next.js presets, zero watermarks, and type-checked architecture. It imports and deploys to Vercel in 1 click.',
    },
    {
      q: 'What is the Dual-Mode (Journey ⇄ Atlas) navigation?',
      a: 'A revolutionary continuous architecture: visitors can experience a guided 12-act story or switch instantly into a free-roaming spatial radar. The active project state is preserved across both modes without context loss.',
    },
    {
      q: 'What is the typical delivery timeframe?',
      a: 'Our focused Design Sprints ship in 14 days. Comprehensive Flagship worlds with custom 3D models and GLSL shaders ship within 4 to 6 weeks.',
    },
  ];

  const handleSelectFromAtlas = (title: string) => {
    setActiveProject(title);
    setNavMode('journey');
    const el = document.getElementById('work-corridor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#090706] text-[#f5efe9] antialiased selection:bg-[#C61C09] selection:text-[#090706] overflow-x-hidden font-sans">
      
      {/* ── 0.1 CINEMATIC FILM GRAIN NOISE & RADIAL AMBIENT GLOW ──────────── */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1] opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      <div 
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(circle at 50% 15%, rgba(198,28,9,0.12) 0%, rgba(9,7,6,0.95) 85%)'
        }}
      />

      {/* ── 0.2 SHUTTER PORTAL ENTRY ──────────────────────────────────────── */}
      <AnimatePresence>
        {!shutterOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col justify-between p-8 bg-[#090706] text-[#f5efe9]"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#a89f91]">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C61C09] animate-pulse" />
                NÜMTEMA M03.7 • GOLDEN SPECIFICATION
              </span>
              <span>PARIS • ZURICH • TOKYO</span>
            </div>

            <div className="max-w-4xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#140f0c] border border-[#2e2724] text-xs font-mono text-[#C61C09]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{brandName.toUpperCase()} • DUAL-MODE CINEMATIC WORLD</span>
              </motion.div>
              <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.02]">
                Curated for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5efe9] via-[#ffffff] to-[#C61C09]">
                  Bold Ambition.
                </span>
              </h1>
              <p className="text-base sm:text-xl text-[#a89f91] max-w-xl mx-auto leading-relaxed">
                A focused digital studio building flagships, spatial interfaces, and brand universes that command attention.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setShutterOpen(true)}
                  className="px-10 py-4 rounded-full bg-[#C61C09] hover:bg-[#d9220e] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-2xl shadow-[#C61C09]/40 cursor-pointer flex items-center gap-3 mx-auto"
                >
                  <span>Enter Studio Universe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#786e64]">
              <span>ENGINE: THREE.JS + FRAMER MOTION v12</span>
              <span>STATUS: PRODUCTION GREEN</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VELOCITY SCROLL PROGRESS BAR ──────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[100]"
        style={{
          scaleX,
          background: `linear-gradient(to right, ${accent}, #ffffff, ${accent})`,
        }}
      />

      {/* ── FLOATING TELEMETRY HUD BADGE ─────────────────────────────────── */}
      <div className="fixed bottom-6 left-6 z-40 hidden lg:flex items-center gap-4 px-4 py-2 rounded-full bg-[#140f0c]/90 backdrop-blur-2xl border border-[#2e2724] text-[11px] font-mono text-[#a89f91] shadow-2xl">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#C61C09] animate-pulse" />
          <span className="text-[#f5efe9] font-bold">{brandName.toUpperCase()} ENGINE</span>
        </div>
        <span className="text-[#2e2724]">|</span>
        <span>LATENCY: {telemetry.latency}</span>
        <span className="text-[#2e2724]">|</span>
        <span className="text-[#C61C09] font-bold">TEMP: {temperature.toUpperCase()}</span>
      </div>

      {/* ── TOP DUAL-MODE CONTROLLER NAVBAR ───────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-40 bg-[#090706]/85 backdrop-blur-2xl border-b border-[#2e2724]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 90, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C61C09] to-[#8a1205] text-white flex items-center justify-center font-black text-sm shadow-lg shadow-[#C61C09]/30"
            >
              P
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#f5efe9]">{brandName}</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#1a1410] text-[#a89f91] border border-[#2e2724]">
                STUDIO
              </span>
            </div>
          </a>

          {/* DUAL MODE TOGGLE */}
          <div className="flex items-center bg-[#140f0c] p-1.5 rounded-full border border-[#2e2724] shadow-2xl">
            <button
              onClick={() => setNavMode('journey')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                navMode === 'journey'
                  ? 'bg-[#C61C09] text-white shadow-lg shadow-[#C61C09]/25'
                  : 'text-[#a89f91] hover:text-[#f5efe9]'
              }`}
            >
              Journey (12 Acts)
            </button>
            <button
              onClick={() => setNavMode('atlas')}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                navMode === 'atlas'
                  ? 'bg-[#C61C09] text-white shadow-lg shadow-[#C61C09]/25'
                  : 'text-[#a89f91] hover:text-[#f5efe9]'
              }`}
            >
              Spatial Atlas
            </button>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6 text-xs font-medium text-[#a89f91]">
              <a href="#work-corridor" className="hover:text-[#f5efe9] transition-colors">Work</a>
              <a href="#capabilities" className="hover:text-[#f5efe9] transition-colors">Capabilities</a>
              <a href="#pricing" className="hover:text-[#f5efe9] transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-[#f5efe9] transition-colors">FAQ</a>
            </div>
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="#contact"
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#C61C09] hover:bg-[#d9220e] transition-all flex items-center gap-1.5 shadow-lg shadow-[#C61C09]/25"
            >
              <span>Work With Us</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </div>
      </nav>

      {/* ── SPATIAL ATLAS RADAR (MODE 2) ─────────────────────────────────── */}
      {navMode === 'atlas' ? (
        <div className="fixed inset-0 z-30 pt-24 px-6 flex flex-col justify-between pointer-events-auto bg-[#090706]/75 backdrop-blur-md">
          {/* Atlas Control Bar */}
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between bg-[#140f0c]/90 border border-[#2e2724] p-4 rounded-2xl backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 text-xs font-mono text-[#a89f91]">
              <Compass className="w-4 h-4 text-[#C61C09]" />
              <span>SPATIAL ATLAS RADAR • SELECT PROJECT TO LOCK WORLD STATE</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAtlasPan((p) => ({ ...p, zoom: Math.min(p.zoom + 0.2, 2.0) }))}
                className="px-3 py-1.5 rounded-xl bg-[#1e1713] hover:bg-[#2e2724] text-xs font-mono text-[#f5efe9] transition-all cursor-pointer"
              >
                Zoom In +
              </button>
              <button
                onClick={() => setAtlasPan((p) => ({ ...p, zoom: Math.max(p.zoom - 0.2, 0.6) }))}
                className="px-3 py-1.5 rounded-xl bg-[#1e1713] hover:bg-[#2e2724] text-xs font-mono text-[#f5efe9] transition-all cursor-pointer"
              >
                Zoom Out -
              </button>
            </div>
          </div>

          {/* Atlas Project Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full my-auto">
            {projects.map((proj, idx) => {
              const isSelected = activeProject === proj.title;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectFromAtlas(proj.title)}
                  className={`p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 backdrop-blur-2xl ${
                    isSelected
                      ? 'bg-[#1a1410] border-[#C61C09] shadow-2xl shadow-[#C61C09]/25 scale-105'
                      : 'bg-[#140f0c]/85 border-[#2e2724] hover:border-white/30'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#a89f91]">
                      <span>{proj.year}</span>
                      <span style={{ color: proj.accent }}>{proj.category}</span>
                    </div>
                    <h3 className="text-xl font-black text-[#f5efe9]">{proj.title}</h3>
                    <p className="text-xs text-[#a89f91]">{proj.client}</p>
                  </div>

                  <div className="pt-4 border-t border-[#2e2724] flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#C61C09]">{proj.impact}</span>
                    <span className="flex items-center gap-1 font-bold text-[#f5efe9]">
                      Focus Corridor <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pb-8">
            <button
              onClick={() => setNavMode('journey')}
              className="px-6 py-2.5 rounded-full bg-[#140f0c] border border-[#2e2724] text-xs font-mono text-[#a89f91] hover:text-[#f5efe9] transition-all cursor-pointer shadow-xl"
            >
              ← Return to Guided 12-Act Journey
            </button>
          </div>
        </div>
      ) : (
        /* ── 12-ACT GUIDED JOURNEY CONTINUUM (MODE 1) ─────────────────────── */
        <main className="relative z-10 max-w-7xl mx-auto px-6 space-y-48 pt-44 pb-36">
          
          {/* ACT 00: HERO FLAGSHIP HUD WITH SPATIAL GLASS CARD */}
          <section className="relative text-center space-y-8 max-w-4xl mx-auto min-h-[75vh] flex flex-col justify-center items-center">
            
            {/* Subtle Carmin Rose Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#C61C09]/15 blur-[160px] rounded-full pointer-events-none -z-10" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#140f0c] border border-[#2e2724] text-[#C61C09] text-xs font-mono font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AWARD-WINNING DIGITAL STUDIO • NEXT.JS 15</span>
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.02] text-[#f5efe9]">
                Curated for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5efe9] via-[#ffffff] to-[#C61C09]">
                  Bold Ambition.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-[#a89f91] max-w-2xl mx-auto leading-relaxed">
                A focused digital studio building brands, interfaces, and stories that earn attention. We partner with founders and teams to shape ideas into polished digital products.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  href="#contact"
                  className="px-8 py-4 rounded-full bg-[#C61C09] hover:bg-[#d9220e] text-white font-bold text-sm transition-all shadow-2xl shadow-[#C61C09]/30 flex items-center gap-2"
                >
                  <span>Start an Engagement</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setNavMode('atlas')}
                  className="px-7 py-4 rounded-full bg-[#140f0c] border border-[#2e2724] text-[#f5efe9] hover:bg-[#1a1410] font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-xl backdrop-blur-md"
                >
                  <Compass className="w-4 h-4 text-[#C61C09]" />
                  <span>Explore Spatial Atlas</span>
                </motion.button>
              </div>
            </motion.div>

            {/* ── DEDICATED HERO 3D STAGE (BOWLING STRIKE PHYSICS) ──────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-5xl mx-auto mt-8 relative rounded-3xl overflow-hidden border border-[#2e2724] bg-[#0a0b0e] shadow-2xl shadow-black/80 aspect-[16/10] sm:h-[540px]"
            >
              {/* Top HUD bar */}
              <div className="absolute top-4 inset-x-6 z-20 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#140f0c]/90 border border-[#2e2724] text-[11px] font-mono text-[#a89f91] backdrop-blur-xl">
                  <span className="w-2 h-2 rounded-full bg-[#C61C09] animate-ping" />
                  <span className="text-[#f5efe9] font-bold">RIGID BODY STRIKE</span>
                  <span className="text-[#786e64]">|</span>
                  <span className="text-[#00d4ff]">BLENDER 5.2.1 LTS DEPSGRAPH</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#140f0c]/90 border border-[#2e2724] text-[11px] font-mono text-[#a89f91] backdrop-blur-xl">
                  <Eye className="w-3.5 h-3.5 text-[#C61C09]" />
                  <span>DRAG TO TILT VIEW</span>
                </div>
              </div>

              {/* 3D WebGL Canvas */}
              <div className="w-full h-full relative">
                <EngineCanvas
                  navMode={navMode}
                  scrollProgress={scrollProgress}
                  activeProject={activeProject}
                  atlasPan={atlasPan}
                />
              </div>

              {/* Bottom Track Pills */}
              <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2 pointer-events-none">
                <span className="px-2.5 py-1 rounded-md bg-[#140f0c]/80 border border-[#2e2724] text-[10px] font-mono font-bold text-[#00d4ff] flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff]" />
                  10 PINS CONVEX HULL
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#140f0c]/80 border border-[#2e2724] text-[10px] font-mono font-bold text-[#C61C09] flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C61C09]" />
                  7KG RESIN BALL
                </span>
              </div>
            </motion.div>

            {/* Velocity Proof Metrics */}
            <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl border-t border-[#2e2724]/60">
              {[
                { val: '14 DAYS', label: 'DELIVERY VELOCITY' },
                { val: '3.8X', label: 'CLIENT ENGAGEMENT' },
                { val: '99.9%', label: 'SYSTEM RELIABILITY' },
              ].map((m, idx) => (
                <div key={idx} className="space-y-1 text-center">
                  <div className="text-3xl font-black font-mono text-[#f5efe9]">{m.val}</div>
                  <div className="text-[11px] font-mono text-[#a89f91] uppercase tracking-widest">{m.label}</div>
                </div>
              ))}
            </div>

          </section>

          {/* ── CLIENT TICKER MARQUEE ──────────────────────────────────────── */}
          <div className="py-8 border-y border-[#2e2724] overflow-hidden -mx-6">
            <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
              {marqueeClients.concat(marqueeClients).map((c, i) => (
                <div key={i} className="flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-[#786e64] hover:text-[#f5efe9] transition-colors">
                  <span>{c}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C61C09]" />
                </div>
              ))}
            </div>
          </div>

          {/* ACT 01: SCROLL-LIT MANIFESTO */}
          <section className="p-8 sm:p-16 rounded-[36px] bg-[#140f0c]/90 border border-[#2e2724] backdrop-blur-3xl space-y-8 max-w-4xl mx-auto shadow-2xl">
            <div className="text-xs font-mono text-[#C61C09] uppercase tracking-widest font-semibold">
              ACT 01 • SCROLL-LIT MANIFESTO
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold leading-relaxed text-[#f5efe9] space-y-4">
              <p>
                Every word becomes luminous as your gaze traverses the field.
              </p>
              <p className="text-[#a89f91] text-lg sm:text-2xl font-normal">
                Color temperature drifts continuously from cold ink to warm charcoal and rich carmin, establishing emotional narrative progression without abrupt style breaks.
              </p>
            </div>
          </section>

          {/* ACT 02: ORBITAL PROOF RING */}
          <section className="space-y-12">
            <div className="text-center space-y-3">
              <div className="text-xs font-mono text-[#C61C09] uppercase tracking-widest font-semibold">
                ACT 02 • ORBITAL PROOF RING
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5efe9]">Proof with Gravitational Pull</h2>
              <p className="text-sm text-[#a89f91]">Metrics orbit a central thesis instead of sitting in a static grid.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { val: '+320%', label: 'PRE-SALES SURGE' },
                { val: '14 Days', label: 'SPRINT DELIVERY' },
                { val: '$45M+', label: 'SERIES B CAPTURED' },
                { val: '0.00ms', label: 'RUNTIME DESYNC' },
              ].map((m, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#140f0c] border border-[#2e2724] text-center space-y-2">
                  <div className="text-3xl font-black font-mono text-[#C61C09]">{m.val}</div>
                  <div className="text-[11px] font-mono text-[#a89f91] uppercase tracking-wider">{m.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ACT 03: ARCHITECTURAL WORK CORRIDOR */}
          <section id="work-corridor" className="space-y-16">
            <div className="space-y-3 max-w-2xl">
              <div className="text-xs font-mono text-[#C61C09] uppercase tracking-widest font-semibold">
                ACT 03 • 3D ARCHITECTURAL WORK CORRIDOR
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5efe9]">Selected Work & Flagships</h2>
              <p className="text-sm text-[#a89f91]">A curated archive of flagships and systems engineered for market-defining brands.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj, idx) => {
                const isSelected = activeProject === proj.title;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveProject(proj.title)}
                    className="cursor-pointer"
                  >
                    <TactileCard
                      className={`p-8 sm:p-10 rounded-[32px] border transition-all flex flex-col justify-between space-y-8 group ${
                        isSelected
                          ? 'bg-[#1a1410] border-[#C61C09] scale-[1.02] shadow-2xl shadow-[#C61C09]/20'
                          : 'bg-[#140f0c] border-[#2e2724] hover:border-white/30'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono text-[#786e64]">
                          <span>0{idx + 1} / 04</span>
                          <span style={{ color: proj.accent }}>{proj.category}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#f5efe9] group-hover:text-white transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-sm text-[#a89f91] leading-relaxed">{proj.desc}</p>
                        
                        <div className="flex flex-wrap gap-2 pt-2">
                          {proj.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#1e1713] text-[#a89f91] border border-[#2e2724]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-[#2e2724] flex items-center justify-between text-xs">
                        <span className="text-[#a89f91]">Verified Result</span>
                        <span
                          className="font-mono font-bold px-3 py-1 rounded-full border"
                          style={{
                            color: proj.accent,
                            backgroundColor: `${proj.accent}15`,
                            borderColor: `${proj.accent}30`,
                          }}
                        >
                          {proj.impact}
                        </span>
                      </div>
                    </TactileCard>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ACT 05: BENTO CAPABILITIES MATRIX */}
          <section id="capabilities" className="space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="text-xs font-mono text-[#C61C09] uppercase tracking-widest font-semibold">
                ACT 05 • CAPABILITIES MATRIX
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5efe9]">Engineered For Impact</h2>
              <p className="text-sm text-[#a89f91]">Comprehensive design, spatial 3D interfaces, and high-conversion engineering.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {capabilities.map((cap, idx) => {
                const IconComponent = cap.icon;
                return (
                  <TactileCard
                    key={idx}
                    className="p-8 sm:p-10 rounded-[28px] bg-[#140f0c] border border-[#2e2724] hover:border-white/30 transition-all flex flex-col justify-between space-y-8"
                  >
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#1e1713] border border-[#2e2724] flex items-center justify-center font-bold text-[#C61C09]">
                        {cap.badge}
                      </div>
                      <h3 className="text-2xl font-bold text-[#f5efe9]">{cap.title}</h3>
                      <p className="text-sm text-[#a89f91] leading-relaxed">{cap.desc}</p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#2e2724]">
                      <div className="flex flex-wrap gap-2">
                        {cap.tags.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#1e1713] text-[#a89f91] border border-[#2e2724]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#786e64] font-mono uppercase">Deliverable Output</span>
                        <span className="font-semibold font-mono text-[#C61C09]">{cap.outcome}</span>
                      </div>
                    </div>
                  </TactileCard>
                );
              })}
            </div>
          </section>

          {/* ACT 06: METHOD CUBE STATE MACHINE */}
          <section className="p-8 sm:p-12 rounded-[32px] bg-[#140f0c] border border-[#2e2724] space-y-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#C61C09] uppercase tracking-widest font-semibold">
                  ACT 06 • METHODOLOGY STATE MACHINE
                </div>
                <h3 className="text-2xl font-bold">Linear Engineering Sequence</h3>
              </div>
              <div className="flex items-center gap-2">
                {['01 Discovery', '02 Architecture', '03 Synthesis', '04 Release'].map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMethodStep(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      methodStep === idx
                        ? 'bg-[#C61C09] text-white font-bold shadow-lg shadow-[#C61C09]/20'
                        : 'bg-[#1e1713] text-[#a89f91] hover:text-[#f5efe9]'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-[#090706] border border-[#2e2724] flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 max-w-lg">
                <div className="text-xs font-mono text-[#C61C09]">PHASE 0{methodStep + 1} PROTOCOL</div>
                <h4 className="text-2xl font-extrabold text-[#f5efe9]">
                  {methodStep === 0 && 'Evidence Harvesting & Deconstruction'}
                  {methodStep === 1 && 'WebJSON Specification & World-State Mapping'}
                  {methodStep === 2 && 'Modular Component Assembly & 3D Shaders'}
                  {methodStep === 3 && 'Deterministic Release & 1-Click Vercel Deploy'}
                </h4>
                <p className="text-sm text-[#a89f91]">
                  Complete type-safety, hardware-accelerated transitions, and automated verification across all viewports.
                </p>
              </div>
              <div className="w-24 h-24 rounded-2xl bg-[#1a1410] border border-[#C61C09]/40 flex items-center justify-center text-3xl font-black text-[#C61C09] font-mono shadow-2xl shadow-[#C61C09]/20">
                0{methodStep + 1}
              </div>
            </div>
          </section>

          {/* ACT 07: INTERACTIVE CMS FIELD NOTES */}
          <section className="space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#C61C09] uppercase tracking-widest font-semibold">
                ACT 07 • INTERACTIVE CMS COMPONENT
              </div>
              <h2 className="text-3xl font-bold">Interactive Spatial Density Comparator</h2>
            </div>

            <div className="p-8 rounded-3xl bg-[#140f0c] border border-[#2e2724] space-y-6 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono text-[#a89f91]">
                <span>2D FLAT ARCHITECTURE ({100 - fieldComparison}%)</span>
                <span>3D SPATIAL CONTINUUM ({fieldComparison}%)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={fieldComparison}
                onChange={(e) => setFieldComparison(Number(e.target.value))}
                className="w-full cursor-pointer accent-[#C61C09]"
              />
              <p className="text-xs text-[#a89f91] font-mono text-center">
                Drag slider to dynamically balance between DOM accessibility and GPU WebGL density.
              </p>
            </div>
          </section>

          {/* ACT 08: TRANSPARENT PRICING ENGAGEMENTS */}
          <section id="pricing" className="space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="text-xs font-mono text-[#C61C09] uppercase tracking-widest font-semibold">
                ACT 08 • ENGAGEMENTS
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#f5efe9]">Transparent Pricing</h2>
              <p className="text-sm text-[#a89f91]">Sprint formats or dedicated partnership retainers.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {pricingTiers.map((tier, idx) => (
                <TactileCard
                  key={idx}
                  className={`p-8 rounded-[28px] border flex flex-col justify-between space-y-8 ${
                    tier.popular
                      ? 'bg-[#1a1410] border-[#C61C09] shadow-2xl shadow-[#C61C09]/20 scale-105 z-10'
                      : 'bg-[#140f0c] border-[#2e2724]'
                  }`}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-[#f5efe9]">{tier.name}</h3>
                      <div className="text-xs text-[#a89f91] mt-1">{tier.desc}</div>
                    </div>
                    <div className="text-4xl font-extrabold text-[#f5efe9]">
                      {tier.price} <span className="text-xs text-[#786e64]">{tier.period}</span>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-[#2e2724] text-xs text-[#f5efe9]/90">
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-[#C61C09] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-3.5 rounded-full text-xs font-bold text-white bg-[#C61C09] hover:bg-[#d9220e] transition-all shadow-md shadow-[#C61C09]/20 cursor-pointer">
                    Select {tier.name}
                  </button>
                </TactileCard>
              ))}
            </div>
          </section>

          {/* ACT 09: MORPHING PROJECT ESTIMATOR */}
          <section className="p-8 sm:p-14 rounded-[36px] bg-[#140f0c] border border-[#2e2724] space-y-8 shadow-2xl">
            <div className="space-y-2">
              <div className="text-xs font-mono text-[#C61C09] uppercase tracking-widest font-semibold">
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
                    onClick={() => setEstimator((p) => ({ ...p, goal: g }))}
                    className={`w-full p-3.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                      estimator.goal === g
                        ? 'bg-[#C61C09] text-white font-bold shadow-lg shadow-[#C61C09]/20'
                        : 'bg-[#1e1713] text-[#a89f91] hover:text-[#f5efe9]'
                    }`}
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
                    onClick={() => setEstimator((p) => ({ ...p, scope: s }))}
                    className={`w-full p-3.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                      estimator.scope === s
                        ? 'bg-[#C61C09] text-white font-bold shadow-lg shadow-[#C61C09]/20'
                        : 'bg-[#1e1713] text-[#a89f91] hover:text-[#f5efe9]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-[#1e1713] border border-[#2e2724] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#C61C09]">ESTIMATED ARCHITECTURE</div>
                  <div className="text-lg font-bold text-[#f5efe9]">{estimator.goal}</div>
                  <div className="text-xs text-[#a89f91]">{estimator.scope}</div>
                </div>
                <a
                  href="#contact"
                  className="w-full py-3 rounded-xl bg-[#C61C09] hover:bg-[#d9220e] text-white font-bold text-xs text-center transition-all shadow-lg shadow-[#C61C09]/30"
                >
                  Initiate Sprint Protocol
                </a>
              </div>
            </div>
          </section>

          {/* ACT 10: FAQ ACCORDION */}
          <section id="faq" className="space-y-12 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="text-xs font-mono text-[#C61C09] uppercase tracking-widest font-semibold">
                ACT 10 • FREQUENTLY ASKED QUESTIONS
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#f5efe9]">Clear Answers to Common Questions</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="rounded-2xl bg-[#140f0c] border border-[#2e2724] overflow-hidden transition-all">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                    >
                      <span className="font-semibold text-sm sm:text-base text-[#f5efe9]">{item.q}</span>
                      <span className="text-[#C61C09]">{isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}</span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-xs sm:text-sm text-[#a89f91] border-t border-[#2e2724] pt-4 leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ACT 11 & 12: LIQUID CONTACT & MONUMENTAL FOOTER */}
          <footer id="contact" className="space-y-16 pt-24 border-t border-[#2e2724] text-center">
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="text-xs font-mono text-[#C61C09] uppercase tracking-widest font-semibold">
                ACT 11 • PROTOCOL INITIATION
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                Make something impossible to confuse with anyone else.
              </h2>
              <p className="text-sm text-[#a89f91]">
                Engineered with Nümtema Experience Engine M03.7 • Paris • Zurich • Tokyo
              </p>
              <div className="pt-2">
                <a
                  href="mailto:hello@pixera.studio"
                  className="inline-block px-8 py-4 rounded-full bg-[#C61C09] hover:bg-[#d9220e] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-2xl shadow-[#C61C09]/40"
                >
                  Start A Project Protocol
                </a>
              </div>
            </div>

            {/* MONUMENTAL WORDMARK */}
            <div className="pt-16 text-center select-none overflow-hidden">
              <div className="text-[12vw] font-black tracking-tighter text-[#140f0c] hover:text-[#C61C09]/20 transition-all leading-none truncate">
                {brandName.toUpperCase()}
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#786e64] max-w-7xl mx-auto">
              <div>© {new Date().getFullYear()} {brandName}. All rights reserved.</div>
              <div className="flex gap-6 mt-4 sm:mt-0">
                <a href="#work-corridor" className="hover:text-[#f5efe9] transition-colors">Work</a>
                <a href="#capabilities" className="hover:text-[#f5efe9] transition-colors">Capabilities</a>
                <a href="#pricing" className="hover:text-[#f5efe9] transition-colors">Pricing</a>
                <a href="#faq" className="hover:text-[#f5efe9] transition-colors">FAQ</a>
              </div>
            </div>
          </footer>

        </main>
      )}

    </div>
  );
}
