/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FlaskConical,
  RotateCcw,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  Sparkles,
  ShieldCheck,
  Info
} from 'lucide-react';
import { EcoScene3D } from './EcoScene3D';
import { EXPERIMENT_SCENARIOS, ORGANISMS } from '../data/ecoData';
import { OrganismId, TimeOfDay, WeatherCondition, ExperimentScenario } from '../types';
import { ecoAudio } from '../utils/ecoAudio';

interface ExperimentViewProps {
  timeOfDay: TimeOfDay;
  weather: WeatherCondition;
  onToast: (msg: string) => void;
  onExperimentConducted: (id: string) => void;
}

export const ExperimentView: React.FC<ExperimentViewProps> = ({
  timeOfDay,
  weather,
  onToast,
  onExperimentConducted
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<OrganismId | null>(null);

  const activeScenario = EXPERIMENT_SCENARIOS.find((s) => s.id === activeScenarioId) || null;

  const handleSelectScenario = (id: OrganismId) => {
    setActiveScenarioId(id);
    onExperimentConducted(id);
    ecoAudio.playClick();
    onToast(`Eksperimen Aktif: Organisme ${id} dihilangkan dari ekosistem.`);
  };

  const handleResetEcosystem = () => {
    setActiveScenarioId(null);
    ecoAudio.playClick();
    onToast('Ekosistem dipulihkan ke kondisi seimbang (All Organisms Active).');
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 select-none">
      {/* 3D VIEWPORT SHOWING DYNAMIC SPECIES REMOVAL */}
      <div className="relative w-full h-[60vh] min-h-[420px] max-h-[700px] bg-slate-900 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 w-full h-full">
          <EcoScene3D
            timeOfDay={timeOfDay}
            weather={weather}
            selectedOrganism={null}
            onSelectOrganism={() => {}}
            hoveredOrganism={null}
            setHoveredOrganism={() => {}}
            cameraPreset="overview"
            activeSimulationStep={null}
            removedOrganisms={activeScenarioId ? [activeScenarioId] : []}
            showEnergyFlow={activeScenarioId === null}
            showTrophicArrows={activeScenarioId === null}
            onToast={onToast}
          />
        </div>

        {/* Top Warning Banner if Organism is Removed */}
        <div className="absolute top-3 left-3 right-3 sm:right-auto z-30 pointer-events-none">
          {activeScenario ? (
            <div className="bg-rose-950/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-rose-500/50 shadow-xl flex items-center gap-2.5 text-xs text-rose-200 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="font-extrabold text-white block">
                  SIMULASI KEPUNAHAN: {activeScenario.label.toUpperCase()}
                </span>
                <span className="text-[11px] text-rose-300">
                  Perhatikan ketidakseimbangan trofik yang terjadi pada model 3D!
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800 text-xs text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Kondisi Ekosistem: Seimbang &amp; Lengkap</span>
            </div>
          )}
        </div>

        {/* Reset Ecosystem Button on Viewport */}
        {activeScenarioId && (
          <div className="absolute top-3 right-3 z-30 pointer-events-auto">
            <button
              onClick={handleResetEcosystem}
              className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow-xl cursor-pointer transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Ekosistem</span>
            </button>
          </div>
        )}
      </div>

      {/* EXPERIMENT CONTROL PANEL & IMPACT MATRIX */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        
        {/* Section Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs font-extrabold uppercase">
            <span>LAB EKSPERIMEN DINAMIKA POPULASI</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Apa yang Terjadi Jika Satu Organisme Hilang?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Pilihlah salah satu organisme di bawah ini untuk mengeluarkannya dari ekosistem. Amati efek berantai (Trophic Cascade) yang terjadi pada populasi makhluk hidup lainnya:
          </p>
        </div>

        {/* Experiment Selector Buttons (Section O) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {EXPERIMENT_SCENARIOS.map((scenario) => {
            const isSelected = activeScenarioId === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => handleSelectScenario(scenario.id)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer shadow-md flex flex-col items-center gap-2 group ${
                  isSelected
                    ? 'bg-rose-950/80 border-rose-400 shadow-rose-900/30 text-white scale-[1.02]'
                    : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {scenario.icon}
                </span>
                <span className="font-extrabold text-xs">{scenario.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-rose-900 text-rose-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isSelected ? 'SEDANG DIUJI' : 'Klik untuk Uji'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Result Analysis Card */}
        {activeScenario ? (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6 animate-in slide-in-from-top-4 duration-300">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase block mb-1">
                HASIL ANALISIS EKOLOGIS:
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {activeScenario.summary}
              </h3>
              <p className="text-xs text-slate-400 mt-1 italic">{activeScenario.question}</p>
            </div>

            {/* Impact Grid: Population Changes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {Object.entries(activeScenario.effects).map(([key, effect]) => {
                const org = ORGANISMS.find((o) => o.id === key);
                return (
                  <div
                    key={key}
                    className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 ${
                      effect.trend === 'extinct'
                        ? 'bg-rose-950/40 border-rose-500/40'
                        : effect.trend === 'up'
                        ? 'bg-amber-950/30 border-amber-500/40'
                        : effect.trend === 'down'
                        ? 'bg-blue-950/30 border-blue-500/40'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-2xl mb-1">
                        <span>{org?.icon}</span>
                        {effect.trend === 'up' && <ArrowUp className="w-4 h-4 text-amber-400" />}
                        {effect.trend === 'down' && <ArrowDown className="w-4 h-4 text-blue-400" />}
                        {effect.trend === 'extinct' && <span className="text-xs font-bold text-rose-400">✕</span>}
                        {effect.trend === 'stable' && <Minus className="w-4 h-4 text-slate-400" />}
                      </div>
                      <h4 className="font-extrabold text-sm text-white">{org?.name}</h4>
                      <div className={`text-xs font-mono font-bold mt-0.5 ${
                        effect.trend === 'extinct'
                          ? 'text-rose-400'
                          : effect.trend === 'up'
                          ? 'text-amber-400'
                          : 'text-blue-300'
                      }`}>
                        {effect.percentageText}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {effect.explanation}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Principle & Academic Takeaway */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  HUKUM EKOLOGI (TROPHIC CASCADE):
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {activeScenario.ecologicalRule}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  KESIMPULAN KONSERVASI:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {activeScenario.recommendation}
                </p>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleResetEcosystem}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Pulihkan Seluruh Ekosistem</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
            <span className="text-4xl">⚖️</span>
            <h3 className="font-black text-lg text-white">Ekosistem Dalam Keseimbangan Ideal</h3>
            <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
              Semua tingkatan trofik dari produsen hingga predator puncak berada dalam rasio energi yang stabil. Klik salah satu tombol di atas untuk melihat apa akibatnya jika rantai ini terputus!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
