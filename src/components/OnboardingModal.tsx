/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800">
        
        {/* Header Onboarding */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🧭</div>
            <div>
              <h3 className="text-base font-black text-slate-900">CARA BERMAIN</h3>
              <p className="text-xs text-slate-500 font-medium">Panduan Interaksi 3D Ramah Siswa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Gestur Sesuai Prompt 24 */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/70 space-y-1">
              <div className="text-base">🖱️ / 👆 Geser</div>
              <div className="text-slate-900 font-black">Putar Gunung</div>
              <div className="text-[11px] text-slate-500 font-normal">Melihat dari segala sisi</div>
            </div>

            <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200/70 space-y-1">
              <div className="text-base">🔍 / 🤏 Pinch</div>
              <div className="text-slate-900 font-black">Zoom Dekat & Jauh</div>
              <div className="text-[11px] text-slate-500 font-normal">Gunakan scroll atau jepit layar</div>
            </div>

            <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200/70 space-y-1">
              <div className="text-base">🌋 Hotspot</div>
              <div className="text-slate-900 font-black">Klik Bagian Gunung</div>
              <div className="text-[11px] text-slate-500 font-normal">Pelajari kawah, lava & magma</div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/70 space-y-1">
              <div className="text-base">🔬 X-Ray</div>
              <div className="text-slate-900 font-black">Lihat Bagian Dalam</div>
              <div className="text-[11px] text-slate-500 font-normal">Melihat dapur magma raksasa</div>
            </div>
          </div>
        </div>

        {/* Tombol Konfirmasi Sesuai Prompt 24 */}
        <div className="flex justify-center pt-1">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md cursor-pointer transition-all border border-amber-300"
          >
            <Check className="w-4 h-4" />
            <span>MENGERTI</span>
          </button>
        </div>

      </div>
    </div>
  );
};
