'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Play, RotateCcw, Zap, Volume2, VolumeX, 
  MapPin, Calendar, Users, Wine, Award, CheckCircle2, ChevronRight,
  Flame, Clock, Trophy, GlassWater, UtensilsCrossed, Disc3, Compass
} from 'lucide-react';
import { EngineCanvas } from '../canvas/EngineCanvas';

export const NormandyBowlingHero: React.FC = () => {
  const [activeBall, setActiveBall] = useState<'gold' | 'ruby' | 'cobalt' | 'emerald'>('gold');
  const [activeCam, setActiveCam] = useState<'piste' | 'quilles' | 'drone'>('piste');
  const [isSlowMo, setIsSlowMo] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [triggerStrike, setTriggerStrike] = useState<number>(0);
  const [scoreNotification, setScoreNotification] = useState<string | null>(null);

  // Booking Form State
  const [selectedCity, setSelectedCity] = useState<'Deauville' | 'Rouen' | 'Caen'>('Deauville');
  const [selectedPlayers, setSelectedPlayers] = useState<number>(4);
  const [selectedTime, setSelectedTime] = useState<string>('20:00');
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);

  const handleImpact = () => {
    setScoreNotification('PERFECT STRIKE ! +300 PTS');
    setTimeout(() => {
      setScoreNotification(null);
    }, 2800);
  };

  const handleTriggerStrike = () => {
    setTriggerStrike((prev) => prev + 1);
  };

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between overflow-hidden pt-24 pb-12 px-4 sm:px-6 lg:px-10">
      
      {/* ── 1. FULLSCREEN 3D WEBGL BOWLING BACKGROUND ───────────────────────── */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <EngineCanvas
          activeBall={activeBall}
          activeCam={activeCam}
          isSlowMo={isSlowMo}
          isMuted={isMuted}
          triggerStrike={triggerStrike}
          onImpact={handleImpact}
        />
        {/* Subtle Vignette & Contrast Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-[#07090e]/60 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#07090e]/80 to-transparent pointer-events-none hidden lg:block" />
      </div>

      {/* ── 2. TOP FLOATING STATUS HUD ─────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0d121c]/80 backdrop-blur-xl border border-[#2b3548]/70 text-xs font-mono tracking-wider shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-[#e5b54f] animate-pulse" />
          <span className="text-[#e5b54f] font-semibold">16 PISTES BRUNSWICK PRO OUVERTES</span>
          <span className="text-[#4e5c75]">|</span>
          <span className="text-[#a4b3cf]">DEAUVILLE • ROUEN • CAEN</span>
        </div>

        {/* Live Strike Alert */}
        <AnimatePresence>
          {scoreNotification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1.05, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#e5b54f] via-[#ffd269] to-[#ff4444] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-[#e5b54f]/60 flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-black" />
              <span>{scoreNotification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sound & Telemetry Badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="px-3 py-1.5 rounded-full bg-[#0d121c]/80 backdrop-blur-xl border border-[#2e3d57] hover:bg-[#1f2a3f] text-[#cbd5e1] text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer shadow-xl"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#e5b54f]" />}
            <span>{isMuted ? 'SON COUPÉ' : 'AUDIO 3D ACTIF'}</span>
          </button>
        </div>
      </div>

      {/* ── 3. CENTER HERO EDITORIAL CONTENT & INTERACTIVE CONTROLS ─────────── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        
        {/* Left Editorial Branding */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e5b54f]/15 border border-[#e5b54f]/30 text-xs font-mono text-[#e5b54f]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LE FLEURON DU BOWLING & LOUNGE EN NORMANDIE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.03] drop-shadow-2xl">
              L&apos;Art du Strike.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7e0a3] via-[#e5b54f] to-[#ffaa40]">
                L&apos;Élégance Normande.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-[#cbd5e1] max-w-2xl leading-relaxed drop-shadow-md">
              16 pistes de précision Brunswick Pro huilées haute compétition, mixologie au Calvados d&apos;âge,
              planches gourmandes du terroir et ambiance sonore feutrée face à la Côte Fleurie.
            </p>
          </motion.div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#reserver"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-[#e5b54f] via-[#f0c56b] to-[#d49929] hover:opacity-95 text-black font-extrabold text-sm uppercase tracking-wider shadow-2xl shadow-[#e5b54f]/40 flex items-center gap-2.5 transition-all cursor-pointer active:scale-98"
            >
              <span>RÉSERVER UNE PISTE</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={handleTriggerStrike}
              className="px-7 py-4 rounded-full bg-[#0d121c]/80 backdrop-blur-xl border border-[#e5b54f]/50 hover:bg-[#1a2332] text-[#f7e0a3] font-bold text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer shadow-xl"
            >
              <RotateCcw className="w-4 h-4 text-[#e5b54f]" />
              <span>LANCER LE STRIKE</span>
            </button>
          </div>
        </div>

        {/* Right Floating Interactive 3D Control Center */}
        <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-3">
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0c1017]/80 backdrop-blur-2xl border border-[#2b374d]/80 shadow-2xl space-y-4 max-w-md w-full">
            
            <div className="flex items-center justify-between border-b border-[#222e42] pb-3">
              <span className="text-xs font-mono font-bold text-[#e5b54f] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#e5b54f]" />
                <span>STUDIO 3D INTERACTIF</span>
              </span>
              <span className="text-[11px] font-mono text-[#64748b]">BOULE • CAMÉRA • VITESSE</span>
            </div>

            {/* Ball Finish Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-[#94a3b8] uppercase tracking-wider block">Finition de la Boule :</span>
              <div className="grid grid-cols-3 gap-1.5 bg-[#121824]/90 p-1 rounded-2xl border border-[#253247]">
                <button
                  onClick={() => setActiveBall('gold')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeBall === 'gold' ? 'bg-[#e5b54f] text-black shadow-lg shadow-[#e5b54f]/30' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#ffd700]" />
                  <span>Or 24K</span>
                </button>
                <button
                  onClick={() => setActiveBall('ruby')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeBall === 'ruby' ? 'bg-[#c61c09] text-white shadow-lg shadow-[#c61c09]/30' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#ff3333]" />
                  <span>Ruby</span>
                </button>
                <button
                  onClick={() => setActiveBall('cobalt')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeBall === 'cobalt' ? 'bg-[#0088ff] text-white shadow-lg shadow-[#0088ff]/30' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
                  <span>Cobalt</span>
                </button>
              </div>
            </div>

            {/* Camera View Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-[#94a3b8] uppercase tracking-wider block">Point de Vue Caméra :</span>
              <div className="grid grid-cols-3 gap-1.5 bg-[#121824]/90 p-1 rounded-2xl border border-[#253247]">
                <button
                  onClick={() => setActiveCam('piste')}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                    activeCam === 'piste' ? 'bg-[#2b3952] text-[#f7e0a3]' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Piste
                </button>
                <button
                  onClick={() => setActiveCam('quilles')}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                    activeCam === 'quilles' ? 'bg-[#2b3952] text-[#f7e0a3]' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Quilles
                </button>
                <button
                  onClick={() => setActiveCam('drone')}
                  className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                    activeCam === 'drone' ? 'bg-[#2b3952] text-[#f7e0a3]' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Drone
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setIsSlowMo(!isSlowMo)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                  isSlowMo
                    ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00f0ff]'
                    : 'bg-[#121824] border-[#253247] text-[#94a3b8] hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isSlowMo ? 'SLOW-MO 0.25X' : 'SLOW-MO'}</span>
              </button>

              <button
                onClick={handleTriggerStrike}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#e5b54f] to-[#c79124] hover:from-[#f5c667] hover:to-[#e5b54f] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#e5b54f]/30 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-black" />
                <span>LANCER</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ── 4. FLOATING NORMANDY INSTANT BOOKING BAR ────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-[#0a0f18]/85 backdrop-blur-2xl border border-[#2b384e]/80 p-4 sm:p-5 shadow-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
            
            {/* Ville */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#e5b54f]" />
                <span>Complexe Normand</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as any)}
                className="w-full bg-[#121824] border border-[#253247] rounded-xl px-3 py-2 text-sm text-[#f1f5f9] font-medium focus:outline-none focus:border-[#e5b54f]"
              >
                <option value="Deauville">Deauville (Front de Mer)</option>
                <option value="Rouen">Rouen (Docks Rive Droite)</option>
                <option value="Caen">Caen (Presqu&apos;île Rive Gauche)</option>
              </select>
            </div>

            {/* Joueurs */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#e5b54f]" />
                <span>Joueurs</span>
              </label>
              <select
                value={selectedPlayers}
                onChange={(e) => setSelectedPlayers(Number(e.target.value))}
                className="w-full bg-[#121824] border border-[#253247] rounded-xl px-3 py-2 text-sm text-[#f1f5f9] font-medium focus:outline-none focus:border-[#e5b54f]"
              >
                <option value={2}>2 Joueurs (Piste Duo)</option>
                <option value={4}>4 Joueurs (Piste Standard)</option>
                <option value={6}>6 Joueurs (Piste Amis)</option>
                <option value={8}>8+ Joueurs (Salon VIP)</option>
              </select>
            </div>

            {/* Heure */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#e5b54f]" />
                <span>Créneau</span>
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-[#121824] border border-[#253247] rounded-xl px-3 py-2 text-sm text-[#f1f5f9] font-medium focus:outline-none focus:border-[#e5b54f]"
              >
                <option value="18:30">18:30 (Afterwork)</option>
                <option value="20:00">20:00 (Soirée Strike & Cocktails)</option>
                <option value="21:30">21:30 (Cosmic DJ Set)</option>
                <option value="23:00">23:00 (Night Owl)</option>
              </select>
            </div>

            {/* Formule */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
                <Wine className="w-3.5 h-3.5 text-[#e5b54f]" />
                <span>Formule</span>
              </label>
              <div className="px-3 py-2 bg-[#121824] border border-[#253247] rounded-xl text-xs font-semibold text-[#e5b54f] flex items-center justify-between">
                <span>Strike + Planche AOP</span>
                <Sparkles className="w-3.5 h-3.5 text-[#e5b54f]" />
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2 sm:pt-0">
              <button
                onClick={() => setBookingConfirmed(true)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#e5b54f] to-[#c79124] hover:from-[#f5c667] hover:to-[#e5b54f] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#e5b54f]/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <span>RÉSERVER EN DIRECT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal / Alert confirmation */}
          <AnimatePresence>
            {bookingConfirmed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-[#253247] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#e5b54f]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[#f1f5f9]">
                    Piste confirmée à <strong className="text-[#e5b54f]">{selectedCity}</strong> pour <strong>{selectedPlayers} joueurs</strong> à <strong>{selectedTime}</strong>.
                  </span>
                </div>
                <button
                  onClick={() => setBookingConfirmed(false)}
                  className="px-3 py-1 rounded-lg bg-[#253247] text-[#cbd5e1] hover:text-white cursor-pointer"
                >
                  Fermer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </section>
  );
};
