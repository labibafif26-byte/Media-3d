/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  VOLCANIC_SIGNS,
  STEPPED_SIMULATION_STAGES,
  OFFICIAL_VOLCANO_DISCLAIMER,
  VolcanicSignCard,
  SimulationStageInfo
} from '../data/volcanoSignsData';
import { VolcanoState } from '../types';
import { audioEngine } from '../utils/audioEngine';
import {
  Activity,
  Wind,
  Flame,
  Thermometer,
  Mountain,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Square,
  ChevronRight,
  ChevronLeft,
  X,
  AlertTriangle,
  Info,
  Sparkles,
  Layers,
  Eye,
  CheckCircle2,
  Maximize2,
  Radio,
  Volume2
} from 'lucide-react';

interface SignsOfEruptionPanelProps {
  volcanoState: VolcanoState;
  onStateChange: (state: VolcanoState) => void;
  onSelectCameraPreset: (preset: 'default' | 'crater' | 'cutaway' | 'wildlife' | string) => void;
  onHighlightPosition: (pos: [number, number, number] | null) => void;
  onFocusMarker?: (markerId: string) => void;
  onToast: (msg: string) => void;
  isOpen: boolean;
  onClose: () => void;
  activeMode: 'signs' | 'stepped';
  onChangeMode: (mode: 'signs' | 'stepped') => void;
}

