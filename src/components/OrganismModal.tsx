/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles, Zap, Shield, ArrowRight, BookOpen, Compass } from 'lucide-react';
import { OrganismItem } from '../types';
import { ecoAudio } from '../utils/ecoAudio';

interface OrganismModalProps {
  organism: OrganismItem | null;
  onClose: () => void;
  onViewRelationships?: (organism: OrganismItem) => void;
}

export const OrganismModal: React.FC<OrganismModalProps> = ({
  organism,
  onClose,
  onViewRelationships
}) => {
  if (!organism) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-slate-900/95 backdrop-blur-xl border-t sm:border border-slate-700/80 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[85vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom-6 duration-300">
        
        {/* Header: Icon, Name & Close Button */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
              {organism.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{organism.name}</h2>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${organism.badgeBg} ${organism.badgeBorder} ${organism.badgeText}`}>
                  Trofik {organism.trophicLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400 italic font-serif">{organism.scientificName}</p>
            </div>
          </div>

          <button
            onClick={() => {
              ecoAudio.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trophic Status & Energy Indicator (Hukum 10%) */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/90 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">PERAN EKOSISTEM:</span>
            <span className="font-extrabold text-emerald-400 text-xs mt-0.5 block">{organism.role}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-mono">ENERGIA TERSIMPAN:</span>
            <span className="font-mono font-extrabold text-amber-300 text-xs mt-0.5 block">
              {organism.energyKcal.toLocaleString()} kkal ({organism.energyPercent})
            </span>
          </div>
        </div>

        {/* Diet & Predator (Hubungan Makan - Dimakan) */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-xs bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
            <span className="text-emerald-400 font-bold shrink-0">🍃 Makanan:</span>
            <span className="text-slate-200">{organism.food}</span>
          </div>
          <div className="flex items-start gap-2 text-xs bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
            <span className="text-rose-400 font-bold shrink-0">⚠️ Dimakan oleh:</span>
            <span className="text-slate-200">{organism.predator}</span>
          </div>
        </div>

        {/* Scientific Description */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            Penjelasan Ilmiah:
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
            {organism.description}
          </p>
        </div>

        {/* Fun Fact / Keunikan Adaptasi */}
        <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 block mb-0.5">Fakta Menarik &amp; Adaptasi:</span>
            <span>{organism.funFact}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {onViewRelationships && (
            <button
              onClick={() => {
                ecoAudio.playClick();
                onViewRelationships(organism);
              }}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <span>Lihat Hubungan Rantai</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => {
              ecoAudio.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
