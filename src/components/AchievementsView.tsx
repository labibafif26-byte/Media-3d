/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BADGE_DEFINITIONS } from '../data/volcanoData';
import { UserAdventureProgress, AppView } from '../types';
import {
  Trophy,
  Award,
  Sparkles,
  Layers,
  Eye,
  Flame,
  Bird,
  GraduationCap,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface AchievementsViewProps {
  progress: UserAdventureProgress;
  onResetProgress: () => void;
  onNavigate: (view: AppView) => void;
}

const BADGE_ICONS: { [key: string]: any } = {
  Sparkles,
  Layers,
  Eye,
  Flame,
  Bird,
  Award,
  GraduationCap
};

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  progress,
  onResetProgress,
  onNavigate
}) => {
  const earnedCount = BADGE_DEFINITIONS.filter(b => progress.earnedBadges.includes(b.id)).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Piagam & Penghargaan */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/10 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
            <span>🏆 PENCAPAIAN SISWA</span>
            <span>•</span>
            <span>MOTIVASI BELAJAR PRIBADI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Koleksi Lencana & Hasil Petualangan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Kumpulkan seluruh lencana prestasi dari setiap penemuan dan tantangan yang kamu selesaikan!
          </p>
        </div>

        {/* Total Koleksi Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm min-w-[200px] text-center sm:text-right">
          <div className="text-xs font-bold text-slate-500 mb-0.5">LENCANA TERKUMPUL</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
            {earnedCount} / {BADGE_DEFINITIONS.length}
          </div>
          <div className="text-[11px] font-semibold text-emerald-700">
            {earnedCount === BADGE_DEFINITIONS.length ? '🌟 Semua Lencana Lengkap!' : 'Teruslah Berpetualang!'}
          </div>
        </div>
      </div>

      {/* Kartu Piagam Gelar Penjelajah */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-3xl shadow-md">
            🎓
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-amber-800">GELAR SISWA SAAT INI</div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {progress.level === 'PEMULA' && '🌱 Penjelajah Pemula'}
              {progress.level === 'PENGAMAT' && '🔎 Pengamat Gunung Api'}
              {progress.level === 'AHLI' && '🌋 Ahli Gunung Api Cilik Indonesia'}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Tingkat pengetahuanmu terus meningkat seiring banyaknya materi dan simulasi yang kamu lakukan.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('explore_3d')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm cursor-pointer transition-all shrink-0"
        >
          <span>Lanjut Eksplorasi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid Lencana Prestasi Pribadi */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <span>Daftar Lencana Petualangan</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGE_DEFINITIONS.map(badge => {
            const isEarned = progress.earnedBadges.includes(badge.id);
            const IconComp = BADGE_ICONS[badge.iconName] || Award;

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${
                  isEarned
                    ? 'bg-white border-amber-300/80 shadow-md shadow-amber-500/5 ring-1 ring-amber-400/20'
                    : 'bg-slate-50 border-slate-200/80 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    isEarned
                      ? 'bg-amber-500 text-slate-950 shadow-amber-500/25'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isEarned ? <IconComp className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900">{badge.title}</h4>
                    {isEarned && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {badge.description}
                  </p>
                  <div className="text-[10px] font-mono font-bold pt-1 text-slate-500">
                    Status: {isEarned ? '✓ Terbuka' : '🔒 Belum Diraih'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian Bawah: Opsi Reset Progress Pembelajaran */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-slate-900">Mulai Ulang Petualangan dari Awal?</h4>
          <p className="text-xs text-slate-500 font-medium">
            Kamu bisa me-reset semua lencana dan riwayat belajar untuk mencoba lagi dari awal.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Apakah kamu yakin ingin me-reset seluruh progress belajar dan lencana?')) {
              onResetProgress();
            }
          }}
          className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET PROGRESS</span>
        </button>
      </div>

    </div>
  );
};
