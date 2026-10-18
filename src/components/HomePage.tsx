/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Flame,
  Layers,
  Gamepad2,
  BookOpen,
  User,
  GraduationCap,
  FolderGit2,
  Trophy,
  ArrowRight,
  Sparkles,
  LogOut,
  ShieldCheck,
  Compass,
  Play,
  Heart
} from 'lucide-react';
import { StudentUser, AppView, UserAdventureProgress } from '../types';

interface HomePageProps {
  student: StudentUser | null;
  progress: UserAdventureProgress;
  onNavigate: (view: AppView) => void;
  onLogout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  student,
  progress,
  onNavigate,
  onLogout
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#071311] text-slate-100 py-8 px-4 sm:px-6 lg:px-12 select-none">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">

        {/* 1. Welcome Student Banner (Earthy & Emerald Natural Theme) */}
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-800/40 p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>PETUALANGAN GUNUNG API • KELAS 4 SD</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Halo,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                  {student?.name || 'Petualang Cilik'}!
                </span>{' '}
                🌋
              </h1>

              <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl leading-relaxed flex items-center flex-wrap gap-2">
                <span>Selamat datang di petualangan belajar! Kelas:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  {student?.className || 'Kelas 4'}
                </span>
                <span className="text-slate-500">•</span>
                <span>Waktu Masuk: {student?.loginTime || 'Hari ini'}</span>
              </p>
            </div>

