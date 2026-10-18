/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowRight,
  Layers,
  Leaf,
  Info
} from 'lucide-react';
import { MATERI_TOPICS } from '../data/ecoData';
import { AppView } from '../types';
import { ecoAudio } from '../utils/ecoAudio';

interface MateriViewProps {
  onNavigate: (view: AppView) => void;
}

export const MateriView: React.FC<MateriViewProps> = ({ onNavigate }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(MATERI_TOPICS[0].id);

  const activeTopic = MATERI_TOPICS.find((t) => t.id === selectedTopicId) || MATERI_TOPICS[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-in fade-in duration-300 text-slate-100">
      
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-slate-950 border border-emerald-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wide">
            <BookOpen className="w-3.5 h-3.5" />
            <span>MODUL PEMBELAJARAN SAINS BIOLOGI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Konsep Rantai Makanan &amp; Aliran Energi
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-2xl leading-relaxed">
            Pelajari prinsip fundamental bagaimana energi matahari ditangkap oleh produsen dan dialirkan melalui proses makan-memakan di padang rumput hingga didaur ulang oleh pengurai.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Tabs & Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Topic List Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono font-bold text-slate-400 uppercase px-1 mb-2">
            DAFTAR TOPIK MATERI:
          </div>

          {MATERI_TOPICS.map((topic) => {
            const isSelected = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopicId(topic.id);
                  ecoAudio.playClick();
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-lg'
                    : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {topic.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-emerald-400">
                        {topic.number}
                      </span>
                      <h3 className="font-extrabold text-xs text-white group-hover:text-emerald-300">
                        {topic.title}
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate block max-w-[180px]">
                      {topic.subtitle}
                    </span>
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 text-emerald-400 transition-transform ${isSelected ? 'translate-x-1 text-white' : 'opacity-40'}`} />
              </button>
            );
          })}
        </div>

        {/* Right Column: Deep Topic Content */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                {activeTopic.badge}
              </span>
              <h2 className="text-2xl font-black text-white mt-2">{activeTopic.title}</h2>
              <p className="text-xs text-slate-400 italic font-serif">{activeTopic.subtitle}</p>
            </div>
            <span className="text-4xl p-3 rounded-2xl bg-slate-800/60 border border-slate-700 shrink-0 self-start sm:self-auto">
              {activeTopic.icon}
            </span>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed font-medium">
            {activeTopic.summary}
          </div>

          {/* Key Bullet Points */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
              POIN PENTING &amp; MEKANISME:
            </h4>
            <div className="space-y-2.5">
              {activeTopic.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                  <span className="text-emerald-400 font-bold font-mono">0{idx + 1}.</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlight Callout */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block mb-0.5">Kesimpulan Esensial:</span>
              <span>{activeTopic.highlight}</span>
            </div>
          </div>

          {/* Quick CTA to 3D Exploration or Simulation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">Ingin melihat penerapannya di dunia 3D?</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  ecoAudio.playClick();
                  onNavigate('simulasi');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Lihat Simulasi
              </button>
              <button
                onClick={() => {
                  ecoAudio.playClick();
                  onNavigate('explore');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <span>Buka Eksplorasi 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
