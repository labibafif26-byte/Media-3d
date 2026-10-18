/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SAFETY_GUIDELINES, INDONESIA_VOLCANOES, DID_YOU_KNOW_FACTS } from '../data/volcanoData';
import {
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Compass,
  ArrowRight
} from 'lucide-react';
import { AppView } from '../types';

interface SafetyAndLocalViewProps {
  onNavigate: (view: AppView) => void;
}

export const SafetyAndLocalView: React.FC<SafetyAndLocalViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'safety' | 'indonesia' | 'facts'>('safety');
  const [selectedVolcano, setSelectedVolcano] = useState(INDONESIA_VOLCANOES[0]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Halaman */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-sky-500/10 to-amber-500/10 border border-emerald-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
            <span>🛡️ MITIGASI & KONTEKS INDONESIA</span>
            <span>•</span>
            <span>KELAS 4 SD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Aman Saat Erupsi & Gunung Api Kita
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Kenali cara melindungi diri serta jelajahi ragam gunung api terkenal di kepulauan Nusantara!
          </p>
        </div>

        <button
          onClick={() => onNavigate('explore_3d')}
          className="inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-sm cursor-pointer transition-all shrink-0"
        >
          <span>Eksplorasi 3D</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Navigasi Tab */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-black">
        <button
          onClick={() => setActiveTab('safety')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'safety'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Panduan Keselamatan</span>
        </button>
        <button
          onClick={() => setActiveTab('indonesia')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'indonesia'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Gunung Api di Indonesia</span>
        </button>
        <button
          onClick={() => setActiveTab('facts')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'facts'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Tahukah Kamu?</span>
        </button>
      </div>

      {/* 1. PANDUAN KESELAMATAN (Prompt 35) */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sebelum Erupsi */}
            <div className="p-6 rounded-3xl bg-sky-50/70 border border-sky-200 space-y-4">
              <div className="flex items-center gap-2 text-sky-900 font-black text-base">
                <span className="w-7 h-7 rounded-xl bg-sky-200 flex items-center justify-center text-sm">1</span>
                <span>SEBELUM ERUPSI</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Langkah persiapan dini di rumah dan sekolah:</p>
              <div className="space-y-3">
                {SAFETY_GUIDELINES.before.map((item, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-sky-100 space-y-1 shadow-2xs">
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saat Erupsi Terjadi */}
            <div className="p-6 rounded-3xl bg-orange-50/70 border border-orange-200 space-y-4">
              <div className="flex items-center gap-2 text-orange-900 font-black text-base">
                <span className="w-7 h-7 rounded-xl bg-orange-200 flex items-center justify-center text-sm">2</span>
                <span>SAAT ERUPSI</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Tindakan penyelamatan saat letusan berlangsung:</p>
              <div className="space-y-3">
                {SAFETY_GUIDELINES.during.map((item, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-orange-100 space-y-1 shadow-2xs">
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Setelah Erupsi Berakhir */}
            <div className="p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2 text-emerald-900 font-black text-base">
                <span className="w-7 h-7 rounded-xl bg-emerald-200 flex items-center justify-center text-sm">3</span>
                <span>SETELAH ERUPSI</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">Pemulihan kondisi dan tetap waspada bahaya ikutan:</p>
              <div className="space-y-3">
                {SAFETY_GUIDELINES.after.map((item, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-emerald-100 space-y-1 shadow-2xs">
                    <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. GUNUNG API DI INDONESIA (Prompt 36) */}
      {activeTab === 'indonesia' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Daftar Gunung */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-800">Pilih Gunung Api:</h3>
              <div className="space-y-2">
                {INDONESIA_VOLCANOES.map((volc) => (
                  <button
                    key={volc.name}
                    onClick={() => setSelectedVolcano(volc)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedVolcano.name === volc.name
                        ? 'bg-amber-100 border-amber-500 text-amber-950 font-black shadow-xs ring-2 ring-amber-300'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold">{volc.name}</div>
                    <div className="text-[11px] text-slate-500">{volc.island}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Kartu Detail Gunung Terpilih */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                    {selectedVolcano.island}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">
                    🌋 {selectedVolcano.name}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-bold">KETINGGIAN</div>
                  <div className="text-base font-black text-slate-800 font-mono">{selectedVolcano.height}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {selectedVolcano.fact}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold text-slate-500">Status Pemantauan PVMBG:</div>
                <div className="text-xs font-black text-orange-700">{selectedVolcano.status}</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. TAHUKAH KAMU? (Prompt 34) */}
      {activeTab === 'facts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DID_YOU_KNOW_FACTS.map((fact, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-amber-400 transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-black text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>FAKTA UNIK #{idx + 1}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {fact}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