            {/* Level & Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-emerald-900/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  {progress.level === 'PEMULA' ? '🌱' : progress.level === 'PENGAMAT' ? '🔎' : '🌋'}
                </div>
                <div>
                  <div className="text-[10px] text-emerald-400 font-mono uppercase font-bold">Pangkat Petualang</div>
                  <div className="text-xs font-bold text-white">
                    {progress.level === 'PEMULA' && 'Petualang Pemula'}
                    {progress.level === 'PENGAMAT' && 'Pengamat Gunung Api'}
                    {progress.level === 'AHLI' && 'Ahli Vulkanologi 3D'}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Ganti Siswa / Keluar"
                className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Ganti Siswa</span>
              </button>
            </div>

          </div>
        </div>

        {/* 2. Visual Intro Banner Gunung Api */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900/80 to-slate-950 border border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-950 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-xl shadow-emerald-900/40">
              <img
                src="/src/assets/images/logo_website_1792313397687.jpg"
                alt="Logo Website Jelajah Gunung Berapi"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white">
                Siap Menjelajahi Rahasia Perut Bumi?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl leading-relaxed">
                Pilih menu di bawah untuk memutar simulasi 3D, membaca materi bergambar, mengikuti kuis game seru dengan 3 nyawa, atau melihat profil media pembelajaran!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('simulasi')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mulai Simulasi 3D</span>
            </button>
          </div>
        </div>

        {/* 3. LIMA MENU UTAMA (Sesuai Spesifikasi Master Prompt) */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-black text-white tracking-tight">
                5 Menu Pembelajaran Utama
              </h2>
            </div>
            <span className="text-xs text-emerald-400/80 font-mono">Pilih aktivitasmu</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* 1. SIMULASI 3D */}
            <div
              onClick={() => onNavigate('simulasi')}
              className="group p-6 rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-emerald-900/60 hover:border-emerald-500/70 transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 group-hover:bg-emerald-600/20 rounded-full blur-2xl transition-all" />
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                    MENU 01
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                  1. Simulasi 3D
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Putar gunung berapi 360°, geser tuas X-Ray untuk melihat kantong magma, atur tingkat status letusan (Normal hingga Erupsi), dan amati seismograf gempa.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 relative z-10">
                <span>Buka Simulasi 3D</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 2. MATERI */}
            <div
              onClick={() => onNavigate('materi')}
              className="group p-6 rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-teal-900/60 hover:border-teal-500/70 transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/10 group-hover:bg-teal-600/20 rounded-full blur-2xl transition-all" />

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6 text-teal-400" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300">
                    MENU 02
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-teal-400 transition-colors">
                  2. Materi Pembelajaran
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  8 modul sains lengkap: Pengertian gunung api, anatomi kawah, magma vs lava, tanda letusan, aliran awan panas, dampak kesuburan tanah, dan mitigasi BNPB.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-400 relative z-10">
                <span>Pelajari Materi Lengkap</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 3. EVALUASI GAME */}
            <div
              onClick={() => onNavigate('game_evaluasi')}
              className="group p-6 rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-amber-900/60 hover:border-amber-500/70 transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 group-hover:bg-amber-600/20 rounded-full blur-2xl transition-all" />

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Gamepad2 className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                    MENU 03
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                  3. Evaluasi Game
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tantangan kuis gamifikasi dengan 3 nyawa (hati ❤️), batas waktu ronde, skor combo, dan penjelasan sains langsung yang otomatis tercatat ke riwayat belajar.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400 relative z-10">
                <span>Mainkan Evaluasi Game</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 4. PROFIL PROYEK */}
            <div
              onClick={() => onNavigate('profil_project')}
              className="group p-6 rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-cyan-900/60 hover:border-cyan-500/70 transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 group-hover:bg-cyan-600/20 rounded-full blur-2xl transition-all" />

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <FolderGit2 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300">
                    MENU 04
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors">
                  4. Profil Proyek
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Latar belakang media pembelajaran, capaian pembelajaran IPAS kelas 4 SD, manfaat media WebGL 3D, metodologi ADDIE, dan petunjuk penggunaan.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400 relative z-10">
                <span>Lihat Profil Proyek</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* 5. PROFIL PENGEMBANG */}
            <div
              onClick={() => onNavigate('profil_pengembang')}
              className="group p-6 rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-emerald-900/60 hover:border-emerald-500/70 transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 group-hover:bg-emerald-600/20 rounded-full blur-2xl transition-all" />

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center -space-x-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-slate-950 p-0.5 border-2 border-emerald-500 shadow-md group-hover:scale-105 transition-transform overflow-hidden relative z-10" title="Labib Fidianur Afif (Pengembang)">
                      <img
                        src="/src/assets/images/foto_pengembang_1792244743694.jpg"
                        alt="Foto Labib Fidianur Afif"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-slate-950 p-0.5 border-2 border-teal-500 shadow-md group-hover:scale-105 transition-transform overflow-hidden relative z-20" title="Brezto Asagi Dewantara, S.Pd., M.Pd. (Dosen Pengampu)">
                      <img
                        src="/src/assets/images/foto_pengampu_1792244757677.jpg"
                        alt="Foto Brezto Asagi Dewantara, S.Pd., M.Pd."
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-slate-950 p-1 border border-amber-500/50 shadow-md relative z-30 flex items-center justify-center" title="Universitas Lambung Mangkurat">
                      <img
                        src="/src/assets/images/logo_ulm_1792244771690.jpg"
                        alt="Logo ULM"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                    MENU 05
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                  5. Profil Pengembang
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Labib Fidianur Afif</strong> (NIM 2510130210020), Prodi S1 Teknologi Pendidikan FKIP <strong>Universitas Lambung Mangkurat (ULM)</strong>. Dosen Pengampu: <strong>Brezto Asagi Dewantara, S.Pd., M.Pd.</strong>
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400 relative z-10">
                <span>Lihat Profil Pengembang &amp; Pengampu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* FITUR TAMBAHAN: PENCAPAIAN & LENCANA SISWA */}
            <div
              onClick={() => onNavigate('achievements')}
              className="group p-6 rounded-3xl bg-slate-900/90 hover:bg-slate-900 border border-yellow-900/60 hover:border-yellow-500/70 transition-all duration-300 cursor-pointer shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 group-hover:bg-yellow-600/20 rounded-full blur-2xl transition-all" />

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-300">
                    LENCANA
                  </span>
                </div>

                <h3 className="text-lg font-black text-white group-hover:text-yellow-400 transition-colors">
                  Pencapaian &amp; Koleksi Lencana
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lihat lencana penemu yang telah kamu buka ({progress.earnedBadges.length} Lencana) dan kumpulkan poin pengalaman untuk naik pangkat!
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-yellow-400 relative z-10">
                <span>Buka Koleksi Lencana</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>

        {/* 4. Bottom Info Status & ULM Institutional Badge */}
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-emerald-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-slate-950 p-0.5 border border-emerald-500/60 shrink-0 shadow-md flex items-center justify-center overflow-hidden" title="Logo Website: Jelajah Gunung Berapi">
                <img
                  src="/src/assets/images/logo_website_1792313397687.jpg"
                  alt="Logo Jelajah Gunung Berapi"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 border border-amber-500/50 shrink-0 shadow-md flex items-center justify-center" title="Logo Universitas Lambung Mangkurat">
                <img
                  src="/src/assets/images/logo_ulm_1792244771690.jpg"
                  alt="Logo Universitas Lambung Mangkurat"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Jelajah Gunung Berapi 3D</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">Media Pembelajaran Resmi</span>
              </div>
              <div className="text-[11px] text-emerald-200/90 font-medium">
                Universitas Lambung Mangkurat (ULM) • S1 Teknologi Pendidikan FKIP
              </div>
              <div className="text-[10px] text-slate-400">
                Pengembang: <strong>Labib Fidianur Afif</strong> (2510130210020) • Dosen Pengampu: <strong>Brezto Asagi Dewantara, S.Pd., M.Pd.</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('profil_pengembang')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer transition-colors shrink-0 shadow-sm"
          >
            <User className="w-3.5 h-3.5" />
            <span>Lihat Profil Pengembang &amp; Pengampu</span>
          </button>
        </div>

      </div>
    </div>
  );
};
