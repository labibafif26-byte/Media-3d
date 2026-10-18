/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VolcanoScene } from './VolcanoScene';
import { VolcanoState, ParticleSettings } from '../types';
import { Sliders, Play, RotateCcw, AlertTriangle, Flame, Wind, Thermometer, Info } from 'lucide-react';

interface VolcanoLabProps {
  onToast: (msg: string) => void;
  onSimulationComplete?: () => void;
}

export const VolcanoLab: React.FC<VolcanoLabProps> = ({ onToast, onSimulationComplete }) => {
  // 3 Parameter Interaktif Sesuai Prompt 15
  const [pressure, setPressure] = useState<number>(30); // 0 (Low) - 100 (High)
  const [gasVolume, setGasVolume] = useState<number>(25);
  const [magmaTemp, setMagmaTemp] = useState<number>(40);

  const [simState, setSimState] = useState<VolcanoState>('NORMAL');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResultText, setSimResultText] = useState<string>('Atur parameter di atas lalu tekan tombol SIMULASIKAN.');

  // Partikel Dinamis Laboratorium
  const [particleSettings, setParticleSettings] = useState<ParticleSettings>({
    lavaIntensity: 0.8,
    ashSpread: 0.8
  });

  const handleSimulate = () => {
    setIsSimulating(true);
    const totalEnergy = pressure + gasVolume + magmaTemp;

    if (totalEnergy > 190) {
      setSimState('ERUPTION');
      setParticleSettings({ lavaIntensity: 2.0, ashSpread: 2.0 });
      setSimResultText('🔥 ERUPSI EKSPLOSIF DASYAT! Tekanan gas dan magma sangat tinggi menyebabkan letusan dahsyat tipe Plinian. Abu membubung tinggi dan lava meluap!');
      onToast('Hasil Simulasi: Erupsi Eksplosif Besar!');
    } else if (totalEnergy > 110) {
      setSimState('WARNING');
      setParticleSettings({ lavaIntensity: 1.2, ashSpread: 1.1 });
      setSimResultText('⚠️ STATUS WASPADA / SIAGA: Tekanan magma mulai mendesak pipa kepundan, gas belerang menebal, dan kubah lava kian membesar.');
      onToast('Hasil Simulasi: Aktivitas Meningkat!');
    } else {
      setSimState('NORMAL');
      setParticleSettings({ lavaIntensity: 0.6, ashSpread: 0.5 });
      setSimResultText('🌿 STATUS NORMAL: Kondisi stabil, gas keluar dalam batas aman, tidak terjadi desakan magma ke permukaan.');
      onToast('Hasil Simulasi: Gunung Stabil Normal.');
    }

    if (onSimulationComplete) {
      onSimulationComplete();
    }
  };

  const resetLab = () => {
    setPressure(30);
    setGasVolume(25);
    setMagmaTemp(40);
    setSimState('NORMAL');
    setParticleSettings({ lavaIntensity: 0.8, ashSpread: 0.8 });
    setSimResultText('Simulasi di-reset ke kondisi normal awal.');
    setIsSimulating(false);
    onToast('Laboratorium telah di-reset.');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Laboratorium */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-red-500/10 border border-orange-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-black">
            <span>🔬 LABORATORIUM EKSPERIMEN</span>
            <span>•</span>
            <span>KELAS 4 SD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Laboratorium Gunung Api
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Uji hubungan antara tekanan magma, gas vulkanik, dan suhu terhadap proses terjadinya erupsi!
          </p>
        </div>

        <button
          onClick={resetLab}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-sm flex items-center gap-2 cursor-pointer transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Lab</span>
        </button>
      </div>

      {/* Grid: 3D Preview Kiri & Panel Kontrol Parameter Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Tampilan 3D Gunung Hasil Simulasi (7 Kolom) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl h-[380px] sm:h-[450px] relative">
          <VolcanoScene
            volcanoState={simState}
            isCutaway={false}
            selectedMarkerId={null}
            onSelectMarker={() => {}}
            cameraPreset="default"
            particleSettings={particleSettings}
            onToast={onToast}
            showHotspots={false}
          />

          {/* Status Overlay */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2 text-xs font-black">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                simState === 'ERUPTION'
                  ? 'bg-red-500 animate-ping'
                  : simState === 'WARNING'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            />
            <span className="text-slate-800">STATUS HASIL: {simState}</span>
          </div>
        </div>

        {/* Panel Kontrol Parameter Sesuai Prompt 15 (5 Kolom) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-black text-slate-900">
              Parameter Kondisi Magma
            </h3>
          </div>

          {/* Parameter 1: Tekanan Magma (Low - High) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black text-slate-700">
              <span className="flex items-center gap-1.5 text-red-600">
                <Flame className="w-4 h-4" />
                Tekanan Magma
              </span>
              <span className="font-mono text-slate-500 font-bold">{pressure}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={pressure}
              onChange={(e) => setPressure(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
              <span>RENDAH</span>
              <span>SEDANG</span>
              <span>TINGGI</span>
            </div>
          </div>

          {/* Parameter 2: Gas Vulkanik (Low - High) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black text-slate-700">
              <span className="flex items-center gap-1.5 text-sky-600">
                <Wind className="w-4 h-4" />
                Volume Gas Vulkanik
              </span>
              <span className="font-mono text-slate-500 font-bold">{gasVolume}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={gasVolume}
              onChange={(e) => setGasVolume(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
              <span>SEDIKIT</span>
              <span>CUKUP</span>
              <span>MELIMPAH</span>
            </div>
          </div>

          {/* Parameter 3: Suhu Magma (Low - High) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-black text-slate-700">
              <span className="flex items-center gap-1.5 text-amber-600">
                <Thermometer className="w-4 h-4" />
                Suhu Magma Kawah
              </span>
              <span className="font-mono text-slate-500 font-bold">{magmaTemp}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={magmaTemp}
              onChange={(e) => setMagmaTemp(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400">
              <span>HANGAT</span>
              <span>PANAS</span>
              <span>EXTREME (1.200°C)</span>
            </div>
          </div>

          {/* Tombol Simulasikan */}
          <div className="flex justify-center pt-1">
            <button
              onClick={handleSimulate}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] text-slate-950 font-black text-xs shadow-md shadow-orange-500/25 cursor-pointer transition-all border border-amber-300"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>SIMULASIKAN ERUPSI</span>
            </button>
          </div>

          {/* Feedback Hasil Belajar */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs leading-relaxed text-slate-700 space-y-1">
            <div className="font-black text-amber-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600" />
              Penjelasan Hasil Simulasi:
            </div>
            <p className="font-medium">{simResultText}</p>
          </div>

          {/* Disclaimer Wajib Sesuai Prompt 15 */}
          <div className="text-[11px] text-slate-400 italic text-center">
            “Simulasi ini adalah model sederhana untuk membantu memahami konsep.”
          </div>

        </div>

      </div>

    </div>
  );
};
