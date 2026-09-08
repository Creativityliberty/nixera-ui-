'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import { 
  Sparkles, ArrowRight, Check, MapPin, Trophy, Clock, 
  Phone, Users, Wine, UtensilsCrossed, Disc3, ShieldCheck,
  ChevronRight, Calendar, Star, Flame
} from 'lucide-react';
import { NormandyBowlingHero } from './sections/NormandyBowlingHero';

export function ExperienceRenderer() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [activeTab, setActiveTab] = useState<'deauville' | 'rouen' | 'caen'>('deauville');

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const venues = {
    deauville: {
      name: 'L’Académie Deauville — Côte Fleurie',
      address: '14 Boulevard de la Mer, 14800 Deauville',
      hours: 'Ouvert 7j/7 • 14h00 – 02h00',
      phone: '02 31 88 12 14',
      lanes: '16 Pistes Pro Brunswick + 4 Salons VIP',
      perks: ['Vue mer & terrasse lounge', 'Cidrothèque Grand Cru', 'Service à la piste'],
    },
    rouen: {
      name: 'L’Académie Rouen — Docks Rive Droite',
      address: 'Hangar 108, Quai Jean de Béthencourt, 76000 Rouen',
      hours: 'Ouvert 7j/7 • 12h00 – 02h00',
      phone: '02 35 70 80 90',
      lanes: '20 Pistes Pro Brunswick + Espace Arcade 4K',
      perks: ['Ambiance Docks & Briques industrielles', 'Planches normandes chaudes', 'Écran géant 4K'],
    },
    caen: {
      name: 'L’Académie Caen — Presqu’île',
      address: '22 Quai François Mitterrand, 14000 Caen',
      hours: 'Ouvert 7j/7 • 14h00 – 02h00',
      phone: '02 31 50 40 30',
      lanes: '14 Pistes Pro Brunswick + Bar à Gin Normand',
      perks: ['Cadre presqu’île contemporain', 'DJ sets vendredis & samedis', 'Tournois homologués FFBSQ'],
    },
  };

  const pricingOffers = [
    {
      name: 'Partie Découverte',
      price: '8,50 €',
      period: '/ partie / pers.',
      popular: false,
      desc: 'Idéal pour une partie entre amis ou en famille en journée.',
      features: [
        '1 partie de 10 frames sur piste Brunswick Pro',
        'Location des chaussures de bowling incluse',
        'Système de score tactile & rediffusion ralenti',
        'Barrières automatiques pour enfants disponibles',
      ],
    },
    {
      name: 'Formule Strike & Terroir',
      price: '24,00 €',
      period: '/ pers.',
      popular: true,
      desc: 'L’expérience complète : 2 parties, cocktail signature et planche gourmande.',
      features: [
        '2 parties complètes de bowling',
        'Chaussures de bowling incluses',
        '1 cocktail création au Calvados (ou mocktail)',
        'Planche de fromages AOP normands & charcuterie fine',
        'Réservation prioritaire de la piste',
      ],
    },
    {
      name: 'Salon VIP Privatif',
      price: '45,00 €',
      period: '/ pers. (min 6 pers.)',
      popular: false,
      desc: 'Espace lounge privatisé avec service dédié, champagne ou cidre millésimé.',
      features: [
        'Accès illimité aux pistes VIP privatisées (2h30)',
        'Service cocktailier & sommelier à la piste',
        'Buffet traiteur normand chaud & froid',
        'Bouteille de Cidre Grand Cru ou Champagne offerte',
        'Écrans dédiés pour musique & vidéos privées',
      ],
    },
  ];

  const cocktails = [
    {
      name: 'Deauville Sunset',
      category: 'Cocktail Signature',
      desc: 'Calvados 12 ans Pays d’Auge, jus de pomme trouble normand pressé au pressoir, ginger beer artisanale, cannelle rôtie.',
      price: '14 €',
    },
    {
      name: 'Le Gin du Bocage',
      category: 'Mixologie Botanique',
      desc: 'Gin artisanal distillé en Normandie aux 30 botaniques, tonic baie de genièvre, zeste de citron vert et romarin frais.',
      price: '13 €',
    },
    {
      name: 'Cidre Extra-Brut Millésimé',
      category: 'Cidrerie d’Exception',
      desc: 'Cidre fermier biologique médaille d’or, fermentation naturelle sur lie en fût de chêne normand.',
      price: '9 € / verre • 28 € / bouteille',
    },
    {
      name: 'Le Camembert Rôti de Normandie',
      category: 'Tapas & Terroir Chaud',
      desc: 'Camembert AOP entier cuit au four avec miel d’acacia normand, noisettes torréfiées et pain au levain croustillant.',
      price: '16 €',
    },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#07090e] text-[#f4f6fa] antialiased selection:bg-[#e5b54f] selection:text-[#07090e] overflow-x-hidden font-sans">
      
      {/* ── TOP SCROLL PROGRESS BAR ───────────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[100]"
        style={{
          scaleX,
          background: 'linear-gradient(to right, #e5b54f, #ffffff, #c61c09)',
        }}
      />

      {/* ── LUXURY NORMANDY NAVBAR ────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#07090e]/85 backdrop-blur-2xl border-b border-[#1f2838]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e5b54f] to-[#aa771c] text-black flex items-center justify-center font-black text-base shadow-lg shadow-[#e5b54f]/25">
              ⚜
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#f4f6fa] block">
                L’ACADÉMIE DU BOWL
              </span>
              <span className="text-[10px] font-mono text-[#e5b54f] uppercase tracking-widest block -mt-0.5">
                NORMANDIE LOUNGE & CLUB
              </span>
            </div>
          </a>

          {/* Center Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-[#94a3b8]">
            <a href="#pistes" className="hover:text-[#e5b54f] transition-colors">PISTES & TARIFS</a>
            <a href="#lounge" className="hover:text-[#e5b54f] transition-colors">BAR & TERROIR</a>
            <a href="#evenements" className="hover:text-[#e5b54f] transition-colors">ÉVÉNEMENTS & DJ</a>
            <a href="#lieux" className="hover:text-[#e5b54f] transition-colors">NOS 3 COMPLEXES</a>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <a
              href="tel:0231881214"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#111722] border border-[#263348] text-xs font-mono text-[#cbd5e1] hover:text-white transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#e5b54f]" />
              <span>02 31 88 12 14</span>
            </a>

            <a
              href="#reserver"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#e5b54f] to-[#c79124] hover:from-[#f5c667] hover:to-[#e5b54f] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#e5b54f]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>RÉSERVER UNE PISTE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* ── 1. HERO SECTION (INTERACTIVE 3D STRIKE SIMULATOR) ──────────────── */}
      <NormandyBowlingHero />

      {/* ── 2. PISTES & TARIFS SECTION ────────────────────────────────────── */}
      <section id="pistes" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121824] border border-[#233045] text-xs font-mono text-[#e5b54f]">
            <Trophy className="w-3.5 h-3.5" />
            <span>ÉQUIPEMENT HOMOLOGUÉ BRUNSWICK PRO</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f4f6fa]">
            Pistes de Compétition & Tarifs
          </h2>
          <p className="text-sm sm:text-base text-[#94a3b8]">
            Chaque piste bénéficie d’un huilage quotidien de niveau tournoi, de boules ergonomiques équilibrées et d’écrans tactiles 4K haute fidélité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingOffers.map((offer, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 space-y-6 flex flex-col justify-between transition-all ${
                offer.popular
                  ? 'bg-gradient-to-b from-[#131b28] to-[#0d121c] border-2 border-[#e5b54f] shadow-2xl shadow-[#e5b54f]/15 relative'
                  : 'bg-[#0c1017] border border-[#222c3d] hover:border-[#354560]'
              }`}
            >
              {offer.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#e5b54f] text-black font-black text-[11px] uppercase tracking-wider shadow-lg">
                  Formule Plébiscitée en Normandie
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#f4f6fa]">{offer.name}</h3>
                  <p className="text-xs text-[#8292aa]">{offer.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#f4f6fa]">{offer.price}</span>
                  <span className="text-xs font-mono text-[#8292aa]">{offer.period}</span>
                </div>

                <div className="pt-4 border-t border-[#222c3d] space-y-3">
                  {offer.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#cbd5e1]">
                      <Check className="w-4 h-4 text-[#e5b54f] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="#reserver"
                className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  offer.popular
                    ? 'bg-[#e5b54f] hover:bg-[#f0c56b] text-black shadow-lg shadow-[#e5b54f]/25'
                    : 'bg-[#151c2a] hover:bg-[#1e283c] text-white border border-[#2e3d57]'
                }`}
              >
                <span>Choisir cette formule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. LOUNGE, COCKTAILS & TERROIR NORMAND ────────────────────────── */}
      <section id="lounge" className="py-24 bg-[#090d14] border-y border-[#182130] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#151c2a] border border-[#28364e] text-xs font-mono text-[#e5b54f]">
                <Wine className="w-3.5 h-3.5" />
                <span>MIXOLOGIE & GASTRONOMIE DU BOCAGE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f4f6fa]">
                Le Lounge Normand : Calvados, Cidres & Planches AOP
              </h2>
            </div>
            <p className="text-sm text-[#94a3b8] max-w-md">
              Notre chef barman revisite les trésors de la Normandie dans une ambiance feutrée aux lumières ambrées.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cocktails.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#0d121c] border border-[#222c3d] hover:border-[#e5b54f]/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-[#e5b54f] uppercase tracking-wider">{item.category}</span>
                    <h3 className="text-xl font-bold text-[#f4f6fa]">{item.name}</h3>
                  </div>
                  <span className="text-lg font-black font-mono text-[#e5b54f] px-3 py-1 rounded-xl bg-[#151c2a] border border-[#28364e]">
                    {item.price}
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. NOS 3 COMPLEXES EN NORMANDIE ──────────────────────────────── */}
      <section id="lieux" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#121824] border border-[#233045] text-xs font-mono text-[#e5b54f]">
            <MapPin className="w-3.5 h-3.5" />
            <span>3 ADRESSES D’EXCEPTION EN NORMANDIE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#f4f6fa]">
            Où Nous Retrouver
          </h2>
          <p className="text-sm sm:text-base text-[#94a3b8]">
            Choisissez votre complexe pour consulter les horaires, pistes disponibles et options de privatisation.
          </p>

          {/* Venue Tabs */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('deauville')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'deauville'
                  ? 'bg-[#e5b54f] text-black shadow-lg shadow-[#e5b54f]/25'
                  : 'bg-[#121824] text-[#94a3b8] border border-[#233045] hover:text-white'
              }`}
            >
              Deauville (Côte Fleurie)
            </button>
            <button
              onClick={() => setActiveTab('rouen')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rouen'
                  ? 'bg-[#e5b54f] text-black shadow-lg shadow-[#e5b54f]/25'
                  : 'bg-[#121824] text-[#94a3b8] border border-[#233045] hover:text-white'
              }`}
            >
              Rouen (Docks)
            </button>
            <button
              onClick={() => setActiveTab('caen')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'caen'
                  ? 'bg-[#e5b54f] text-black shadow-lg shadow-[#e5b54f]/25'
                  : 'bg-[#121824] text-[#94a3b8] border border-[#233045] hover:text-white'
              }`}
            >
              Caen (Presqu’île)
            </button>
          </div>
        </div>

        {/* Active Venue Card */}
        <div className="rounded-3xl p-8 bg-[#0d121c] border border-[#253247] shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-4 lg:col-span-2">
            <div className="inline-block px-3 py-1 rounded-full bg-[#1a2334] text-xs font-mono text-[#e5b54f]">
              COMPLEXE FLAGSHIP
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#f4f6fa]">
              {venues[activeTab].name}
            </h3>
            <p className="text-sm text-[#cbd5e1] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#e5b54f]" />
              <span>{venues[activeTab].address}</span>
            </p>
            <p className="text-sm text-[#cbd5e1] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#e5b54f]" />
              <span>{venues[activeTab].hours}</span>
            </p>
            <p className="text-sm text-[#cbd5e1] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#e5b54f]" />
              <span>{venues[activeTab].lanes}</span>
            </p>

            <div className="pt-4 flex flex-wrap gap-2">
              {venues[activeTab].perks.map((perk, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-[#141b26] border border-[#27354c] text-xs font-medium text-[#94a3b8]">
                  ✓ {perk}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#121824] border border-[#27354c] space-y-4 text-center">
            <div className="text-xs font-mono text-[#8292aa] uppercase tracking-wider">Réservation directe</div>
            <div className="text-2xl font-black text-[#e5b54f] font-mono">{venues[activeTab].phone}</div>
            <a
              href="tel:0231881214"
              className="w-full py-3 rounded-xl bg-[#e5b54f] hover:bg-[#f0c56b] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-[#e5b54f]/25"
            >
              <span>Appeler le Complexe</span>
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-[#182130] bg-[#05070a] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#64748b]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#e5b54f] text-black font-black flex items-center justify-center text-xs">
              ⚜
            </div>
            <span className="text-[#cbd5e1] font-semibold">L’ACADÉMIE DU BOWL NORMANDIE</span>
            <span>© 2026 Tous droits réservés.</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>DEAUVILLE • ROUEN • CAEN</span>
            <span>BRUNSWICK PRO CERTIFIED</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
