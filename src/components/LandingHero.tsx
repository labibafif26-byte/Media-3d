/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Layers, LogIn, User, GraduationCap } from 'lucide-react';
import { VolcanoScene } from './VolcanoScene';
import { VolcanoState, MarkerItem, StudentUser, AppView } from '../types';

interface LandingHeroProps {
  student: StudentUser | null;
  onOpenLogin: () => void;
  onGoToHome: () => void;
  onExplore3D: () => void;
  onLearnMateri?: () => void;
  onSelectMarker: (marker: MarkerItem) => void;
  onNavigate?: (view: AppView) => void;
  volcanoState: VolcanoState;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  student,
  onOpenLogin,
  onGoToHome,
  onExplore3D,
  onLearnMateri,
  onSelectMarker,
  onNavigate,
  volcanoState
}) => {
  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex flex-col lg:flex-row items-center justify-between overflow-hidden bg-[#080d1a] text-slate-100">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Kolom Kiri: Hero Banner Informasi */}
      <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 z-20 flex flex-col justify-center max-w-2xl">
        
        {/* Badge Sesuai Spesifikasi */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide w-fit shadow-xs mb-5">
          <span className="text-sm">🌋</span>
          <span>MEDIA PEMBELAJARAN 3D INTERAKTIF</span>
        </div>

        {/* Heading Besar */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
          Jelajahi Gunung Berapi <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
            Secara Interaktif
          </span>
        </h1>

        {/* Subheading Sesuai Spesifikasi */}
        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8 max-w-xl">
          Amati struktur, anatomi internal magma, tanda-tanda erupsi, seismograf getaran gempa, dan prosedur mitigasi bencana melalui simulasi 3D real-time serta game edukasi interaktif.
        </p>

        {/* Tombol CTA Utama (Login Akses / Lanjut Belajar) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
          {student ? (
            <button
              onClick={onGoToHome}
              className="px-7 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.98] text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-orange-400/40"
            >
              <span>Lanjut Belajar ({student.name})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-orange-600/35 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-orange-400/40"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk (Nama &amp; Kelas)</span>
            </button>
          )}

          <button
            onClick={onExplore3D}
            className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 active:scale-[0.98] text-slate-200 font-semibold text-sm shadow-md border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
          >
            <Layers className="w-4 h-4 text-orange-400" />
            <span>Simulasi 3D Langsung</span>
          </button>

          {onLearnMateri && (
            <button
              onClick={onLearnMateri}
              className="px-5 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 active:scale-[0.98] text-slate-300 font-medium text-xs border border-slate-800/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Materi</span>
            </button>
          )}
        </div>

        {/* 3 Sorotan Pembelajaran Ringkas */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 mb-6">
          <div className="flex flex-col space-y-0.5">
            <div className="text-sm sm:text-base font-bold text-white">Visual 3D PBR</div>
            <div className="text-[11px] text-slate-400">Irisan penampang magma</div>
          </div>
          <div className="flex flex-col space-y-0.5">
            <div className="text-sm sm:text-base font-bold text-orange-400">Game Evaluasi</div>
            <div className="text-[11px] text-slate-400">3 Nyawa &amp; combo mitigasi</div>
          </div>
          <div className="flex flex-col space-y-0.5">
            <div className="text-sm sm:text-base font-bold text-amber-400">Riwayat Akses</div>
            <div className="text-[11px] text-slate-400">Hidden link log guru</div>
          </div>
        </div>

        {/* Info Pengembang Ringkas di Landing Page */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>
              Pengembang: <strong className="text-slate-200">Labib Fidianur Afif</strong> (2510130210020)
            </span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('profil_pengembang')}
              className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer underline text-[11px]"
            >
              Profil Lengkap &rarr;
            </button>
          )}
        </div>

      </div>

      {/* Kolom Kanan: Tampilan 3D Interaktif Langsung */}
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
          <span className="flex items-center gap-1.5 text-orange-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            3D Interaktif:
          </span>
          <span className="text-slate-400 font-normal">Drag untuk memutar • Scroll untuk zoom</span>
        </div>
      </div>

    </div>
  );
};
