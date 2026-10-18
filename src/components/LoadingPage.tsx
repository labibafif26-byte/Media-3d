/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, ArrowRight, ShieldCheck, Compass } from 'lucide-react';

interface LoadingPageProps {
  onComplete: () => void;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Menyiapkan media pembelajaran 3D...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 8) + 5;
        if (next >= 100) {
          clearInterval(interval);
          setLoadingText('Pemuatan selesai! Menyiapkan petualangan...');
          setTimeout(() => {
            onComplete();
          }, 600);
          return 100;
        }

        if (next > 75) {
          setLoadingText('Menyiapkan instrumen seismograf & kuis seru...');
        } else if (next > 50) {
          setLoadingText('Memuat saluran magma, kawah, dan batuan...');
        } else if (next > 25) {
          setLoadingText('Membangun model gunung berapi 3D kelas 4 SD...');
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#071311] text-emerald-100 p-6 select-none overflow-hidden">
      
      {/* Background Natural Ambient Glows (Earth tones, emerald, warm amber) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Loading Card */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center space-y-6">
        
        {/* Official Website Logo Badge */}
        <div className="relative group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 p-1 shadow-2xl shadow-emerald-900/40 transition-transform group-hover:scale-105 duration-300">
            <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center relative overflow-hidden border border-emerald-400/40">
              <img
                src="/src/assets/images/logo_website_1792313397687.jpg"
                alt="Logo Jelajah Gunung Berapi"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="absolute -top-1.5 -right-1.5 p-2 rounded-xl bg-amber-500 text-slate-950 shadow-md animate-pulse">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
        </div>

        {/* Identity & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold tracking-wider uppercase font-mono">
            <span>🌱</span>
            <span>IPAS KELAS 4 SD</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            Jelajah <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-orange-400">Gunung Berapi 3D</span>
          </h1>

          <p className="text-xs text-emerald-200/80 max-w-sm mx-auto leading-relaxed">
            Media Pembelajaran 3D Interaktif Mengenal Bentuk Bumi, Erupsi, dan Kesiapsiagaan Bencana.
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full space-y-2.5 pt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-300/90 font-medium truncate max-w-[260px] text-left">
              {loadingText}
            </span>
            <span className="font-bold text-amber-300">{progress}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-900 border border-emerald-900/60 p-0.5 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-200 shadow-md"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip Button (Agar tidak terjebak jika ingin langsung lanjut) */}
        <div className="pt-2">
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-emerald-300/80 hover:text-white border border-emerald-800/40 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <span>Lewati Pemuatan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer Meta & ULM Affiliation */}
        <div className="pt-3 border-t border-emerald-950/80 flex flex-col items-center gap-1.5 text-[10px] text-emerald-400/80">
          <div className="flex items-center gap-2">
            <img
              src="/src/assets/images/logo_ulm_1792244771690.jpg"
              alt="Logo ULM"
              referrerPolicy="no-referrer"
              className="w-4 h-4 object-contain rounded-xs"
            />
            <span>Universitas Lambung Mangkurat (ULM) • FKIP S1 Teknologi Pendidikan</span>
          </div>
          <div className="text-slate-500 text-[9px]">
            Pengembang: Labib Fidianur Afif • Dosen Pengampu: Brezto Asagi Dewantara, S.Pd., M.Pd.
          </div>
        </div>

      </div>
    </div>
  );
};
