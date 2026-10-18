/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  Code2,
  Sparkles,
  ArrowLeft,
  Flame,
  CheckCircle2,
  ExternalLink,
  Layers,
  Heart,
  Building2,
  Mail,
  MapPin,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { AppView } from '../types';

interface DeveloperProfileViewProps {
  onNavigate: (view: AppView) => void;
}

export const DeveloperProfileView: React.FC<DeveloperProfileViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#080d1a] text-slate-100 pt-6 sm:pt-8 pb-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('profil_project')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <span>Lihat Profil Proyek</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1. INSTITUTION AFFILIATION BANNER: UNIVERSITAS LAMBUNG MANGKURAT */}
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-emerald-950/40 border border-amber-500/30 p-5 sm:p-7 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 text-center sm:text-left">
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-950/90 p-1.5 border border-amber-500/40 shadow-xl shadow-amber-950/30 overflow-hidden flex items-center justify-center">
                <img
                  src="/src/assets/images/logo_ulm_1792244771690.jpg"
                  alt="Lambang Resmi Universitas Lambung Mangkurat"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                <Building2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold tracking-wider uppercase">
                <span>INSTITUSI PENDIDIKAN TINGGI ASAL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                UNIVERSITAS LAMBUNG MANGKURAT (ULM)
              </h2>
              <div className="text-xs sm:text-sm text-amber-200/90 font-medium">
                Fakultas Keguruan dan Ilmu Pendidikan (FKIP) • Program Studi S1 Teknologi Pendidikan
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Banjarmasin, Kalimantan Selatan, Indonesia</span>
                </span>
                <span>•</span>
                <span className="font-serif italic text-amber-300/80">&ldquo;Waja Sampai Kaputing&rdquo;</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. DUAL PROFILE CARDS: PENGEMBANG & DOSEN PENGAMPU */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CARD 1: PENGEMBANG MEDIA (LABIB FIDIANUR AFIF) */}
          <div className="relative rounded-3xl bg-slate-900/90 border border-orange-500/40 p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col justify-between space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold font-mono">
                  <User className="w-3.5 h-3.5" />
                  <span>PENGEMBANG MEDIA</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Mahasiswa S1
                </span>
              </div>

              {/* Foto & Identitas Pokok */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="relative shrink-0">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 p-1 shadow-xl shadow-orange-600/20">
                    <img
                      src="/src/assets/images/foto_pengembang_1792244743694.jpg"
                      alt="Foto Labib Fidianur Afif - Pengembang Media Pembelajaran"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top rounded-[14px]"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-orange-500 text-white shadow-md border-2 border-slate-950">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Labib Fidianur Afif
                  </h3>
                  <div className="text-xs font-mono font-bold text-orange-400 flex items-center justify-center sm:justify-start gap-1">
                    <span>NIM:</span>
                    <span className="text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">2510130210020</span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    S1 Teknologi Pendidikan • FKIP
                  </div>
                  <div className="text-xs text-amber-300 font-semibold flex items-center justify-center sm:justify-start gap-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Universitas Lambung Mangkurat</span>
                  </div>
                  <div className="pt-1 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="font-mono text-[11px]">labibafif26@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Rincian Peran & Kontribusi */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Peran &amp; Tanggung Jawab Teknis:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Konseptor utama, programmer arsitektur 3D WebGL (Three.js), perancang desain instruksional kurikulum IPAS, serta pengembang antarmuka responsif ramah anak berbasis React dan Tailwind CSS.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-orange-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Karya Mahasiswa ULM</span>
              </span>
              <span className="font-mono text-slate-500">Angkatan 2025</span>
            </div>
          </div>

          {/* CARD 2: DOSEN PENGAMPU (BREZTO ASAGI DEWANTARA, S.Pd., M.Pd.) */}
          <div className="relative rounded-3xl bg-slate-900/90 border border-emerald-500/40 p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col justify-between space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                  <Award className="w-3.5 h-3.5" />
                  <span>DOSEN PENGAMPU &amp; PEMBIMBING</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Dosen Pembimbing
                </span>
              </div>

              {/* Foto & Identitas Pokok */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="relative shrink-0">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-1 shadow-xl shadow-emerald-600/20">
                    <img
                      src="/src/assets/images/foto_pengampu_1792244757677.jpg"
                      alt="Foto Brezto Asagi Dewantara, S.Pd., M.Pd. - Dosen Pengampu"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top rounded-[14px]"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-emerald-500 text-white shadow-md border-2 border-slate-950">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Brezto Asagi Dewantara, S.Pd., M.Pd.
                  </h3>
                  <div className="text-xs text-emerald-400 font-semibold">
                    Dosen Pembimbing &amp; Pengampu Mata Kuliah
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    Pemrograman Komputer
                  </div>
                  <div className="text-xs text-amber-300 font-semibold flex items-center justify-center sm:justify-start gap-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Universitas Lambung Mangkurat</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono pt-1">
                    Fakultas Keguruan dan Ilmu Pendidikan
                  </div>
                </div>
              </div>

              {/* Rincian Peran & Pembimbingan */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Peran Akademik &amp; Supervisi:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Memberikan supervisi akademik, pembimbingan teknis logika pemrograman komputer, arsitektur kode komputasi media interaktif 3D WebGL, serta validasi kelayakan produk pembelajaran digital.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Supervisi Akademik Terverifikasi</span>
              </span>
              <span className="font-mono text-slate-500">FKIP ULM</span>
            </div>
          </div>

        </div>

        {/* 3. KARTU FOKUS & KOMPETENSI PENGEMBANG */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Desain Instruksional</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Penerapan prinsip-prinsip <em>Cognitive Theory of Multimedia Learning (Mayer)</em> untuk mencegah beban kognitif berlebih melalui segmenting, signaling, dan visual contiguity.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Struktur materi berjenjang (8 modul)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Evaluasi interaktif berbasis gamifikasi</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Simulasi 3D &amp; Realisme WebGL</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eksplorasi grafis 3D real-time menggunakan Three.js dan WebGL yang dapat diputar secara bebas (orbit camera), memotong penampang magma (cutaway), serta menyimulasikan dinamika letusan.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Material PBR batuan andesit &amp; lava pijar</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Partikel abu piroklastik &amp; asap dinamis</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Teknologi Web Modern</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arsitektur aplikasi berbasis React 19, TypeScript, dan Tailwind CSS dengan dukungan Web Audio API Synthesizer serta pelacak riwayat kunjungan pengguna untuk evaluasi guru.
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Akses instan di browser tanpa install</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Portal rekap kunjungan &amp; ekspor CSV</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 4. VISI & PESAN PENGEMBANG */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Heart className="w-7 h-7 text-amber-400" />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Visi Pengembangan Media:</h4>
            <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
              &ldquo;Teknologi Pendidikan bukan sekadar tentang menggunakan perangkat canggih di ruang kelas, melainkan tentang bagaimana merekayasa pengalaman belajar yang memberdayakan imajinasi, mempermudah pemahaman konsep rumit, dan membekali siswa dengan kecakapan mitigasi nyata.&rdquo;
            </p>
            <p className="text-xs font-semibold text-orange-400 pt-1">
              — Labib Fidianur Afif (NIM 2510130210020) • Universitas Lambung Mangkurat
            </p>
          </div>
        </div>

        {/* 5. TOMBOL AKSI NAVIGASI */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <span>Kembali ke Beranda Siswa</span>
          </button>
          <button
            onClick={() => onNavigate('simulasi')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Eksplorasi Simulasi 3D</span>
          </button>
        </div>

      </div>
    </div>
  );
};
