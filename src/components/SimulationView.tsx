/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import { EcoScene3D } from './EcoScene3D';
import { FOOD_CHAIN_STEPS, ORGANISMS } from '../data/ecoData';
import { TimeOfDay, WeatherCondition, OrganismItem } from '../types';
import { ecoAudio } from '../utils/ecoAudio';

interface SimulationViewProps {
  timeOfDay: TimeOfDay;
  weather: WeatherCondition;
  onToast: (msg: string) => void;
  onSimulationCompleted: () => void;
}

export const SimulationView: React.FC<SimulationViewProps> = ({
  timeOfDay,
  weather,
  onToast,
  onSimulationCompleted
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 to 6 (Steps 1 to 7)
  const [isPlaying, setIsPlaying] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeStep = FOOD_CHAIN_STEPS[currentStepIndex];

  // Auto-play timer loop
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setTimeout(() => {
        if (currentStepIndex < FOOD_CHAIN_STEPS.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          onSimulationCompleted();
          onToast('🎉 Simulasi Rantai Makanan Selesai! Kamu mendapatkan +20 XP!');
          ecoAudio.playQuizCorrect();
        }
      }, 5500);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying, currentStepIndex]);

  const handleNextStep = () => {
    if (currentStepIndex < FOOD_CHAIN_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      ecoAudio.playEnergyPulse();
    } else {
      onSimulationCompleted();
      onToast('🎉 Seluruh siklus rantai makanan telah disimulasikan!');
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      ecoAudio.playClick();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    ecoAudio.playClick();
    onToast('Simulasi di-reset ke Tahap 1.');
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 select-none">
      {/* 3D VIEWPORT WITH SIMULATION CAMERA TARGET */}
      <div className="relative w-full h-[65vh] min-h-[460px] max-h-[750px] bg-slate-900 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 w-full h-full">
          <EcoScene3D
            timeOfDay={timeOfDay}
            weather={weather}
            selectedOrganism={null}
            onSelectOrganism={() => {}}
            hoveredOrganism={null}
            setHoveredOrganism={() => {}}
            cameraPreset="overview"
            activeSimulationStep={activeStep.step}
            removedOrganisms={[]}
            showEnergyFlow={true}
            showTrophicArrows={true}
            onToast={onToast}
          />
        </div>

        {/* 1. TOP STATUS BADGE */}
        <div className="absolute top-3 left-3 z-30 pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono font-bold text-white uppercase">
              SIMULASI TAHAP {activeStep.step} / {FOOD_CHAIN_STEPS.length}
            </span>
          </div>
        </div>

        {/* 2. DYNAMIC FLOATING NARRATION CARD (Section N) */}
        <div className="absolute bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-30 pointer-events-auto">
          <div className="bg-slate-900/95 backdrop-blur-xl p-5 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-3 animate-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                LANGKAH KE-{activeStep.step}
              </span>
              <span className="text-[11px] font-mono font-extrabold text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30">
                {activeStep.energyTransferred.split(' ')[0]} kkal
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-white">{activeStep.title}</h3>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed font-medium">
                {activeStep.narration}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <span className="text-emerald-400 font-bold block mb-0.5 font-mono text-[10px]">
                SAINS TROFIK:
              </span>
              {activeStep.scientificExplanation}
            </div>

            {/* Step Controls */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  ecoAudio.playClick();
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Jeda Simulasi' : 'Jalankan Otomatis'}</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === FOOD_CHAIN_STEPS.length - 1}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleReset}
                title="Ulangi dari Awal"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE PROGRESS & ENERGY DEPRECIATION EXPLANATION */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Step Progression Indicators */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
            <span>ALUR PERPINDAHAN ENERGI</span>
            <span className="text-emerald-400">Hukum 10% Lindeman</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {FOOD_CHAIN_STEPS.map((s, idx) => {
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={s.step}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    ecoAudio.playClick();
                  }}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    isActive
                      ? 'bg-emerald-950/80 border-emerald-400 shadow-lg text-white'
                      : isPast
                      ? 'bg-slate-900/80 border-slate-700 text-slate-300'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold">0{s.step}</span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className="font-extrabold text-xs truncate">{s.title.split(' ')[0]}</div>
                  <div className="text-[10px] text-amber-300/80 font-mono mt-0.5">
                    {s.energyTransferred.split(' ')[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Energy Pyramid (Piramida Energi) */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Piramida Energi &amp; Penyusutan Kalori
            </h3>
            <span className="text-xs font-mono text-slate-400">10% Efisiensi Trofik</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Pada setiap tingkatan trofik, hanya sekitar <strong>10%</strong> energi yang dapat disimpan sebagai jaringan tubuh organisme, sementara <strong>90%</strong> sisanya hilang sebagai panas respirasi dan ekskresi. Inilah sebabnya mengapa predator puncak (Elang) membutuhkan wilayah jelajah luas dan populasinya lebih sedikit.
          </p>

          <div className="space-y-2 pt-2">
            {[
              { label: 'Predator Puncak (Elang Jawa)', kcal: '1 kkal (0.01%)', width: '8%', color: 'bg-rose-500' },
              { label: 'Konsumen III (Ular Rumput)', kcal: '10 kkal (0.1%)', width: '22%', color: 'bg-orange-500' },
              { label: 'Konsumen II (Katak Sawah)', kcal: '100 kkal (1%)', width: '45%', color: 'bg-cyan-500' },
              { label: 'Konsumen I (Belalang Padang)', kcal: '1.000 kkal (10%)', width: '70%', color: 'bg-lime-500' },
              { label: 'Produsen Primer (Rumput Padang)', kcal: '10.000 kkal (100%)', width: '100%', color: 'bg-emerald-500' }
            ].map((bar, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-bold">{bar.label}</span>
                  <span className="font-mono font-extrabold text-amber-400">{bar.kcal}</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${bar.color} rounded-full transition-all duration-700`}
                    style={{ width: bar.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
