/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Compass,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight,
  Eye,
  Info,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { EcoScene3D } from './EcoScene3D';
import { OrganismItem, TimeOfDay, WeatherCondition, CameraPreset, OrganismId } from '../types';
import { ORGANISMS } from '../data/ecoData';
import { OrganismModal } from './OrganismModal';
import { ecoAudio } from '../utils/ecoAudio';

interface ExploreViewProps {
  timeOfDay: TimeOfDay;
  weather: WeatherCondition;
  onToast: (msg: string) => void;
  onExploreOrganism: (id: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  timeOfDay,
  weather,
  onToast,
  onExploreOrganism
}) => {
  const [selectedOrganism, setSelectedOrganism] = useState<OrganismItem | null>(null);
  const [hoveredOrganism, setHoveredOrganism] = useState<OrganismItem | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [showEnergyFlow, setShowEnergyFlow] = useState<boolean>(true);
  const [showTrophicArrows, setShowTrophicArrows] = useState<boolean>(true);
  const [modalOrganism, setModalOrganism] = useState<OrganismItem | null>(null);

  const handleSelectOrganism = (org: OrganismItem | null) => {
    setSelectedOrganism(org);
    if (org) {
      onExploreOrganism(org.id);
      setModalOrganism(org);
      onToast(`Fokus ke: ${org.name} (${org.role})`);
    }
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 select-none">
      {/* 3D VIEWPORT CONTAINER */}
      <div className="relative w-full h-[72vh] min-h-[500px] max-h-[820px] bg-slate-900 overflow-hidden border-b border-slate-800">
        
        {/* Three.js Canvas */}
        <div className="absolute inset-0 w-full h-full">
          <EcoScene3D
            timeOfDay={timeOfDay}
            weather={weather}
            selectedOrganism={selectedOrganism}
            onSelectOrganism={handleSelectOrganism}
            hoveredOrganism={hoveredOrganism}
            setHoveredOrganism={setHoveredOrganism}
            cameraPreset={cameraPreset}
            activeSimulationStep={null}
            removedOrganisms={[]}
            showEnergyFlow={showEnergyFlow}
            showTrophicArrows={showTrophicArrows}
            onToast={onToast}
          />
        </div>

        {/* 1. TOP CONTROLS BAR: CAMERA PRESETS */}
        <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl pointer-events-auto">
            <span className="text-[10px] font-mono text-slate-400 font-bold px-2 hidden sm:inline">
              KAMERA:
            </span>
            <button
              onClick={() => {
                setCameraPreset('overview');
                setSelectedOrganism(null);
                ecoAudio.playClick();
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cameraPreset === 'overview' && !selectedOrganism
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setCameraPreset('producer');
                setSelectedOrganism(null);
                ecoAudio.playClick();
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cameraPreset === 'producer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🌱 Produsen
            </button>
            <button
              onClick={() => {
                setCameraPreset('consumer');
                setSelectedOrganism(null);
                ecoAudio.playClick();
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cameraPreset === 'consumer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🦗 Konsumen
            </button>
            <button
              onClick={() => {
                setCameraPreset('predator');
                setSelectedOrganism(null);
                ecoAudio.playClick();
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cameraPreset === 'predator' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🦅 Predator
            </button>
            <button
              onClick={() => {
                setCameraPreset('decomposer');
                setSelectedOrganism(null);
                ecoAudio.playClick();
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                cameraPreset === 'decomposer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              🍄 Pengurai
            </button>
          </div>

          {/* Energy & Reset Tools */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={() => {
                setShowEnergyFlow(!showEnergyFlow);
                ecoAudio.playClick();
                onToast(`Visualisasi Partikel Energi: ${!showEnergyFlow ? 'AKTIF' : 'NONAKTIF'}`);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all ${
                showEnergyFlow
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-900/90 text-slate-400 border-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Aliran Energi</span>
            </button>

            <button
              onClick={() => {
                setSelectedOrganism(null);
                setCameraPreset('overview');
                ecoAudio.playClick();
                onToast('Sudut pandang kamera di-reset.');
              }}
              title="Reset Kamera"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 shadow-md cursor-pointer transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. BOTTOM FLOATING TROPHIC CHAIN NAVIGATOR */}
        <div className="absolute bottom-3 left-3 right-3 z-30 pointer-events-none">
          <div className="max-w-4xl mx-auto bg-slate-950/85 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl flex items-center justify-between gap-1 overflow-x-auto pointer-events-auto">
            <span className="text-[10px] font-mono font-bold text-slate-400 px-2 uppercase shrink-0 hidden md:inline">
              URUTAN TROFIK:
            </span>

            <div className="flex items-center gap-1.5 flex-1 justify-center sm:justify-start overflow-x-auto py-0.5">
              {ORGANISMS.map((org, idx) => {
                const isSelected = selectedOrganism?.id === org.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => handleSelectOrganism(org)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <span>{org.icon}</span>
                    <span className="hidden sm:inline">{org.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED ORGANISM CATALOG CARDS SECTION */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs font-extrabold uppercase">
            <span>01</span>
            <span>•</span>
            <span>ORGANISME EKOSISTEM PADANG RUMPUT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Peta Anggota Rantai Makanan 3D
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            Klik salah satu kartu organisme di bawah ini untuk mengarahkan kamera 3D langsung ke habitat spesifiknya dan mempelajari perannya dalam piramida makanan:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ORGANISMS.map((org) => {
            return (
              <div
                key={org.id}
                onClick={() => handleSelectOrganism(org)}
                className="p-5 rounded-3xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 shadow-inner group-hover:scale-110 transition-transform">
                      {org.icon}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${org.badgeBg} ${org.badgeBorder} ${org.badgeText}`}>
                      Trofik {org.trophicLevel}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-emerald-400 transition-colors">
                      {org.name}
                    </h3>
                    <p className="text-xs text-slate-400 italic font-serif mt-0.5">{org.scientificName}</p>
                    <span className="inline-block mt-1 text-[11px] font-bold text-emerald-300">{org.role}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {org.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    {org.energyKcal.toLocaleString()} kkal
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Fokus 3D ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focus Mode Organism Modal */}
      <OrganismModal
        organism={modalOrganism}
        onClose={() => setModalOrganism(null)}
      />
    </div>
  );
};
