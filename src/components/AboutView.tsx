/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Info,
  ShieldCheck,
  Compass,
  Cpu,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Layers,
  Heart,
  Flame,
  User,
  Building2
} from 'lucide-react';
import { AppView } from '../types';

interface AboutViewProps {
  onNavigate: (view: AppView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-in fade-in duration-300 text-slate-100">
      
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-slate-950 border border-emerald-500/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wide">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>DOKUMENTASI AKADEMIK TEKNOLOGI PENDIDIKAN</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            PETUALANGAN GUNUNG API 3D
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-2xl leading-relaxed">
            Media Pembelajaran Sains &amp; IPAS Interaktif Berbasis Grafis Tiga Dimensi (3D WebGL PBR) yang dirancang untuk memvisualisasikan anatomi gunung berapi, dinamika magma, aktivitas seismik, dan mitigasi kebencanaan Kurikulum Merdeka Kelas 4 SD.
          </p>
        </div>
      </div>

      {/* Grid: 4 Pilar Informasi Akademik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pilar 1: Identitas & Tujuan Media */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Info className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Identitas &amp; Sasaran Belajar</h2>
          <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
            <p><strong>Nama Media:</strong> Petualangan Gunung Api 3D</p>
            <p><strong>Sasaran:</strong> Siswa Kelas 4 Sekolah Dasar (Fase B IPAS)</p>
            <p><strong>Topik:</strong> Bentang Alam Bumi, Vulkanisme, Magma vs Lava, Mitigasi Bencana</p>
            <p><strong>Tujuan Utama:</strong> Membangun pemahaman spasial anatomi gunung berapi dan kesiapsiagaan mitigasi bencana secara interaktif dan menyenangkan.</p>
          </div>
        </div>

        {/* Pilar 2: Desain Pembelajaran (Instructional Design) */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Prinsip Desain Instruksional</h2>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
            <li><strong>Konstruktivisme:</strong> Siswa memutar kamera 360° dan mengeksplorasi hotspot anatomi secara mandiri.</li>
            <li><strong>X-Ray Cutaway:</strong> Melihat irisan internal kantong magma dan konduit utama tanpa abstraksi semu.</li>
            <li><strong>Dual Coding &amp; Signaling:</strong> Integrasi teks ringkas, audio realistis, dan visual 3D aktif.</li>
            <li><strong>Gamifikasi Formatif:</strong> Evaluasi game kuis 3 hati dengan pembobotan skor dan lencana pencapaian.</li>
          </ul>
        </div>

        {/* Pilar 3: Tumpukan Teknologi (Tech Stack) */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Teknologi Grafis &amp; Web</h2>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              'React 19',
              'TypeScript',
              'Three.js (WebGL PBR)',
              'Tailwind CSS',
              'Web Audio API',
              'LocalStorage DB',
              'Responsive Viewport'
            ].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-700/60"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Rendering 3D real-time dengan shader lava pijar, irisan penampang geometris, simulasi partikel abu piroklastik, serta sintesis audio gemuruh dan alarm evakuasi.
          </p>
        </div>

        {/* Pilar 4: Petunjuk Penggunaan */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-lg space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-white">Panduan Interaksi</h2>
          <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
            <p><strong>Putar &amp; Zoom:</strong> Geser sentuhan / mouse untuk rotasi 360° dan scroll untuk zoom in/out.</p>
            <p><strong>Pin Anatomi:</strong> Klik pin kawah, saluran magma, atau stasiun seismograf untuk membuka penjelasannya.</p>
            <p><strong>Tuas X-Ray:</strong> Geser slider penampang untuk membelah gunung dan melihat kantong magma.</p>
            <p><strong>Status Erupsi:</strong> Ubah level status (Normal &rarr; Erupsi) untuk menyimulasikan gejolak magma.</p>
          </div>
        </div>

      </div>

      {/* Profil Institusi & Pengembang */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 border border-amber-500/40 shrink-0 flex items-center justify-center">
              <img
                src="/src/assets/images/logo_ulm_1792244771690.jpg"
                alt="Logo Universitas Lambung Mangkurat"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                ASAL INSTITUSI
              </span>
              <h3 className="text-base font-black text-white">
                Universitas Lambung Mangkurat (ULM)
              </h3>
              <p className="text-xs text-slate-300">
                FKIP • Program Studi S1 Teknologi Pendidikan
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('profil_pengembang')}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>Lihat Profil Pengembang Lengkap</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-orange-500/30 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 p-0.5 shrink-0">
              <img
                src="/src/assets/images/foto_pengembang_1792244743694.jpg"
                alt="Foto Labib Fidianur Afif"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono font-bold text-orange-400 uppercase block">PENGEMBANG</span>
              <h4 className="text-xs font-bold text-white">Labib Fidianur Afif</h4>
              <p className="text-[10px] text-slate-400 font-mono">NIM 2510130210020</p>
              <p className="text-[10px] text-slate-400">S1 Teknologi Pendidikan FKIP ULM</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-emerald-500/30 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shrink-0">
              <img
                src="/src/assets/images/foto_pengampu_1792244757677.jpg"
                alt="Foto Brezto Asagi Dewantara, S.Pd., M.Pd."
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase block">DOSEN PENGAMPU</span>
              <h4 className="text-xs font-bold text-white">Brezto Asagi Dewantara, S.Pd., M.Pd.</h4>
              <p className="text-[10px] text-emerald-300">Dosen Pengampu Pemrograman Komputer</p>
              <p className="text-[10px] text-slate-400">FKIP Universitas Lambung Mangkurat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <span className="text-xs text-slate-400">Siap menjelajahi gunung berapi 3D?</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('materi')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Baca Materi
          </button>
          <button
            onClick={() => onNavigate('simulasi')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <span>Mulai Simulasi 3D</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