export const SignsOfEruptionPanel: React.FC<SignsOfEruptionPanelProps> = ({
  volcanoState,
  onStateChange,
  onSelectCameraPreset,
  onHighlightPosition,
  onFocusMarker,
  onToast,
  isOpen,
  onClose,
  activeMode,
  onChangeMode
}) => {
  // 1. Signs Explorer State
  const [selectedSignId, setSelectedSignId] = useState<string>('gempa_vulkanik');

  // 2. Stepped Simulation State
  // Step 1: Normal, 2: Waspada, 3: Siaga, 4: Erupsi
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [stepSecondsLeft, setStepSecondsLeft] = useState<number>(6);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync currentStep with volcanoState
  useEffect(() => {
    if (volcanoState === 'NORMAL') {
      setCurrentStep(1);
    } else if (volcanoState === 'WASPADA' || volcanoState === 'WARNING') {
      setCurrentStep(2);
    } else if (volcanoState === 'SIAGA') {
      setCurrentStep(3);
    } else if (volcanoState === 'ERUPTION' || volcanoState === 'ERUPSI') {
      setCurrentStep(4);
    }
  }, [volcanoState]);

  // Current stage object
  const currentStage = STEPPED_SIMULATION_STAGES[currentStep - 1] || STEPPED_SIMULATION_STAGES[0];
  const selectedSign = VOLCANIC_SIGNS.find(s => s.id === selectedSignId) || VOLCANIC_SIGNS[0];

  // Auto-advance Timer Effect
  useEffect(() => {
    if (!isAutoPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setStepSecondsLeft(currentStage.durationSeconds);

    timerRef.current = setInterval(() => {
      setStepSecondsLeft(prev => {
        if (prev <= 1) {
          // Advance to next stage or finish
          if (currentStep < 4) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            const nextStageObj = STEPPED_SIMULATION_STAGES[nextStep - 1];
            onStateChange(nextStageObj.state);
            audioEngine.setState(nextStageObj.state);
            onToast(`Beralih otomatis ke: ${nextStageObj.statusBadge}`);
            return nextStageObj.durationSeconds;
          } else {
            // Eruption reached - pause auto advance
            setIsAutoPlaying(false);
            onToast('Tahap 4 Erupsi telah tercapai.');
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, currentStep, currentStage]);

  // Direct Stage Change Handler
  const goToStage = (stepNum: number) => {
    const targetStage = STEPPED_SIMULATION_STAGES[stepNum - 1];
    if (!targetStage) return;
    setCurrentStep(stepNum);
    setStepSecondsLeft(targetStage.durationSeconds);
    onStateChange(targetStage.state);
    audioEngine.setState(targetStage.state);
    onToast(`Simulasi: ${targetStage.statusBadge}`);
  };

  // Sign Selection Handler with Camera Focus & Coordinate Highlight
  const handleSelectSign = (sign: VolcanicSignCard) => {
    setSelectedSignId(sign.id);
    onHighlightPosition(sign.highlightCoordinates);
    onSelectCameraPreset(sign.targetCameraPreset);
    if (sign.targetMarkerId && onFocusMarker) {
      onFocusMarker(sign.targetMarkerId);
    }
    onToast(`Mempelajari: ${sign.title} (${sign.scientificTerm})`);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-2 sm:inset-x-4 bottom-2 sm:bottom-4 z-40 max-h-[82vh] bg-slate-950/95 backdrop-blur-xl border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in slide-in-from-bottom-5 duration-300">
      
      {/* 1. HEADER & MODE SWITCHER */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-b border-slate-800">
        
        {/* Title & Icon */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-400">
                PANDUAN VULKANOLOGI EDUKATIF
              </span>
              <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                4 Tahap & 6 Parameter
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white">
              Tanda-Tanda Gunung Berapi Sebelum Erupsi
            </h3>
          </div>
        </div>

        {/* Tab Switcher: 6 Tanda vs Simulasi Bertahap */}
        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                onChangeMode('signs');
                onToast('Mode: 6 Parameter Tanda-Tanda Aktivitas Gunung Api');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'signs'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>6 Tanda Aktivitas</span>
            </button>

            <button
              onClick={() => {
                onChangeMode('stepped');
                onToast('Mode: Simulasi Bertahap (Normal → Meningkat → Tinggi → Erupsi)');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'stepped'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulasi Bertahap</span>
            </button>
          </div>

          {/* Close Panel Button */}
          <button
            onClick={() => {
              onHighlightPosition(null);
              onClose();
            }}
            title="Tutup Panel"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 2. BODY CONTENT: MODE TANDA-TANDA (SIGNS) ATAU SIMULASI BERTAHAP (STEPPED) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        
        {/* ========================================================
            MODE A: PANEL "TANDA-TANDA AKTIVITAS" (6 KARTU INTERAKTIF)
            ======================================================== */}
        {activeMode === 'signs' && (
          <div className="space-y-4">
            
            {/* Grid 6 Kartu Interaktif */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {VOLCANIC_SIGNS.map(sign => {
                const isSelected = sign.id === selectedSignId;
                return (
                  <button
                    key={sign.id}
                    onClick={() => handleSelectSign(sign)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 shadow-lg ring-2 ring-amber-400/40 text-white'
                        : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl">{sign.icon}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-black group-hover:text-amber-400 transition-colors line-clamp-1">
                        {sign.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                        {sign.shortDesc}
                      </p>
                    </div>
                    <div className="text-[9px] font-mono text-amber-400/80 font-bold flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <span>{isSelected ? '● Aktif' : 'Pilih'}</span>
                      <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* DETAIL KARTU TERPILIH */}
            {selectedSign && (
              <div className="bg-slate-900/90 rounded-2xl border border-amber-500/30 p-4 sm:p-5 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedSign.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                          {selectedSign.scientificTerm}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-slate-800 text-slate-300 border border-slate-700">
                          Alat: {selectedSign.instrument}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {selectedSign.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onHighlightPosition(selectedSign.highlightCoordinates);
                        onSelectCameraPreset(selectedSign.targetCameraPreset);
                        onToast(`🎯 Kamera dipusatkan ke: ${selectedSign.title}`);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Pusatkan Kamera 3D</span>
                    </button>
                    {selectedSign.targetMarkerId && onFocusMarker && (
                      <button
                        onClick={() => {
                          onFocusMarker(selectedSign.targetMarkerId!);
                          onClose();
                          onToast(`Membuka Kartu Hotspot: ${selectedSign.title}`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <span>Lihat Hotspot Pin ➔</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Deskripsi & Mekanisme Sains */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <h5 className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Penjelasan Sains & Mengapa Ini Terjadi:
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                      {selectedSign.fullExplanation}
                    </p>
                    <div className="text-[11px] text-amber-200/90 bg-amber-950/30 p-2.5 rounded-xl border border-amber-800/40 flex items-start gap-2">
                      <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Metode Pengamatan:</strong> {selectedSign.observationMethod}
                      </span>
                    </div>
                  </div>

                  {/* Indikator Kunci */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-mono font-bold text-slate-400 uppercase">
                      Tanda Utama yang Diamati Ahli:
                    </h5>
                    <div className="space-y-1.5">
                      {selectedSign.keyIndicators.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================
            MODE B: SIMULASI BERTAHAP 4 TAHAP
            (NORMAL -> MENINGKAT -> TINGGI -> ERUPSI)
            ======================================================== */}
        {activeMode === 'stepped' && (
          <div className="space-y-4">
            
            {/* 1. PROGRESS INDICATOR 4 TAHAP */}
            <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="font-bold flex items-center gap-1.5 text-white">
                  <Activity className="w-4 h-4 text-amber-400" />
                  ALUR PROGRESS TAHAPAN:
                </span>
                <span className="text-amber-400 font-bold">
                  Tahap {currentStep} dari 4 ({currentStage.title})
                </span>
              </div>

              {/* Progress Steps Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STEPPED_SIMULATION_STAGES.map(stage => {
                  const isActive = stage.step === currentStep;
                  const isPassed = stage.step < currentStep;
                  return (
                    <button
                      key={stage.step}
                      onClick={() => goToStage(stage.step)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                        isActive
                          ? `${stage.bgLight} ${stage.borderColor} ring-2 ring-amber-400/50 shadow-lg`
                          : isPassed
                          ? 'bg-slate-900/60 border-slate-700 text-slate-400'
                          : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono font-black mb-1">
                        <span>TAHAP {stage.step}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                      </div>
                      <div className={`text-xs font-black ${isActive ? stage.statusColor : 'text-slate-300'}`}>
                        {stage.title}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate mt-0.5">
                        {stage.step === 1 && 'Relatif Tenang'}
                        {stage.step === 2 && 'Tremor & Asap'}
                        {stage.step === 3 && 'Kawah Membara'}
                        {stage.step === 4 && 'Lontaran Piroklastik'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step Timeline Track Bar */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 via-orange-500 to-red-500 transition-all duration-500"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* 2. PANEL INFORMASI TAHAP AKTIF */}
            <div className={`rounded-2xl p-4 sm:p-5 border ${currentStage.bgLight} ${currentStage.borderColor} shadow-xl space-y-4`}>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono font-black border bg-slate-950/70 text-amber-300 border-amber-500/30">
                    <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>{currentStage.statusText}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Tahap {currentStage.step}: {currentStage.title}
                  </h3>
                </div>

                {/* Auto Play Countdown Badge */}
                {isAutoPlaying && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>Lanjut dalam {stepSecondsLeft}s</span>
                  </div>
                )}
              </div>

              {/* Penjelasan Singkat Resmi Sesuai Prompt */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
                "{currentStage.shortExplanation}"
              </div>

              {/* Rincian Visual yang Sedang Berlangsung */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                  Perubahan Visual & Interaksi Pada Simulasi:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentStage.visualChanges.map((change, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60 text-slate-200">
                      <span className="text-amber-400 font-bold shrink-0">•</span>
                      <span className="leading-snug">{change}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Catatan / Peringatan Khusus Tahap */}
              {currentStage.warningNote && (
                <div className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2.5 rounded-xl border border-amber-800/50 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{currentStage.warningNote}</span>
                </div>
              )}

              {/* 3. KONTROL INTERAKTIF TAHAPAN */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
                
                {/* Navigasi Prev / Next */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentStep <= 1}
                    onClick={() => goToStage(currentStep - 1)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Kembali</span>
                  </button>

                  <button
                    disabled={currentStep >= 4}
                    onClick={() => goToStage(currentStep + 1)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-black text-slate-950 flex items-center gap-1 cursor-pointer shadow-md transition-colors"
                  >
                    <span>Lanjut Tahap {currentStep < 4 ? currentStep + 1 : ''}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Tombol Khusus Sesuai Spesifikasi Prompt:
                    Mulai Erupsi, Jeda, Hentikan, Ulangi Simulasi */}
                <div className="flex items-center flex-wrap gap-2">
                  
                  {/* Mulai Erupsi Langsung */}
                  <button
                    onClick={() => {
                      goToStage(4);
                      onToast('🌋 Erupsi Utama Dimulai! Kolom piroklastik meluap.');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 border ${
                      currentStep === 4
                        ? 'bg-red-600 text-white border-red-400 shadow-red-500/40 animate-pulse'
                        : 'bg-red-950/80 hover:bg-red-900 text-red-200 border-red-700'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span>Mulai Erupsi</span>
                  </button>

                  {/* Jeda / Lanjutkan Auto Play */}
                  <button
                    onClick={() => {
                      setIsAutoPlaying(!isAutoPlaying);
                      onToast(isAutoPlaying ? 'Simulasi bertahap dijeda.' : 'Simulasi bertahap dilanjutkan.');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition-colors ${
                      isAutoPlaying
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isAutoPlaying ? 'Jeda' : 'Otomatis'}</span>
                  </button>

                  {/* Hentikan */}
                  <button
                    onClick={() => {
                      setIsAutoPlaying(false);
                      onToast('Simulasi otomatis dihentikan.');
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer border border-slate-700"
                  >
                    <Square className="w-3 h-3 text-slate-400" />
                    <span>Hentikan</span>
                  </button>

                  {/* Ulangi Simulasi (Reset ke Tahap 1) */}
                  <button
                    onClick={() => {
                      setIsAutoPlaying(false);
                      goToStage(1);
                      onToast('Simulasi diulang ke Tahap 1: Kondisi Normal.');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ulangi Simulasi</span>
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            3. CATATAN PERINGATAN EDUKASI (WAJIB SESUAI SECTION 7 PROMPT)
            ======================================================== */}
        <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-amber-900/40 flex items-start gap-3 text-slate-300 text-[11px] leading-relaxed">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
            <Info className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-0.5">
            <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
              <span>Catatan Peringatan Edukasi Vulkanologi</span>
            </div>
            <p className="text-slate-400">
              {OFFICIAL_VOLCANO_DISCLAIMER}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
