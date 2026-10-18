/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Mission,
  StudentLevel,
  AppView,
  UserAdventureProgress
} from '../types';
import {
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Layers,
  Flame,
  TreePine,
  HelpCircle,
  Trophy
} from 'lucide-react';

interface AdventureMapProps {
  missions: Mission[];
  progress: UserAdventureProgress;
  onSelectMission: (mission: Mission) => void;
  onNavigate: (view: AppView) => void;
}

const MISSION_ICONS: { [key: string]: any } = {
  '01': BookOpen,
  '02': Layers,
  '03': Flame,
  '04': TreePine,
  '05': HelpCircle,
  '06': Trophy
};

export const AdventureMap: React.FC<AdventureMapProps> = ({
  missions,
  progress,
  onSelectMission,
  onNavigate
}) => {
  // Hitung persentase petualangan selesai
  const completedCount = missions.filter(m => progress.completedMissions.includes(m.id)).length;
  const progressPercent = Math.round((completedCount / missions.length) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Peta Petualangan */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/10 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
            <span>🗺️ JALUR PENJELAJAH</span>
            <span>•</span>
            <span>KELAS 4 SD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Peta Petualangan Gunung Api
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Ikuti perjalanan pulau belajar dari nomor 01 hingga 06 untuk membuka rahasia gunung api!
          </p>
        </div>

        {/* Level & Progress Badge Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
            <span>LEVEL BELAJAR:</span>
            <span className="font-extrabold text-amber-700 font-mono">
              {progress.level === 'PEMULA' && '🌱 Penjelajah Pemula'}
              {progress.level === 'PENGAMAT' && '🔎 Pengamat Gunung'}
              {progress.level === 'AHLI' && '🌋 Ahli Gunung Api'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600">
            <span>{completedCount} dari 6 Misi Selesai</span>
            <span className="font-bold text-amber-800">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Jalur Titik Petualangan Sesuai Prompt (01 -> 02 -> 03 -> 04 -> 05 -> 06) */}
      <div className="relative py-4">
        {/* Garis Penghubung Vertikal / Stepper Visual */}
        <div className="absolute left-6 sm:left-8 top-10 bottom-10 w-1 bg-amber-200/80 rounded-full -z-0 hidden md:block" />

        <div className="space-y-6">
          {missions.map((mission, index) => {
            const isCompleted = progress.completedMissions.includes(mission.id);
            // Misi pertama selalu terbuka, atau misi terbuka jika misi sebelumnya selesai
            const prevMissionId = index > 0 ? missions[index - 1].id : null;
            const isUnlocked = index === 0 || (prevMissionId && progress.completedMissions.includes(prevMissionId));
            
            const IconComponent = MISSION_ICONS[mission.stepNumber] || BookOpen;

            return (
              <div
                key={mission.id}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                  isCompleted
                    ? 'bg-white/90 border-emerald-300 shadow-sm'
                    : isUnlocked
                    ? 'bg-white border-amber-300/90 shadow-md shadow-amber-500/5 ring-1 ring-amber-400/30'
                    : 'bg-slate-50/70 border-slate-200/80 opacity-70'
                }`}
              >
                {/* Node Titik Pulau Angka */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black text-base sm:text-lg shrink-0 shadow-sm z-10 transition-transform ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                      : isUnlocked
                      ? 'bg-amber-500 text-slate-950 scale-105 shadow-amber-500/30 ring-4 ring-amber-100'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-7 h-7" />
                  ) : isUnlocked ? (
                    <IconComponent className="w-6 h-6" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>

                {/* Konten Card Misi */}
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-900">
                      MISI {mission.stepNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isUnlocked
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isCompleted ? '✓ Selesai' : isUnlocked ? '▶️ Siap Dipelajari' : '🔒 Belum Terbuka'}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {mission.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {mission.description}
                  </p>

                  {/* Indikator Progress Misi */}
                  <div className="pt-2 flex items-center gap-3 max-w-xs">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-emerald-500 w-full' : isUnlocked ? 'bg-amber-500 w-1/3' : 'w-0'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      {isCompleted ? '100%' : isUnlocked ? '30%' : '0%'}
                    </span>
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="w-full md:w-auto pt-2 md:pt-0 shrink-0 flex md:block justify-end">
                  {isUnlocked ? (
                    <button
                      onClick={() => onSelectMission(mission)}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl font-extrabold text-xs shadow-sm transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-500/20'
                      }`}
                    >
                      <span>{isCompleted ? 'ULANGI MISI' : 'LANJUTKAN MISI'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed border border-slate-200"
                    >
                      <Lock className="w-3 h-3" />
                      <span>TERKUNCI</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
