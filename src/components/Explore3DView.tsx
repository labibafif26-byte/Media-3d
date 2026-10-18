/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { VolcanoScene } from './VolcanoScene';
import { SignsOfEruptionPanel } from './SignsOfEruptionPanel';
import { VolcanoState, MarkerItem, ParticleSettings, CameraPreset } from '../types';
import { VOLCANO_MARKERS } from '../data/volcanoData';
import {
  Layers,
  Eye,
  Camera,
  Maximize2,
  Minimize2,
  Sliders,
  RotateCcw,
  Sparkles,
  MapPin,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Info,
  CheckCircle2,
  HelpCircle,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Compass,
  Thermometer,
  Wind,
  Activity,
  AlertTriangle,
  X
} from 'lucide-react';

interface Explore3DViewProps {
  volcanoState: VolcanoState;
  onStateChange: (state: VolcanoState) => void;
  selectedMarker: MarkerItem | null;
  onSelectMarker: (marker: MarkerItem) => void;
  onCloseFocusMode: () => void;
  isCutaway: boolean;
  setIsCutaway: (cut: boolean) => void;
  cutawayProgress: number; // 0 (luar) sampai 100 (dalam)
  setCutawayProgress: (prog: number) => void;
  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;
  particleSettings: ParticleSettings;
  setParticleSettings: React.Dispatch<React.SetStateAction<ParticleSettings>>;
  onToast: (msg: string) => void;
  onDiscoverObject: (markerId: string) => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  onTakeSnapshot: () => void;
}

