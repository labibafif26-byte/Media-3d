/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, SkipForward, Sparkles, Volume2, Mountain } from 'lucide-react';

interface WelcomeExperienceProps {
  onFinishIntro: () => void;
  onSkipIntro: () => void;
}

export const WelcomeExperience: React.FC<WelcomeExperienceProps> = ({
  onFinishIntro,
  onSkipIntro
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Auto progression across 4 cinematic scenes
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 2200); // Scene 1 -> 2
    const timer2 = setTimeout(() => setCurrentStep(2), 4800); // Scene 2 -> 3
    const timer3 = setTimeout(() => setCurrentStep(3), 7400); // Scene 3 -> 4: Karakter muncul

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-sky-400 via-sky-200 to-amber-100 p-6 sm:p-10 select-none overflow-hidden animate-in fade-in duration-500">
      
      {/* Tombol Lewati Intro di Pojok Kanan Atas */}
      <div className="w-full flex justify-end">
        <button
          onClick={onSkipIntro}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-slate-950 font-bold text-xs shadow-md border border-slate-200/80 transition-all cursor-pointer backdrop-blur-sm"
        >
          <span>Lewati intro</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Visual Animasi Mini Pemandangan Gunung */}
      <div className="relative w-full max-w-lg flex-1 flex flex-col items-center justify-center text-center">
        {/* Gunung Animasi CSS Vektor */}
        <div className="relative w-64 h-56 sm:w-80 sm:h-64 flex items-end justify-center mb-6">
          {/* Asap di Kawah (Muncul di scene 3 & 4) */}
          <div
            className={`absolute top-0 flex flex-col items-center transition-all duration-1000 ${
              currentStep >= 2 ? 'opacity-100 scale-100 -translate-y-4' : 'opacity-0 scale-50'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-white/70 animate-ping mb-1" />
            <div className="w-10 h-10 rounded-full bg-white/80 blur-xs animate-pulse" />
            <div className="w-14 h-8 rounded-full bg-white/90 blur-xs" />
          </div>

          {/* Kerucut Gunung */}
          <div
            className={`relative w-full h-44 bg-gradient-to-b from-stone-600 via-amber-800 to-emerald-700 rounded-t-[50%] transition-transform duration-1000 ${
              currentStep >= 1 ? 'scale-110' : 'scale-90'
            }`}
            style={{
              clipPath: 'polygon(50% 12%, 18% 100%, 82% 100%)'
            }}
          >
            {/* Danau Kawah Pijar Merah */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-3 rounded-full bg-orange-500 shadow-md shadow-orange-500/80 animate-pulse" />
          </div>

          {/* Pepohonan Lereng */}
          <div className="absolute -bottom-1 flex gap-4 text-emerald-800 text-xl font-bold">
            <span>🌲</span>
            <span>🌳</span>
            <span>🌲</span>
            <span>🌳</span>
            <span>🌲</span>
          </div>
        </div>

        {/* Status Langkah Sinematik */}
        <div className="h-28 flex flex-col items-center justify-center">
          {currentStep === 0 && (
            <div className="animate-in fade-in duration-500 space-y-1">
              <span className="text-xs font-mono font-bold text-sky-900 bg-white/70 px-3 py-1 rounded-full">
                SCENE 01
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                Pemandangan Gunung Api yang Megah dari Kejauhan...
              </h2>
            </div>
          )}

          {currentStep === 1 && (
            <div className="animate-in fade-in duration-500 space-y-1">
              <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full">
                SCENE 02
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                Mendekati Lereng Hijau yang Subur dan Aliran Lembah...
              </h2>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in duration-500 space-y-1">
              <span className="text-xs font-mono font-bold text-orange-900 bg-orange-100/90 px-3 py-1 rounded-full">
                SCENE 03
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                Lihat! Kepulan Asap Putih Mulai Terlihat dari Mulut Kawah!
              </h2>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in zoom-in-95 duration-500 flex flex-col items-center gap-3">
              {/* Karakter Petualang Cilik */}
              <div className="flex items-center gap-3 bg-white/95 px-5 py-3 rounded-2xl shadow-xl border border-amber-200">
                <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-2xl shadow-sm">
                  🧭
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-amber-800">KARA • TEMAN PETUALANGMU</div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-900">
                    “Hai! Aku akan menemanimu menjelajahi gunung api!”
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bagian Bawah: Tombol Mulai Petualangan */}
      <div className="w-full flex justify-center pb-4">
        {currentStep >= 3 ? (
          <button
            onClick={onFinishIntro}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 transition-all cursor-pointer border border-amber-300 animate-bounce"
          >
            <span>MULAI PETUALANGAN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3].map(step => (
              <div
                key={step}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === step ? 'w-8 bg-amber-600' : 'w-2 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
