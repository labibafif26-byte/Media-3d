/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VOLCANO_MARKERS } from '../data/volcanoData';
import { BookOpen, CheckCircle2, Circle, Eye, Sparkles } from 'lucide-react';
import { MarkerItem, AppView } from '../types';

interface DiscoveryJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  discoveredIds: string[];
  onSelectMarker: (marker: MarkerItem) => void;
  onNavigate: (view: AppView) => void;
}

export const DiscoveryJournalModal: React.FC<DiscoveryJournalModalProps> = ({
  isOpen,
  onClose,
  discoveredIds,
  onSelectMarker,
  onNavigate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800 max-h-[85vh] flex flex-col">
        
        {/* Header Jurnal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">📖 JURNAL PENEMUAN SISWA</h3>
              <p className="text-xs text-slate-500 font-medium">
                Catatan seluruh objek geologi dan alam yang berhasil kamu temukan di gunung api.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer"
          >
            Tutup
          </button>
        </div>

        {/* List Penemuan Sesuai Prompt 16 & 17 */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {VOLCANO_MARKERS.map(marker => {
            const isDiscovered = discoveredIds.includes(marker.id);

            return (
              <div
                key={marker.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDiscovered
                    ? 'bg-amber-50/40 border-amber-200/90 shadow-2xs'
                    : 'bg-slate-50 border-slate-200/80 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isDiscovered ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-slate-900">{marker.name}</h4>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                        {marker.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                      {isDiscovered
                        ? (marker.simpleExplanation || marker.summary)
                        : 'Objek ini belum kamu jelajahi di tampilan 3D. Putar dan temukan titik pinnya!'}
                    </p>
                  </div>
                </div>

                {isDiscovered && (
                  <button
                    onClick={() => {
                      onSelectMarker(marker);
                      onNavigate('explore_3d');
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>LIHAT LAGI</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs font-bold text-slate-500">
          <span>Total Ditemukan: {discoveredIds.length} dari {VOLCANO_MARKERS.length} Objek</span>
          <span className="text-amber-700 font-extrabold font-mono">
            {Math.round((discoveredIds.length / VOLCANO_MARKERS.length) * 100)}% LENGKAP
          </span>
        </div>

      </div>
    </div>
  );
};
