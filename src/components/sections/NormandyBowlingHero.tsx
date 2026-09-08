'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Play, RotateCcw, Zap, Volume2, VolumeX, 
  MapPin, Calendar, Users, Wine, Award, CheckCircle2, ChevronRight,
  Flame, Clock, Trophy, GlassWater, UtensilsCrossed, Disc3
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
    <section className="relative w-full min-h-screen bg-[#07090e] text-[#f4f6fa] overflow-hidden pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      
      {/* ── AMBIENT RADIAL LIGHTING ────────────────────────────────────────── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#e5b54f]/12 via-[#c61c09]/8 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#00f0ff]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* ── TOP BADGE & BRAND TITLE ──────────────────────────────────────── */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#131924] border border-[#2b3548] text-xs font-mono tracking-wider shadow-xl"
          >
            <span className="w-2 h-2 rounded-full bg-[#e5b54f] animate-pulse" />
            <span className="text-[#e5b54f] font-semibold">LE FLEURON DU BOWLING & LOUNGE EN NORMANDIE</span>
            <span className="text-[#4e5c75]">|</span>
            <span className="text-[#a4b3cf]">DEAUVILLE • ROUEN • CAEN</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.04]"
          >
            L&apos;Art du Strike.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7e0a3] via-[#e5b54f] to-[#ffaa40]">
              L&apos;Élégance Normande.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-[#94a3b8] max-w-3xl mx-auto leading-relaxed"
          >
            16 pistes synthétiques Brunswick Pro huilées haute précision, mixologie au Calvados d&apos;âge,
            planches du terroir normand et ambiance sonore lounge au bord de la Côte Fleurie.
          </motion.p>
        </div>

        {/* ── 3D INTERACTIVE BOWLING ARENA ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-3xl overflow-hidden border border-[#263145] bg-[#0c1017] shadow-2xl shadow-black/80"
        >
          {/* Top Arena HUD Header */}
          <div className="absolute top-0 inset-x-0 z-20 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 bg-gradient-to-b from-[#0c1017]/95 via-[#0c1017]/75 to-transparent backdrop-blur-md border-b border-[#263145]/60">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#151c2a] border border-[#2e3d57] text-xs font-mono text-[#e5b54f]">
                <Flame className="w-3.5 h-3.5 text-[#ff8833] animate-bounce" />
                <span>PISTE #07 • BRUNSWICK SYNC PRO</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151c2a] border border-[#2e3d57] text-xs font-mono text-[#38bdf8]">
                <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>HUILAGE TOURNOI 41FT</span>
              </div>
            </div>

            {/* Score Notification Popup */}
            <AnimatePresence>
              {scoreNotification && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1.05, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#e5b54f] to-[#c61c09] text-black font-black text-sm uppercase tracking-wider shadow-2xl shadow-[#e5b54f]/50 flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4 text-black" />
                  <span>{scoreNotification}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sound & Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl bg-[#151c2a] border border-[#2e3d57] hover:bg-[#1f2a3f] text-[#cbd5e1] transition-all cursor-pointer"
                title={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#e5b54f]" />}
              </button>
              <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-[#64748b] bg-[#151c2a] px-3 py-1.5 rounded-xl border border-[#2e3d57]">
                <span>DRAG POUR PIVOTER 3D</span>
              </div>
            </div>
          </div>

          {/* 3D WebGL Canvas Viewport */}
          <div className="w-full h-[520px] sm:h-[580px] relative">
            <EngineCanvas
              activeBall={activeBall}
              activeCam={activeCam}
              isSlowMo={isSlowMo}
              isMuted={isMuted}
              triggerStrike={triggerStrike}
              onImpact={handleImpact}
            />
          </div>

          {/* Bottom Arena Interactive Control Dock */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-4 sm:p-5 bg-gradient-to-t from-[#0c1017] via-[#0c1017]/90 to-transparent backdrop-blur-md border-t border-[#263145]/60 flex flex-wrap items-center justify-between gap-4">
            
            {/* Ball Finish Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider hidden sm:inline">Boule :</span>
              <div className="flex items-center gap-1.5 bg-[#151c2a] p-1 rounded-2xl border border-[#2e3d57]">
                <button
                  onClick={() => setActiveBall('gold')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeBall === 'gold' ? 'bg-[#e5b54f] text-black shadow-lg shadow-[#e5b54f]/30' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffd700]" />
                  <span>Or Normand</span>
                </button>
                <button
                  onClick={() => setActiveBall('ruby')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeBall === 'ruby' ? 'bg-[#c61c09] text-white shadow-lg shadow-[#c61c09]/30' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff3333]" />
                  <span>Ruby Deauville</span>
                </button>
                <button
                  onClick={() => setActiveBall('cobalt')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeBall === 'cobalt' ? 'bg-[#0088ff] text-white shadow-lg shadow-[#0088ff]/30' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]" />
                  <span>Cobalt Manche</span>
                </button>
              </div>
            </div>

            {/* Camera View Angle Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider hidden md:inline">Caméra :</span>
              <div className="flex items-center gap-1 bg-[#151c2a] p-1 rounded-2xl border border-[#2e3d57]">
                <button
                  onClick={() => setActiveCam('piste')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeCam === 'piste' ? 'bg-[#2e3d57] text-[#f7e0a3]' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Vue Piste
                </button>
                <button
                  onClick={() => setActiveCam('quilles')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeCam === 'quilles' ? 'bg-[#2e3d57] text-[#f7e0a3]' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Quilles (Impact)
                </button>
                <button
                  onClick={() => setActiveCam('drone')}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeCam === 'drone' ? 'bg-[#2e3d57] text-[#f7e0a3]' : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  Drone VIP
                </button>
              </div>
            </div>

            {/* Strike Trigger & Slow-Mo Buttons */}
            <div className="flex items-center gap-2.5 ml-auto">
              <button
                onClick={() => setIsSlowMo(!isSlowMo)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                  isSlowMo
                    ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00f0ff]'
                    : 'bg-[#151c2a] border-[#2e3d57] text-[#94a3b8] hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isSlowMo ? 'SLOW-MO 0.28X' : 'SLOW-MO'}</span>
              </button>

              <button
                onClick={handleTriggerStrike}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#e5b54f] to-[#d49929] hover:from-[#f0c56b] hover:to-[#e5b54f] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#e5b54f]/30 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-black" />
                <span>LANCER LE STRIKE</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── FAST VIP RESERVATION BAR (NORMANDIE BOOKING DOCK) ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-gradient-to-r from-[#101622] via-[#151c2a] to-[#101622] border border-[#2e3d57] p-4 sm:p-6 shadow-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            
            {/* Ville */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#e5b54f]" />
                <span>Complexe Normand</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value as any)}
                className="w-full bg-[#0a0d14] border border-[#2e3d57] rounded-xl px-3 py-2 text-sm text-[#f1f5f9] font-medium focus:outline-none focus:border-[#e5b54f]"
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
                <span>Nombre de Joueurs</span>
              </label>
              <select
                value={selectedPlayers}
                onChange={(e) => setSelectedPlayers(Number(e.target.value))}
                className="w-full bg-[#0a0d14] border border-[#2e3d57] rounded-xl px-3 py-2 text-sm text-[#f1f5f9] font-medium focus:outline-none focus:border-[#e5b54f]"
              >
                <option value={2}>2 Joueurs (Piste Duo)</option>
                <option value={4}>4 Joueurs (Piste Standard)</option>
                <option value={6}>6 Joueurs (Piste Conviviale)</option>
                <option value={8}>8+ Joueurs (Salon VIP Privé)</option>
              </select>
            </div>

            {/* Heure */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#e5b54f]" />
                <span>Créneau Souhaité</span>
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-[#0a0d14] border border-[#2e3d57] rounded-xl px-3 py-2 text-sm text-[#f1f5f9] font-medium focus:outline-none focus:border-[#e5b54f]"
              >
                <option value="18:30">18:30 (Afterwork Normandie)</option>
                <option value="20:00">20:00 (Soirée Strike & Cocktails)</option>
                <option value="21:30">21:30 (Cosmic Glow & DJ Set)</option>
                <option value="23:00">23:00 (Night Owl Session)</option>
              </select>
            </div>

            {/* Formule */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
                <Wine className="w-3.5 h-3.5 text-[#e5b54f]" />
                <span>Formule & Dégustation</span>
              </label>
              <div className="px-3 py-2 bg-[#0a0d14] border border-[#2e3d57] rounded-xl text-xs font-semibold text-[#e5b54f] flex items-center justify-between">
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
                className="mt-4 pt-4 border-t border-[#2e3d57] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#e5b54f]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[#f1f5f9]">
                    Piste pré-réservée à <strong className="text-[#e5b54f]">{selectedCity}</strong> pour <strong>{selectedPlayers} joueurs</strong> à <strong>{selectedTime}</strong>.
                  </span>
                </div>
                <button
                  onClick={() => setBookingConfirmed(false)}
                  className="px-3 py-1 rounded-lg bg-[#2e3d57] text-[#cbd5e1] hover:text-white cursor-pointer"
                >
                  Fermer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── NORMANDY PRESTIGE PILLARS (BENTO HIGHLIGHTS) ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-[#0c1017] border border-[#222c3d] space-y-2 hover:border-[#e5b54f]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#e5b54f]/10 text-[#e5b54f] flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-[#f1f5f9]">16 Pistes Pro Brunswick</h2>
            <p className="text-xs text-[#8292aa] leading-relaxed">
              Huilage compétition haute régularité, quilles Brunswick Max et suivi de trajectoire vidéo ralenti.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1017] border border-[#222c3d] space-y-2 hover:border-[#e5b54f]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#c61c09]/10 text-[#ff4444] flex items-center justify-center">
              <GlassWater className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-[#f1f5f9]">Mixologie & Cidres Grand Cru</h2>
            <p className="text-xs text-[#8292aa] leading-relaxed">
              Cocktails signatures au Calvados hors d&apos;âge du Pays d&apos;Auge, bières artisanales et cidres bio primés.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1017] border border-[#222c3d] space-y-2 hover:border-[#e5b54f]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#e5b54f]/10 text-[#e5b54f] flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-[#f1f5f9]">Planches Terroir Normand</h2>
            <p className="text-xs text-[#8292aa] leading-relaxed">
              Camembert rôti au miel de Normandie, Livarot AOP, charcuterie fine artisanale et douceurs locales.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c1017] border border-[#222c3d] space-y-2 hover:border-[#e5b54f]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 text-[#00f0ff] flex items-center justify-center">
              <Disc3 className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-[#f1f5f9]">Cosmic Bowling & DJ Sets</h2>
            <p className="text-xs text-[#8292aa] leading-relaxed">
              Jeux de lumières laser réactifs aux strikes, son Dolby Atmos et DJs résidents les vendredis & samedis.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
