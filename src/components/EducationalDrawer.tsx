/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { EDUCATIONAL_SIGNS, PVMBG_STATUS_LEVELS, VOLCANO_MARKERS } from '../data/volcanoData';
import {
  BookOpen,
  Layers,
  ShieldAlert,
  Code,
  FolderTree,
  Terminal,
  X,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  FileCode2,
  Sparkles,
  HelpCircle,
  Award
} from 'lucide-react';

interface EducationalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signs' | 'levels' | 'anatomy' | 'quiz' | 'guide';
}

export const EducationalDrawer: React.FC<EducationalDrawerProps> = ({
  isOpen,
  onClose,
  defaultTab = 'signs'
}) => {
  const [activeTab, setActiveTab] = useState<'signs' | 'levels' | 'anatomy' | 'quiz' | 'guide'>(defaultTab);

  // Kuis Interaktif Sederhana (seperti pada gambar referensi)
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border-l border-slate-200 h-full flex flex-col shadow-2xl overflow-hidden text-slate-800">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-amber-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Modul Belajar Gunung Api
              </h2>
              <p className="text-xs text-slate-600">Media Pembelajaran Digital Interaktif 3D</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('signs')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'signs'
                ? 'border-amber-500 text-amber-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            7 Tanda Aktivitas
          </button>
          <button
            onClick={() => setActiveTab('levels')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'levels'
                ? 'border-amber-500 text-amber-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Status PVMBG
          </button>
          <button
            onClick={() => setActiveTab('anatomy')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'anatomy'
                ? 'border-amber-500 text-amber-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Anatomi & Proses
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'border-amber-500 text-amber-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Kuis Siswa
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'border-amber-500 text-amber-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Struktur Proyek
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: 7 TANDA AKTIVITAS */}
          {activeTab === 'signs' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <h3 className="text-sm font-bold text-amber-900 mb-1">
                  Bagaimana Kita Mengetahui Gunung Api Akan Meletus?
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Sebelum erupsi terjadi, magma bergerak naik dari kedalaman bumi menuju ke kawah. Kenaikan magma memicu berbagai tanda fisis, kimiawi, dan biologi di sekitar lereng.
                </p>
              </div>

              <div className="grid gap-3">
                {EDUCATIONAL_SIGNS.map(sign => (
                  <div key={sign.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        {sign.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                        {sign.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sign.content}
                    </p>
                    {sign.fieldObservations && sign.fieldObservations.length > 0 && (
                      <div className="text-[11px] p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700">
                        <strong>Tanda Lapangan Nyata:</strong> {sign.fieldObservations[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: STATUS PVMBG */}
          {activeTab === 'levels' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                <h3 className="text-sm font-bold text-sky-900 mb-1">
                  Tingkat Aktivitas Gunung Api Resmi Indonesia (PVMBG)
                </h3>
                <p className="text-xs text-sky-800 leading-relaxed">
                  Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG) membagi tingkat aktivitas vulkanik ke dalam 4 tingkatan standar nasional.
                </p>
              </div>

              <div className="space-y-3">
                {PVMBG_STATUS_LEVELS.map(lvl => (
                  <div key={lvl.level} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-white border border-slate-300">
                          {lvl.level}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lvl.criteria}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ANATOMI & PROSES ERUPSI */}
          {activeTab === 'anatomy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h3 className="text-sm font-bold text-emerald-900 mb-1">
                  Tahapan Proses Terjadinya Erupsi Gunung Api
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  1. Magma terbentuk di dalam mantel bumi dan naik ke dapur magma.<br />
                  2. Tekanan gas vulkanik mendesak magma naik ke pipa saluran utama (vent).<br />
                  3. Ketika tutup kawah retak, lelehan lava, kepulan abu, dan material piroklastik menyembur keluar.<br />
                  4. Endapan lava membeku membentuk dan mempertinggi kerucut gunung api.
                </p>
              </div>

              <div className="grid gap-3">
                {VOLCANO_MARKERS.map(m => (
                  <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">{m.category}</span>
                    </div>
                    <p className="text-xs text-slate-600">{m.description}</p>
                    {m.metrics && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {m.metrics.map((met, i) => (
                          <span key={i} className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
                            {met.label}: <strong>{met.value}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: KUIS SISWA INTERAKTIF */}
          {activeTab === 'quiz' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                  <HelpCircle className="w-5 h-5 text-amber-600" />
                  Kuis / Tantangan Pemahaman Siswa
                </div>
                <p className="text-xs text-amber-800">
                  Uji pemahamanmu setelah mengamati simulasi 3D gunung berapi!
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="text-xs font-extrabold text-slate-900">
                  Pertanyaan: Bagian gunung api manakah yang menjadi tempat keluarnya lelehan lava, abu, dan gas ke permukaan bumi?
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'A', text: 'A. Lereng Gunung' },
                    { id: 'B', text: 'B. Kawah (Crater)' },
                    { id: 'C', text: 'C. Kaki Gunung' },
                    { id: 'D', text: 'D. Dapur Magma Bawah Tanah' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setQuizAnswer(opt.id)}
                      className={`w-full p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                        quizAnswer === opt.id
                          ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {quizAnswer === opt.id && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsQuizSubmitted(true)}
                  disabled={!quizAnswer}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 transition-all cursor-pointer shadow-sm"
                >
                  Periksa Jawaban
                </button>

                {isQuizSubmitted && (
                  <div className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in ${
                    quizAnswer === 'B' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-300 text-red-900'
                  }`}>
                    {quizAnswer === 'B' ? (
                      <div className="space-y-1">
                        <div className="font-extrabold flex items-center gap-1.5 text-emerald-800">
                          <Award className="w-4 h-4 text-emerald-600" />
                          Hebat! Jawabanmu Benar (100 / 100)
                        </div>
                        <p>Kawah (crater) adalah mulut cekungan terbuka di puncak gunung api tempat keluarnya lelehan lava pijar, uap gas fumarol, dan kepulan abu vulkanik.</p>
                      </div>
                    ) : (
                      <div>
                        <strong>Belum tepat.</strong> Jawaban yang benar adalah <strong>B. Kawah (Crater)</strong>. Dapur magma berada di bawah tanah, sedangkan kawah adalah bukaan ventilasi di puncak permukaan.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: STRUKTUR PROYEK KULIAH/SEKOLAH */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-600">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 mb-1">
                  Struktur Proyek WebGL / Three.js
                </h3>
                <p className="text-[11px] text-slate-600">
                  Aplikasi ini dirancang modular sesuai standar Three.js & WebGL yang mudah diintegrasikan ke format index.html tunggal untuk pengumpulan tugas sekolah/kuliah.
                </p>
              </div>

              <div className="p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-xl overflow-x-auto border border-slate-800">
                <pre>{`project/
├── index.html          # Viewport canvas 3D & UI overlay
├── style.css           # Styling responsif & animasi
├── main.js             # Three.js scene, lighting, controls
├── volcano.js          # Procedural volcano, lava & ash particles
├── animals.js          # Animal AI (fleeing & hiding behavior)
└── models/
    └── gunung-api.glb  # Model 3D gunung opsional`}</pre>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
