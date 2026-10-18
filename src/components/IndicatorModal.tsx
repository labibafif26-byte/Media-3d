/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VolcanoState } from '../types';
import { Seismograph } from './Seismograph';
import {
  Activity,
  Thermometer,
  CloudFog,
  Droplets,
  Bird,
  Compass,
  Flame,
  X,
  Info,
  AlertTriangle
} from 'lucide-react';

interface IndicatorModalProps {
  indicatorId: string | null;
  onClose: () => void;
  volcanoState: VolcanoState;
}

export const IndicatorModal: React.FC<IndicatorModalProps> = ({
  indicatorId,
  onClose,
  volcanoState
}) => {
  if (!indicatorId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl overflow-hidden text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            {indicatorId === 'gempa' && <Activity className="w-5 h-5 text-emerald-600" />}
            {indicatorId === 'suhu' && <Thermometer className="w-5 h-5 text-amber-600" />}
            {indicatorId === 'gas' && <CloudFog className="w-5 h-5 text-sky-600" />}
            {indicatorId === 'air' && <Droplets className="w-5 h-5 text-blue-600" />}
            {indicatorId === 'hewan' && <Bird className="w-5 h-5 text-emerald-600" />}
            {indicatorId === 'deformasi' && <Compass className="w-5 h-5 text-purple-600" />}
            {indicatorId === 'lava' && <Flame className="w-5 h-5 text-orange-600" />}

            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                {indicatorId === 'gempa' && 'GEMPA VULKANIK (SEISMIK)'}
                {indicatorId === 'suhu' && 'PENINGKATAN SUHU KAWAH'}
                {indicatorId === 'gas' && 'PERUBAHAN GAS VULKANIK'}
                {indicatorId === 'air' && 'PERUBAHAN MATA AIR'}
                {indicatorId === 'hewan' && 'PERILAKU SATWA LIAR'}
                {indicatorId === 'deformasi' && 'DEFORMASI TUBUH GUNUNG'}
                {indicatorId === 'lava' && 'PENINGKATAN AKTIVITAS LAVA'}
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                STATUS SAAT INI: <strong className="text-amber-700">{volcanoState}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1 text-xs leading-relaxed">
          
          {/* INDIKATOR 1: GEMPA */}
          {indicatorId === 'gempa' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Peningkatan jumlah dan amplitudo gempa vulkanik (Volcanic Type A & B) serta getaran tremor terus menerus (continuous tremor) mengindikasikan adanya pergerakan fluida magma yang mendesak batuan penyumbat kawah menuju ke permukaan.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold text-slate-900">Instrumen Pemantau:</div>
                <div className="text-slate-600">Seismometer broadband 3-komponen dan digitizer telemeteri PVMBG.</div>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-900">Grafik Seismograf Lereng:</div>
                <Seismograph volcanoState={volcanoState} height={90} />
              </div>
            </div>
          )}

          {/* INDIKATOR 2: SUHU */}
          {indicatorId === 'suhu' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Suhu air danau kawah, solfatara, dan fumarol meningkat tajam akibat transfer panas konveksi dari tubuh magma yang kian mendekati permukaan lereng.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Suhu Normal:</span>
                  <span className="font-mono text-emerald-700 font-bold">35°C - 55°C</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Suhu Menjelang Erupsi:</span>
                  <span className="font-mono text-red-600 font-bold">&gt; 120°C - 350°C</span>
                </div>
              </div>
            </div>
          )}

          {/* INDIKATOR 3: GAS */}
          {indicatorId === 'gas' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Konsentrasi gas belerang dioksida (SO₂), karbon dioksida (CO₂), dan hidrogen sulfida (H₂S) melonjak drastis. Emisi gas menghasilkan uap kawah tebal putih pekat hingga kelabu.
              </p>
              <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-900">
                Alat ukur DOAS (Differential Optical Absorption Spectroscopy) mengukur fluks SO₂ harian hingga ribuan ton/hari saat fase krisis erupsi.
              </div>
            </div>
          )}

          {/* INDIKATOR 4: AIR */}
          {indicatorId === 'air' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Mata air alami di sekitar lereng seringkali mengering secara tiba-tiba karena retakan batuan bawah tanah menyedot cadangan air, atau sebaliknya air menjadi sangat keruh dan berbau belerang tajam.
              </p>
            </div>
          )}

          {/* INDIKATOR 5: HEWAN */}
          {indicatorId === 'hewan' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Satwa liar seperti kawanan rusa, burung, dan kelinci memiliki sensitivitas tinggi terhadap gelombang mikro seismik dan hawa panas lereng.
              </p>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                <strong>Respon Satwa:</strong> Burung terbang menjauh ke angkasa, rusa berbondong-bondong melarikan diri menuruni lereng ke area permukiman, dan hewan kecil bersembunyi masuk ke dalam liang batuan.
              </div>
            </div>
          )}

          {/* INDIKATOR 6: DEFORMASI */}
          {indicatorId === 'deformasi' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Tubuh gunung api mengalami penggembungan (inflasi) karena dorongan magma bervolume jutaan meter kubik dari dalam dapur magma.
              </p>
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-[11px]">
                Pemantauan dilakukan dengan sensor Tiltmeter presisi mikroradian dan receiver GPS Geodetik kontinu.
              </div>
            </div>
          )}

          {/* INDIKATOR 7: LAVA */}
          {indicatorId === 'lava' && (
            <div className="space-y-3">
              <p className="text-slate-600">
                Munculnya kubah lava (lava dome) baru di dasar kawah yang berpendar merah oranye pada malam hari, disertai guguran lava pijar yang merayap menuruni lembah sungai di lereng gunung api.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