export const Explore3DView: React.FC<Explore3DViewProps> = ({
  volcanoState,
  onStateChange,
  selectedMarker,
  onSelectMarker,
  onCloseFocusMode,
  isCutaway,
  setIsCutaway,
  cutawayProgress,
  setCutawayProgress,
  cameraPreset,
  setCameraPreset,
  particleSettings,
  setParticleSettings,
  onToast,
  onDiscoverObject,
  isAudioOn,
  onToggleAudio,
  onTakeSnapshot
}) => {
  // Mode UI: Belajar vs Eksplorasi
  const [exploreMode, setExploreMode] = useState<'study' | 'free'>('study');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoDemo, setIsAutoDemo] = useState(false);
  const [isCalderaFormed, setIsCalderaFormed] = useState(false);
  const autoDemoTimerRef = useRef<NodeJS.Timeout[]>([]);

  // Tanda-Tanda Sebelum Erupsi & Simulasi Bertahap State
  const [showSignsPanel, setShowSignsPanel] = useState<boolean>(false);
  const [signsPanelMode, setSignsPanelMode] = useState<'signs' | 'stepped'>('signs');
  const [activeHighlightPosition, setActiveHighlightPosition] = useState<[number, number, number] | null>(null);

  // Canvas Seismograph ref
  const seismoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Seismograph Waveform Effect
  useEffect(() => {
    const canvas = seismoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const renderWave = () => {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 1.5;
      const midY = canvas.height / 2;

      let amp = 2;
      let strokeColor = '#22c55e'; // Normal green

      if (volcanoState === 'WARNING') {
        amp = 9;
        strokeColor = '#f59e0b'; // Orange
      } else if (volcanoState === 'ERUPTION') {
        amp = 18;
        strokeColor = '#ef4444'; // Red
      }

      ctx.strokeStyle = strokeColor;
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x++) {
        const wave = Math.sin((x + offset) * 0.18) * Math.sin((x + offset) * 0.04) * amp;
        const noise = (Math.random() - 0.5) * (amp * 0.7);
        const y = midY + wave + noise;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      offset += volcanoState === 'ERUPTION' ? 5 : volcanoState === 'WARNING' ? 3 : 1;
      animId = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [volcanoState]);

  // Clean up auto demo timers
  const stopAutoDemo = () => {
    autoDemoTimerRef.current.forEach(t => clearTimeout(t));
    autoDemoTimerRef.current = [];
    setIsAutoDemo(false);
  };

  const startAutoDemo = () => {
    stopAutoDemo();
    setIsAutoDemo(true);
    onToast('▶ AUTO DEMO DIMULAI: Tur Edukasi Geologi 3D Otomatis');

    // Step 1: Overview normal
    setCameraPreset('default');
    onStateChange('NORMAL');
    setIsCutaway(false);
    setCutawayProgress(0);

    // Step 2: Zooms to crater
    const t1 = setTimeout(() => {
      setCameraPreset('crater');
      onToast('🔍 Mengamati Kawah Puncak dan Danau Lava');
    }, 3000);

    // Step 3: Switch to Cutaway
    const t2 = setTimeout(() => {
      setCameraPreset('cutaway');
      setIsCutaway(true);
      setCutawayProgress(100);
      onToast('🔬 Membedah Pipa Vent & Kamar Dapur Magma Bawah Tanah');
    }, 7000);

    // Step 4: Warning state
    const t3 = setTimeout(() => {
      onStateChange('WARNING');
      onToast('⚠️ Tanda Aktivitas Meningkat: Gempa Tremor & Gas Bertambah');
    }, 11000);

    // Step 5: Eruption
    const t4 = setTimeout(() => {
      onStateChange('ERUPTION');
      setCameraPreset('wildlife');
      onToast('🌋 ERUPSI: Lontaran Abu, Lava Pijar & Kawanan Satwa Fleeing');
    }, 15000);

    // Step 6: Reset
    const t5 = setTimeout(() => {
      onStateChange('NORMAL');
      setCameraPreset('default');
      setIsCutaway(false);
      setCutawayProgress(0);
      onToast('✓ Auto Demo Selesai: Sistem Kembali ke Mode Normal');
      setIsAutoDemo(false);
    }, 24000);

    autoDemoTimerRef.current = [t1, t2, t3, t4, t5];
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Focus directly on a marker with alias support and accurate targeting
  const focusOnMarkerById = (markerId: string) => {
    const normalizedId = 
      markerId === 'crater' ? 'kawah' :
      markerId === 'magma_chamber' ? 'chamber' :
      markerId === 'wildlife' ? 'hewan' :
      markerId === 'seismograph' ? 'gempa' :
      markerId === 'ash' ? 'abu' :
      markerId;

    const target = VOLCANO_MARKERS.find(m => m.id === normalizedId || m.id === markerId);
    if (target) {
      onSelectMarker(target);
      onDiscoverObject(target.id);
      setActiveHighlightPosition(target.position);

      if (normalizedId === 'kawah') {
        setCameraPreset('crater');
        setIsCutaway(false);
        setCutawayProgress(0);
      } else if (normalizedId === 'abu') {
        setCameraPreset('crater');
        setIsCutaway(false);
        setCutawayProgress(0);
      } else if (normalizedId === 'lava') {
        setCameraPreset('flank');
        setIsCutaway(false);
        setCutawayProgress(0);
      } else if (normalizedId === 'chamber' || normalizedId === 'vent') {
        setCameraPreset('cutaway');
        setIsCutaway(true);
        setCutawayProgress(100);
      } else if (normalizedId === 'hewan') {
        setCameraPreset('wildlife');
        setIsCutaway(false);
        setCutawayProgress(0);
      } else if (normalizedId === 'gempa') {
        setCameraPreset('seismograph');
        setIsCutaway(false);
        setCutawayProgress(0);
      } else if (normalizedId === 'strata') {
        setCameraPreset('flank');
        setIsCutaway(false);
        setCutawayProgress(0);
      } else if (normalizedId === 'sungai') {
        setCameraPreset('default');
        setIsCutaway(false);
        setCutawayProgress(0);
      } else if (normalizedId === 'hutan') {
        setCameraPreset('wildlife');
        setIsCutaway(false);
        setCutawayProgress(0);
      } else {
        setCameraPreset('default');
      }
    }
  };

  return (
    <div className={`w-full bg-slate-950 text-slate-100 select-none ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}>
      
      {/* 3D HERO VIEWPORT CONTAINER */}
      <div className="relative w-full h-[75vh] min-h-[520px] max-h-[850px] bg-slate-900 overflow-hidden border-b border-slate-800">
        
        {/* Three.js Canvas Scene */}
        <div className="absolute inset-0 w-full h-full">
          <VolcanoScene
            volcanoState={volcanoState}
            isCutaway={isCutaway || cutawayProgress > 30}
            selectedMarkerId={selectedMarker ? selectedMarker.id : null}
            onSelectMarker={(m) => {
              focusOnMarkerById(m.id);
            }}
            cameraPreset={cameraPreset}
            particleSettings={particleSettings}
            onToast={onToast}
            showHotspots={exploreMode === 'study'}
            isCalderaFormed={isCalderaFormed}
            activeHighlightPosition={activeHighlightPosition}
          />

          {/* Dimmer backdrop when inspecting hotspot */}
          {selectedMarker && exploreMode === 'study' && (
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] pointer-events-none transition-all duration-300" />
          )}
        </div>

        {/* 1. TOP FLOATING BAR (STUDY SWITCHER & QUICK ACTIONS) */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
          
          {/* Mode Switcher */}
          <div className="flex bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg pointer-events-auto">
            <button
              onClick={() => {
                setExploreMode('study');
                onToast('Mode Belajar: Hotspot dan informasi ditampilkan.');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                exploreMode === 'study'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📚 Mode Belajar
            </button>
            <button
              onClick={() => {
                setExploreMode('free');
                onToast('Mode Jelajah Bebas: Layar bersih tanpa gangguan.');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                exploreMode === 'free'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🔎 Jelajah Bebas
            </button>
          </div>

          {/* Quick Tools */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            
            {/* Tombol Fitur Utama: Lihat Tanda-Tanda Sebelum Erupsi */}
            <button
              onClick={() => {
                setShowSignsPanel(true);
                setSignsPanelMode('signs');
                setCameraPreset('signs_overview');
                onToast('🌋 Menampilkan 6 Tanda-Tanda Peningkatan Aktivitas Vulkanik...');
              }}
              title="Lihat Tanda-Tanda Sebelum Erupsi"
              className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 ${
                showSignsPanel && signsPanelMode === 'signs'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/20'
                  : 'bg-slate-900/95 hover:bg-slate-800 text-amber-400 border-amber-500/50 hover:border-amber-400'
              }`}
            >
              <span>🌋</span>
              <span className="inline">Lihat Tanda-Tanda</span>
            </button>

            {/* Tombol Fitur Utama: Mulai Simulasi Bertahap */}
            <button
              onClick={() => {
                setShowSignsPanel(true);
                setSignsPanelMode('stepped');
                onToast('▶️ Memulai Alur Simulasi Bertahap 4 Tingkatan...');
              }}
              title="Mulai Simulasi Bertahap (Normal → Meningkat → Tinggi → Erupsi)"
              className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 ${
                showSignsPanel && signsPanelMode === 'stepped'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/20'
                  : 'bg-slate-900/95 hover:bg-slate-800 text-orange-400 border-orange-500/50 hover:border-orange-400'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Simulasi Bertahap</span>
            </button>

            <button
              onClick={() => {
                const next = !isCutaway;
                setIsCutaway(next);
                setCutawayProgress(next ? 100 : 0);
                if (next) {
                  setCameraPreset('cutaway');
                  onToast('🔬 Mode Penampang X-Ray Aktif: Menampilkan Dapur Magma & Lapisan Batuan');
                } else {
                  setCameraPreset('default');
                  onToast('Kembali ke Tampilan Luar Gunung.');
                }
              }}
              title="Toggle Penampang (X-Ray)"
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 ${
                isCutaway
                  ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/20'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-amber-400 border-amber-500/40'
              }`}
            >
              <span>🔬</span>
              <span className="hidden sm:inline">X-Ray</span>
            </button>

            <button
              onClick={isAutoDemo ? stopAutoDemo : startAutoDemo}
              title={isAutoDemo ? 'Hentikan Demo' : 'Jalankan Auto Demo'}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 ${
                isAutoDemo
                  ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-amber-400 border-amber-500/40'
              }`}
            >
              {isAutoDemo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isAutoDemo ? 'Stop Demo' : 'Auto Demo'}</span>
            </button>

            <button
              onClick={onTakeSnapshot}
              title="Ambil Foto 3D"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleAudio}
              title="Suara Lingkungan"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-md cursor-pointer transition-all active:scale-95"
            >
              {isAudioOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            <button
              onClick={toggleFullscreen}
              title="Layar Penuh"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-md cursor-pointer transition-all active:scale-95"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. FLOATING SIMULATION CONTROL PANEL (Section AU, AH) */}
        <div className="absolute top-14 right-3 z-20 w-64 sm:w-72 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-2xl space-y-3 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              SIMULATION CONTROL
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
              volcanoState === 'NORMAL'
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                : volcanoState === 'WASPADA' || volcanoState === 'WARNING'
                ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                : volcanoState === 'SIAGA'
                ? 'bg-orange-950/60 text-orange-400 border-orange-500/40'
                : 'bg-red-950/60 text-red-400 border-red-500/40 animate-pulse'
            }`}>
              {volcanoState === 'NORMAL' && '● LEVEL I • NORMAL'}
              {(volcanoState === 'WASPADA' || volcanoState === 'WARNING') && '⚠ LEVEL II • WASPADA'}
              {volcanoState === 'SIAGA' && '🔥 LEVEL III • SIAGA'}
              {volcanoState === 'ERUPTION' && '🌋 LEVEL IV • AWAS'}
            </span>
          </div>

          {/* 4 Tingkatan Status Resmi PVMBG */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                onStateChange('NORMAL');
                onToast('Status: LEVEL I NORMAL (Aktivitas dasar aman & tenang)');
              }}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                volcanoState === 'NORMAL'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              ● NORMAL
            </button>

            <button
              onClick={() => {
                onStateChange('WASPADA');
                onToast('Status: LEVEL II WASPADA (Tremor & gas belerang mulai naik)');
              }}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                volcanoState === 'WASPADA' || volcanoState === 'WARNING'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              ⚠ WASPADA
            </button>

            <button
              onClick={() => {
                onStateChange('SIAGA');
                onToast('Status: LEVEL III SIAGA (Deformasi lereng & desakan magma aktif)');
              }}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                volcanoState === 'SIAGA'
                  ? 'bg-orange-600 text-white border-orange-400 shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              🔥 SIAGA
            </button>

            <button
              onClick={() => {
                onToast('1. Peningkatan suhu kawah & gas SO₂...');
                setTimeout(() => onToast('2. Kolom abu piroklastik membubung ke angkasa...'), 700);
                setTimeout(() => onToast('3. Aliran lava pijar meluap menuruni lereng...'), 1400);
                setTimeout(() => onToast('4. LEVEL IV AWAS: Erupsi dahsyat berlangsung!'), 2100);
                onStateChange('ERUPTION');
              }}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                volcanoState === 'ERUPTION'
                  ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-600/40 animate-pulse'
                  : 'bg-red-950/80 hover:bg-red-900 text-red-300 border-red-800/60'
              }`}
            >
              🌋 ERUPSI (AWAS)
            </button>

            <button
              onClick={() => {
                setShowSignsPanel(true);
                setSignsPanelMode('signs');
                setCameraPreset('signs_overview');
                onToast('Membuka Panduan 6 Tanda-Tanda Sebelum Erupsi...');
              }}
              className="col-span-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-[11px] font-bold text-amber-300 border border-amber-500/40 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-all active:scale-95"
            >
              <span>🔍</span>
              <span>Pelajari 6 Tanda Sebelum Erupsi</span>
            </button>

            <button
              onClick={() => {
                onStateChange('NORMAL');
                setIsCutaway(false);
                setCutawayProgress(0);
                setCameraPreset('default');
                onCloseFocusMode();
                onToast('Simulasi dan posisi kamera di-reset.');
              }}
              className="col-span-2 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-[11px] font-bold text-slate-400 hover:text-slate-200 border border-slate-700/50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Posisi & Status</span>
            </button>
          </div>

          {/* Camera Presets Selector */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-400 block mb-1.5">PRESET KAMERA:</span>
            <div className="grid grid-cols-4 gap-1">
              <button
                onClick={() => {
                  setCameraPreset('default');
                  setIsCutaway(false);
                  setCutawayProgress(0);
                }}
                className={`py-1 rounded text-[10px] font-bold cursor-pointer border ${
                  cameraPreset === 'default' && !isCutaway ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => {
                  setCameraPreset('crater');
                  setIsCutaway(false);
                  setCutawayProgress(0);
                }}
                className={`py-1 rounded text-[10px] font-bold cursor-pointer border ${
                  cameraPreset === 'crater' && !isCutaway ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Kawah
              </button>
              <button
                onClick={() => {
                  setCameraPreset('cutaway');
                  setIsCutaway(true);
                  setCutawayProgress(100);
                }}
                className={`py-1 rounded text-[10px] font-bold cursor-pointer border ${
                  isCutaway ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/50' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Penampang
              </button>
              <button
                onClick={() => {
                  setCameraPreset('wildlife');
                  setIsCutaway(false);
                  setCutawayProgress(0);
                }}
                className={`py-1 rounded text-[10px] font-bold cursor-pointer border ${
                  cameraPreset === 'wildlife' && !isCutaway ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                Satwa
              </button>
            </div>
          </div>

          {/* Morfologi Bentuk Gunung (Kerucut Utuh vs Kaldera Pasca Erupsi) */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-400 block mb-1.5">BENTUK GEOLOGI GUNUNG:</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  setIsCalderaFormed(false);
                  onToast('Bentuk Gunung: Kerucut Strato Utuh (Sebelum Erupsi)');
                }}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold cursor-pointer border text-center transition-all ${
                  !isCalderaFormed
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                ⛰️ Kerucut Utuh
              </button>
              <button
                onClick={() => {
                  setIsCalderaFormed(true);
                  onToast('Bentuk Gunung: Kaldera Pasca Letusan (Puncak Amblas & Kawah Melebar)');
                }}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold cursor-pointer border text-center transition-all ${
                  isCalderaFormed
                    ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                🌋 Kaldera Pasca Letusan
              </button>
            </div>
          </div>
        </div>

        {/* 3. INSTRUMENT MONITORING BAR (Bawah Kiri: Seismograf & Indikator) */}
        <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-end gap-2.5 pointer-events-auto">
          
          {/* Live Seismograph Widget */}
          <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-2xl w-60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                SEISMOGRAF (RSAM)
              </span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                volcanoState === 'NORMAL'
                  ? 'bg-emerald-950 text-emerald-400'
                  : volcanoState === 'WARNING'
                  ? 'bg-amber-950 text-amber-400'
                  : 'bg-red-950 text-red-400 font-black'
              }`}>
                {volcanoState === 'NORMAL' ? 'TENANG' : volcanoState === 'WARNING' ? 'TREMOR' : 'MAX AMPL'}
              </span>
            </div>

            <canvas
              ref={seismoCanvasRef}
              width={220}
              height={44}
              className="w-full h-11 bg-slate-950 rounded-lg border border-slate-800"
            />

            <div className="flex items-center justify-between text-[8px] font-mono text-slate-500">
              <span>Stasiun Lereng Selatan</span>
              <span className="text-amber-500/80">DATA ILUSTRASI</span>
            </div>
          </div>

          {/* Indikator Mini: Suhu & Gas */}
          <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-2 w-44 text-[11px]">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-orange-400" /> Suhu Kawah</span>
                <span className="font-mono font-bold text-slate-200">
                  {volcanoState === 'NORMAL' ? '75°C' : volcanoState === 'WARNING' ? '280°C' : '980°C'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 transition-all duration-500"
                  style={{ width: volcanoState === 'NORMAL' ? '20%' : volcanoState === 'WARNING' ? '60%' : '100%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-sky-400" /> Gas SO₂</span>
                <span className="font-mono font-bold text-slate-200">
                  {volcanoState === 'NORMAL' ? '80 t/d' : volcanoState === 'WARNING' ? '850 t/d' : '3.200 t/d'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-400 transition-all duration-500"
                  style={{ width: volcanoState === 'NORMAL' ? '15%' : volcanoState === 'WARNING' ? '65%' : '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Slider Cutaway Penampang (Section T) */}
          <div className="bg-slate-900/95 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-2xl w-48">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-300 mb-1.5">
              <span>PENAMPANG (X-RAY)</span>
              <span className="text-amber-400 font-mono">{cutawayProgress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={cutawayProgress}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCutawayProgress(val);
                setIsCutaway(val > 25);
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1">
              <span>Luar</span>
              <span>Dapur Magma</span>
            </div>
          </div>
        </div>

        {/* 4. INSPECTOR CARD (Jika hotspot diklik) */}
        {selectedMarker && (
          <div className="absolute bottom-3 right-3 z-30 w-84 max-w-[calc(100vw-24px)] bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-amber-500/50 shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>📍 MENGARAH KE: {selectedMarker.category}</span>
                </div>
                <h4 className="text-sm font-black text-white">{selectedMarker.name}</h4>
              </div>
              <button
                onClick={() => {
                  onCloseFocusMode();
                  setActiveHighlightPosition(null);
                }}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick helper for subterranean structures */}
            {(selectedMarker.id === 'chamber' || selectedMarker.id === 'vent') && !isCutaway && (
              <div className="mb-2.5">
                <button
                  onClick={() => {
                    setIsCutaway(true);
                    setCutawayProgress(100);
                    setCameraPreset('cutaway');
                    setActiveHighlightPosition(selectedMarker.position);
                    onToast('🔬 Mengaktifkan Penampang X-Ray untuk melihat interior!');
                  }}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-[11px] font-bold text-orange-300 cursor-pointer transition-colors"
                >
                  <span>🔬</span>
                  <span>Buka Penampang X-Ray</span>
                </button>
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {selectedMarker.simpleExplanation || selectedMarker.description}
            </p>

            {selectedMarker.metrics && selectedMarker.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800 mb-3 text-[10px]">
                {selectedMarker.metrics.map((m, idx) => (
                  <div key={idx}>
                    <span className="text-slate-500 block">{m.label}</span>
                    <strong className="text-amber-300 font-mono">{m.value}</strong>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  focusOnMarkerById(selectedMarker.id);
                  onToast(`🎯 Kamera dipusatkan ke: ${selectedMarker.name}`);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer shadow-sm active:scale-95 transition-transform"
              >
                <span>🎯</span>
                <span>Pusatkan Kamera</span>
              </button>
              <button
                onClick={() => {
                  onCloseFocusMode();
                  setActiveHighlightPosition(null);
                }}
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* 5. INTERACTIVE SIGNS OF ERUPTION & STEPPED SIMULATION PANEL */}
        <SignsOfEruptionPanel
          volcanoState={volcanoState}
          onStateChange={onStateChange}
          onSelectCameraPreset={(preset) => setCameraPreset(preset as any)}
          onHighlightPosition={(pos) => setActiveHighlightPosition(pos)}
          onFocusMarker={(id) => focusOnMarkerById(id)}
          onToast={onToast}
          isOpen={showSignsPanel}
          onClose={() => {
            setShowSignsPanel(false);
            setActiveHighlightPosition(null);
          }}
          activeMode={signsPanelMode}
          onChangeMode={(mode) => setSignsPanelMode(mode)}
        />

      </div>

      {/* ============================================================
          SECTIONS 01 — 06: MATERI LENGKAP DI BAWAH VIEWPORT 3D
          ============================================================ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        
        {/* SECTION 01 — EKSPLORASI GUNUNG */}
        <section id="section-explore" className="space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-extrabold">
            <span>01</span>
            <span>•</span>
            <span>PANDUAN INTERAKSI 3D</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Eksplorasi Gunung Berapi 3D Interaktif
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
            Model 3D di atas dirancang untuk memberikan pengalaman belajar nyata tentang cara kerja gunung berapi tipe <em>stratovolcano</em>. Anda dapat memutar, memperbesar, serta mengamati bagaimana pergerakan magma memengaruhi lingkungan di sekitarnya.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl mb-2">🖱️</div>
              <h3 className="font-bold text-sm text-slate-200 mb-1">Rotasi & Zoom</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Klik dan geser pada area 3D untuk memutar sudut pandang. Gunakan scroll mouse atau cubit layar sentuh untuk zoom in/out.
              </p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl mb-2">🔬</div>
              <h3 className="font-bold text-sm text-slate-200 mb-1">Mode Penampang</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Geser slider penampang di pojok kiri bawah untuk memotong bagian lereng luar dan melihat pipa ventilasi magma.
              </p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold text-sm text-slate-200 mb-1">Hotspot Interaktif</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Klik pin berwarna yang melayang di atas gunung untuk membaca penjelasan rinci fungsi geologis bagian tersebut.
              </p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-sm text-slate-200 mb-1">Simulasi Letusan</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ubah tingkat aktivitas dari Normal ke Warning atau Erupsi untuk melihat respon kepulan asap, lava, dan kawanan hewan.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 02 — STRUKTUR GUNUNG API */}
        <section id="section-structure" className="space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-extrabold">
            <span>02</span>
            <span>•</span>
            <span>ANATOMI & BAGIAN DALAM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Struktur Utama Gunung Api
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
            Klik salah satu kartu di bawah ini untuk mengarahkan kamera 3D langsung ke struktur geologis tersebut:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                focusOnMarkerById('kawah');
              }}
              className="bg-slate-900/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                PUNCAK
              </span>
              <h3 className="font-extrabold text-base text-white mt-2 mb-1 group-hover:text-amber-400 transition-colors">
                1. Kawah (Crater)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Cekungan terbuka di puncak gunung tempat material letusan seperti gas, abu, bom vulkanik, dan lava keluar.
              </p>
              <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                Fokuskan Kamera 3D ➔
              </span>
            </div>

            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                focusOnMarkerById('vent');
              }}
              className="bg-slate-900/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                SALURAN
              </span>
              <h3 className="font-extrabold text-base text-white mt-2 mb-1 group-hover:text-amber-400 transition-colors">
                2. Saluran Magma (Vent)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Pipa silindris utama di dalam kerak bumi yang menjadi jalur naiknya magma cair bertekanan tinggi menuju kawah.
              </p>
              <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                Fokuskan Kamera 3D ➔
              </span>
            </div>

            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                focusOnMarkerById('chamber');
              }}
              className="bg-slate-900/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                RESERVOIR
              </span>
              <h3 className="font-extrabold text-base text-white mt-2 mb-1 group-hover:text-amber-400 transition-colors">
                3. Kamar Magma
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Kantong raksasa batuan cair bersuhu lebih dari 1.000°C di bawah lempeng tektonik yang mengumpulkan tekanan vulkanik.
              </p>
              <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                Fokuskan Kamera 3D ➔
              </span>
            </div>

            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                focusOnMarkerById('strata');
              }}
              className="bg-slate-900/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                GEOLOGI
              </span>
              <h3 className="font-extrabold text-base text-white mt-2 mb-1 group-hover:text-amber-400 transition-colors">
                4. Lapisan Strata
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Stratovolcano terbentuk dari tumpukan berlapis-lapis lava beku purba, abu, dan tefra selama ribuan tahun letusan.
              </p>
              <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                Fokuskan Kamera 3D ➔
              </span>
            </div>

            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                focusOnMarkerById('lava');
              }}
              className="bg-slate-900/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30">
                LELERAN
              </span>
              <h3 className="font-extrabold text-base text-white mt-2 mb-1 group-hover:text-orange-400 transition-colors">
                5. Aliran Lava Pijar
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Lelehan magma pijar membara bersuhu di atas 800°C yang menuruni lereng mengikuti celah lembah alami.
              </p>
              <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1">
                Fokuskan Kamera 3D ➔
              </span>
            </div>

            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                focusOnMarkerById('hewan');
              }}
              className="bg-slate-900/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                EKOSISTEM
              </span>
              <h3 className="font-extrabold text-base text-white mt-2 mb-1 group-hover:text-emerald-400 transition-colors">
                6. Satwa Liar Lereng
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Kawanan rusa dan burung di padang rumput lereng bawah yang peka terhadap getaran seismik dan hawa panas vulkanik.
              </p>
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                Fokuskan Kamera 3D ➔
              </span>
            </div>

            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                focusOnMarkerById('gempa');
              }}
              className="bg-slate-900/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/30">
                OBSERVASI
              </span>
              <h3 className="font-extrabold text-base text-white mt-2 mb-1 group-hover:text-sky-400 transition-colors">
                7. Pos Seismograf PVMBG
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Stasiun telemetri seismometer lereng yang merekam mikroseismik getaran desakan fluida magma 24 jam nonstop.
              </p>
              <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                Fokuskan Kamera 3D ➔
              </span>
            </div>

            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                focusOnMarkerById('abu');
              }}
              className="bg-slate-900/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group"
            >
              <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                MATERIAL
              </span>
              <h3 className="font-extrabold text-base text-white mt-2 mb-1 group-hover:text-amber-400 transition-colors">
                8. Kolom Abu & Gas
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Lontaran pecahan batuan silika halus dan uap gas bertekanan tinggi yang menyembur vertikal ke lapisan atmosfer.
              </p>
              <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1">
                Fokuskan Kamera 3D ➔
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 03 — TANDA AKTIVITAS VULKANIK */}
        <section id="section-activity" className="space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-extrabold">
            <span>03</span>
            <span>•</span>
            <span>PEMATAUAN MULTI-PARAMETER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tanda-Tanda Peningkatan Aktivitas Vulkanik
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
            Sebelum erupsi terjadi, desakan magma ke atas menghasilkan berbagai gejala fisik, kimiawi, dan biologis di permukaan:
          </p>

          {/* Interactive 3D Launcher Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
                🌋
              </div>
              <div>
                <h4 className="text-sm font-black text-white">
                  Simulasi Interaktif Tanda-Tanda Sebelum Erupsi
                </h4>
                <p className="text-xs text-amber-200/80">
                  Amati 4 tahapan peningkatan status dan 6 parameter ilmiah PVMBG langsung pada model 3D!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setShowSignsPanel(true);
                  setSignsPanelMode('signs');
                  setCameraPreset('signs_overview');
                  onToast('Membuka Panduan 6 Tanda Aktivitas Vulkanik...');
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat 6 Tanda di 3D</span>
              </button>

              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setShowSignsPanel(true);
                  setSignsPanelMode('stepped');
                  onToast('Memulai Alur Simulasi Bertahap 4 Tingkatan...');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Mulai Simulasi Bertahap</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* 1. Gempa */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setShowSignsPanel(true);
                setSignsPanelMode('signs');
                setActiveHighlightPosition([-9.5, 1.2, 7.5]);
                setCameraPreset('seismograph');
                onToast('Kamera difokuskan ke: Stasiun Seismograf (Gempa Vulkanik)');
              }}
              className="bg-slate-900/60 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 space-y-2 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  📈
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold group-hover:underline">
                  Lihat di 3D ➔
                </span>
              </div>
              <h4 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                1. Gempa Tremor Seismik
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Magma yang mendesak menembus batuan padat kerak bumi menyebabkan ribuan gempa mikro (tremor harmonik) yang terekam oleh seismograf stasiun PVMBG.
              </p>
            </div>

            {/* 2. Suhu */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setShowSignsPanel(true);
                setSignsPanelMode('signs');
                setActiveHighlightPosition([0, 14.8, 0]);
                setCameraPreset('crater');
                onToast('Kamera difokuskan ke: Danau Kawah (Perubahan Suhu)');
              }}
              className="bg-slate-900/60 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 space-y-2 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center font-bold text-sm">
                  🌡️
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold group-hover:underline">
                  Lihat di 3D ➔
                </span>
              </div>
              <h4 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                2. Lonjakan Suhu Kawah
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Suhu solfatara dan danau kawah meningkat drastis. Kamera inframerah termal satelit mendeteksi radiasi panas magma yang semakin mendekati permukaan.
              </p>
            </div>

            {/* 3. Gas SO2 */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setShowSignsPanel(true);
                setSignsPanelMode('signs');
                setActiveHighlightPosition([0, 15.6, 0]);
                setCameraPreset('crater');
                onToast('Kamera difokuskan ke: Kepulan Gas Belerang (SO₂)');
              }}
              className="bg-slate-900/60 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 space-y-2 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-sky-950 text-sky-400 flex items-center justify-center font-bold text-sm">
                  💨
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold group-hover:underline">
                  Lihat di 3D ➔
                </span>
              </div>
              <h4 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                3. Emisi Gas Belerang (SO₂)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pelepasan gas belerang dioksida meningkat dari puluhan ton menjadi ribuan ton per hari, mengubah warna asap kawah menjadi kelabu pekat tebal.
              </p>
            </div>

            {/* 4. Asap & Mata Air */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setShowSignsPanel(true);
                setSignsPanelMode('signs');
                setActiveHighlightPosition([0, 18.0, 0]);
                setCameraPreset('crater');
                onToast('Kamera difokuskan ke: Kolom Asap & Uap Kawah');
              }}
              className="bg-slate-900/60 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 space-y-2 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  🌫️
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold group-hover:underline">
                  Lihat di 3D ➔
                </span>
              </div>
              <h4 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                4. Perubahan Kolom Asap/Uap
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asap solfatara berubah dari putih tipis menjadi kelabu pekat bertekanan tinggi akibat bercampurnya abu halus yang terkikis dari dinding kawah.
              </p>
            </div>

            {/* 5. Deformasi */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setShowSignsPanel(true);
                setSignsPanelMode('signs');
                setActiveHighlightPosition([-4.8, 5.2, 0]);
                setCameraPreset('flank');
                onToast('Kamera difokuskan ke: Lereng Gunung (Deformasi / Inflasi)');
              }}
              className="bg-slate-900/60 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 space-y-2 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold text-sm">
                  🏔️
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold group-hover:underline">
                  Lihat di 3D ➔
                </span>
              </div>
              <h4 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                5. Deformasi / Inflasi Gunung
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Volume magma yang menumpuk di leher kepundan membuat lereng gunung membengkak (*inflasi*), yang diukur menggunakan alat tiltmeter dan GPS presisi.
              </p>
            </div>

            {/* 6. Satwa */}
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setShowSignsPanel(true);
                setSignsPanelMode('signs');
                setActiveHighlightPosition([-8.5, 1.0, -8.5]);
                setCameraPreset('wildlife');
                onToast('Kamera difokuskan ke: Satwa Liar Lereng');
              }}
              className="bg-slate-900/60 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 space-y-2 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-rose-950 text-rose-400 flex items-center justify-center font-bold text-sm">
                  🦌
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold group-hover:underline">
                  Lihat di 3D ➔
                </span>
              </div>
              <h4 className="font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                6. Respon Perilaku Satwa Liar
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Satwa memiliki pendengaran infrasonik dan kepekaan tinggi terhadap bau gas mikro, sehingga mereka gelisah dan bermigrasi menuruni lereng menjauhi kawah.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 04 — EKOSISTEM */}
        <section id="section-ecosystem" className="space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-extrabold">
            <span>04</span>
            <span>•</span>
            <span>BIODIVERSITAS LERENG</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ekosistem dan Kehidupan di Sekitar Gunung
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
            Di balik potensi letusannya, gunung berapi adalah penyedia tanah tersubur di bumi dan rumah bagi beraneka ragam satwa liar:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span className="text-3xl mb-2 block">🌲</span>
              <h3 className="font-extrabold text-sm text-slate-200 mb-1">Hutan Hujan Lereng Tropis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lapisan tanah andosol hasil pelapukan abu vulkanik purba menyimpan air hujan dan menyuburkan tanaman kopi, sayur mayur, dan hutan pinus.
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span className="text-3xl mb-2 block">🦌</span>
              <h3 className="font-extrabold text-sm text-slate-200 mb-1">Mamalia & Kawanan Rusa</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rusa jawa dan kelinci hidup di padang rumput lereng. Dalam simulasi 3D kami, mereka merumput saat Normal, bersiaga saat Warning, dan berlari saat Erupsi.
              </p>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <span className="text-3xl mb-2 block">🦅</span>
              <h3 className="font-extrabold text-sm text-slate-200 mb-1">Burung Pemangsa & Elang</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Burung terbang melingkar memanfaatkan arus udara termal lereng. Saat terjadi erupsi gas beracun, burung segera terbang membumbung tinggi menjauhi puncak.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 05 — SIMULASI ERUPSI */}
        <section id="section-simulation" className="space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-extrabold">
            <span>05</span>
            <span>•</span>
            <span>FASE DINAMIS ERUPSI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tahapan Dinamika Letusan Vulkanik
          </h2>

          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
                <span className="text-[10px] font-mono font-bold text-emerald-400">FASE 1</span>
                <h4 className="font-extrabold text-white text-base">Kondisi Normal</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tekanan magma seimbang di kedalaman kerak bumi. Asap kawah tipis, suhu kawah stabil, seismograf tenang, dan satwa merumput bebas.
                </p>
              </div>

              <div className="border-l-2 border-amber-500 pl-4 space-y-1">
                <span className="text-[10px] font-mono font-bold text-amber-400">FASE 2</span>
                <h4 className="font-extrabold text-white text-base">Aktivitas Meningkat</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Magma mulai bergerak menekan batuan, getaran tremor kontinu terekam, kepulan asap menebal kelabu, dan hewan berhenti merumput dalam mode waspada.
                </p>
              </div>

              <div className="border-l-2 border-red-500 pl-4 space-y-1">
                <span className="text-[10px] font-mono font-bold text-red-400">FASE 3</span>
                <h4 className="font-extrabold text-white text-base">Letusan Erupsi Penuh</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kolom abu piroklastik melambung tinggi, kubah lava meleleh menuruni lembah, getaran tanah kuat, dan kawanan satwa berlari ke zona aman.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Tekan tombol di samping untuk langsung menyaksikan simulasi fase erupsi pada model 3D di atas.
              </div>
              <button
                onClick={() => {
                  onStateChange('ERUPTION');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onToast('Simulasi Erupsi Diaktifkan! Gulir ke atas untuk melihat 3D');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-extrabold text-xs shadow-md shadow-red-600/30 cursor-pointer transition-all active:scale-95"
              >
                <span>🌋 Jalankan Letusan di 3D</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 06 — KESIMPULAN & MITIGASI */}
        <section id="section-mitigation" className="space-y-4">
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-extrabold">
            <span>06</span>
            <span>•</span>
            <span>STATUS PVMBG & KESIAPSIAGAAN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Tingkat Aktivitas Resmi PVMBG & Mitigasi Bencana
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
            Di Indonesia, status keaktifan gunung api ditentukan secara resmi oleh Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG - Badan Geologi) dalam 4 level:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-400">
                <span>LEVEL I</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950">NORMAL</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aktivitas dasar visual dan seismik tidak memperlihatkan kelainan. Wisata dan pendakian aman dilakukan sesuai jalur rekomendasi.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-2xl border border-amber-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-amber-400">
                <span>LEVEL II</span>
                <span className="px-2 py-0.5 rounded bg-amber-950">WASPADA</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Terdapat kenaikan aktivitas seismik dan visual di atas normal. Masyarakat dilarang mendekati radius kawah (1,5 - 3 km).
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-2xl border border-orange-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-orange-400">
                <span>LEVEL III</span>
                <span className="px-2 py-0.5 rounded bg-orange-950">SIAGA</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Peningkatan aktivitas seismik sangat nyata. Letusan dapat terjadi. Warga di kawasan rawan bencana menyiapkan barang penting untuk evakuasi.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-2xl border border-red-500/30 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-red-400">
                <span>LEVEL IV</span>
                <span className="px-2 py-0.5 rounded bg-red-950">AWAS</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Letusan utama sedang atau segera berlangsung. Kawasan Rawan Bencana (KRB) wajib dikosongkan total sesuai radius bahaya yang ditetapkan.
              </p>
            </div>
          </div>

          {/* Academic Disclaimer Box */}
          <div className="mt-6 p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-4">
            <div className="text-2xl text-amber-400">⚠️</div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-amber-300">DISCLAIMER AKADEMIS</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Visualisasi ini dibuat murni untuk tujuan pembelajaran akademik dan pemahaman konsep sains geologi, bukan merupakan sistem pemantauan atau prediksi bencana real-time. Status gunung api nyata ditentukan secara ilmiah berdasarkan pemantauan multi-parameter instrumen terintegrasi oleh lembaga resmi pemerintah Republik Indonesia (PVMBG/ESDM).
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* FOOTER AKADEMIK */}
      <footer className="w-full border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-base">🌋</span>
            <span className="font-extrabold text-slate-300">VOLCANO 3D</span>
            <span>— Interactive Volcano Education</span>
          </div>
          <div className="text-center sm:text-right font-mono text-[11px]">
            © 2026 — Educational Project | Built with HTML5 • WebGL • Three.js
          </div>
        </div>
      </footer>

    </div>
  );
};
