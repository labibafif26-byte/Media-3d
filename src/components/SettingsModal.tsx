/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sliders,
  Sparkles,
  Layers,
  X,
  Info,
  Laptop,
  Check
} from 'lucide-react';
import { UserAdventureProgress } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserAdventureProgress;
  onUpdateProgress: (updated: Partial<UserAdventureProgress>) => void;
  onResetAll: () => void;
  onToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
  onResetAll,
  onToast
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-6 text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">⚙️ Pengaturan Aplikasi</h3>
              <p className="text-xs text-slate-500 font-medium">Kenyamanan Belajar & Performa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setting Items Sesuai Prompt 25 */}
        <div className="space-y-4 text-xs font-bold">
          
          {/* 1. Suara & Audio Efek */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2.5">
              {progress.soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              <div>
                <div className="text-slate-800">Efek Suara Vulkanik</div>
                <div className="text-[10px] text-slate-500 font-normal">Gemuruh magma & letusan realistis</div>
              </div>
            </div>
            <button
              onClick={() => {
                onUpdateProgress({ soundEnabled: !progress.soundEnabled });
                onToast(progress.soundEnabled ? 'Suara dinonaktifkan' : 'Suara diaktifkan');
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                progress.soundEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'
              }`}
            >
              {progress.soundEnabled ? 'AKTIF' : 'MATI'}
            </button>
          </div>

          {/* 2. Mode Performa 3D (High / Medium / Low) */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-800">
              <Laptop className="w-4 h-4 text-amber-600" />
              <span>Mode Performa Grafis 3D</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    onUpdateProgress({ performanceMode: mode });
                    onToast(`Performa 3D diubah ke: ${mode.toUpperCase()}`);
                  }}
                  className={`py-2 rounded-xl text-center text-xs font-black uppercase transition-all cursor-pointer border ${
                    progress.performanceMode === mode
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-500 font-normal">
              Gunakan mode Low bila menggunakan HP atau laptop berspesifikasi rendah.
            </div>
          </div>

          {/* 3. Panduan Kontrol & Cara Bermain (Onboarding Re-open) */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="text-slate-800">Petunjuk Cara Bermain</div>
              <div className="text-[10px] text-slate-500 font-normal">Tampilkan ulang panduan gestur & tombol</div>
            </div>
            <button
              onClick={() => {
                onUpdateProgress({ tutorialCompleted: false });
                onToast('Panduan bermain akan ditampilkan kembali.');
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Buka
            </button>
          </div>

          {/* 4. Reset Progress Belajar */}
          <div className="p-3.5 bg-red-50/60 rounded-2xl border border-red-200 space-y-2">
            <div className="text-red-900 font-black">Mulai Ulang Petualangan</div>
            <p className="text-[11px] text-red-700 font-normal leading-relaxed">
              Mereset semua lencana misi yang sudah diraih kembali ke awal.
            </p>
            <div className="pt-1">
              <button
                onClick={() => {
                  if (window.confirm('Yakin ingin mereset seluruh data lencana dan petualangan?')) {
                    onResetAll();
                    onClose();
                  }
                }}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
              >
                <span>Reset Progress Belajar</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
