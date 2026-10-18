/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
  LogIn,
  User,
  ShieldCheck,
  Zap,
  Globe2
} from 'lucide-react';
import { VolcanoScene } from './VolcanoScene';
import { VolcanoState, MarkerItem, StudentUser, AppView } from '../types';

interface LandingPageProps {
  student: StudentUser | null;
  onOpenLogin: () => void;
  onStartAdventure: () => void;
  onExplore3D: () => void;
  onLearnMateri?: () => void;
  onSelectMarker: (marker: MarkerItem) => void;
  onNavigate?: (view: AppView) => void;
  volcanoState: VolcanoState;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  student,
  onOpenLogin,
  onStartAdventure,
  onExplore3D,
  onLearnMateri,
  onSelectMarker,
  onNavigate,
  volcanoState
}) => {
  // Handler tombol "Mulai Petualangan" terintegrasi dengan sistem login
  const handleStartAction = () => {
    if (student) {
      // Jika sudah login, langsung ke petualangan / home
      onStartAdventure();
    } else {
      // Jika belum login, buka modal login akses (nama & kelas)
      onOpenLogin();
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row items-center justify-between overflow-hidden bg-[#080d1a] text-slate-100">
      
      {/* Background Ambient Lighting */}
      <div className="absolute top-1/4 left-8 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Kolom Kiri: Hero Section Modern */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 z-20 flex flex-col justify-center max-w-2xl">
        
        {/* Modern Category Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide w-fit shadow-xs mb-5">
          <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>MEDIA PEMBELAJARAN 3D INTERAKTIF</span>
        </div>

        {/* Judul Hero Modern: PETUALANGAN GUNUNG API 3D */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] mb-4">
          PETUALANGAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400">GUNUNG API 3D</span>
        </h1>

        {/* Deskripsi Singkat */}
        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed mb-6 max-w-xl">
          Eksplorasi interaktif 3D dinamika vulkanologi, magma, dan mitigasi erupsi gunung berapi real-time. Amati penampang kawah, pantau instrumen seismograf, dan latih kesiapsiagaan bencana.
        </p>

        {/* CTA Hero Buttons Proporsional Terhadap Tulisan */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <button
            onClick={handleStartAction}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-400/40"
          >
            {student ? (
              <>
                <Compass className="w-4 h-4 text-emerald-200" />
                <span>Mulai Petualangan ({student.name})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-emerald-200" />
                <span>Mulai Petualangan (Login Siswa)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          <button
            onClick={onExplore3D}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:scale-[0.98] text-slate-200 font-semibold text-xs sm:text-sm shadow-sm border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Simulasi 3D</span>
          </button>

          {onLearnMateri && (
            <button
              onClick={onLearnMateri}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 active:scale-[0.98] text-slate-300 font-medium text-xs border border-slate-800/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Materi</span>
            </button>
          )}
        </div>

        {/* 3 Sorotan Pilar Pembelajaran */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 mb-6">
          <div className="flex flex-col space-y-0.5">
            <div className="text-sm sm:text-base font-bold text-white">Visual 3D PBR</div>
            <div className="text-[11px] text-slate-400">Model bumi &amp; irisan magma</div>
          </div>
          <div className="flex flex-col space-y-0.5">
            <div className="text-sm sm:text-base font-bold text-emerald-400">Interaktif Real-Time</div>
            <div className="text-[11px] text-slate-400">Kontrol rotasi 360° &amp; zoom</div>
          </div>
          <div className="flex flex-col space-y-0.5">
            <div className="text-sm sm:text-base font-bold text-amber-400">Game Edukasi</div>
            <div className="text-[11px] text-slate-400">Tantangan mitigasi &amp; skor</div>
          </div>
        </div>

        {/* Informasi Pengembang & Integrasi Akademik */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Pengembang: <strong className="text-slate-200">Labib Fidianur Afif</strong> (NIM: 2510130210020) • Teknologi Pendidikan
            </span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('profil_pengembang')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline text-[11px]"
            >
              Profil Lengkap &rarr;
            </button>
          )}
        </div>

      </div>

      {/* Kolom Kanan: Scene 3D Interaktif */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-[calc(100vh-64px)] relative flex items-center justify-center">
        <div className="w-full h-full">
          <VolcanoScene
            volcanoState={volcanoState}
            isCutaway={false}
            selectedMarkerId={null}
            onSelectMarker={onSelectMarker}
            cameraPreset="default"
            particleSettings={{ lavaIntensity: 1.0, ashSpread: 1.0 }}
            onToast={() => {}}
            showHotspots={true}
          />
        </div>

        {/* Floating Hint Overlay di 3D */}
        <div className="absolute bottom-5 left-5 right-5 lg:left-auto lg:right-6 bg-slate-950/85 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 shadow-xl text-xs text-slate-300 flex items-center justify-between gap-3 pointer-events-none">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            3D Interaktif:
          </span>
          <span className="text-slate-400 font-normal">Drag untuk memutar • Scroll untuk zoom</span>
        </div>
      </div>

    </div>
  );
};
