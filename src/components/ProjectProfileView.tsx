/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Flame,
  Layers,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  Cpu,
  Target,
  Compass,
  ArrowLeft,
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { AppView } from '../types';

interface ProjectProfileViewProps {
  onNavigate: (view: AppView) => void;
}

export const ProjectProfileView: React.FC<ProjectProfileViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#080d1a] text-slate-100 py-10 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>

          <button
            onClick={() => onNavigate('profil_pengembang')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-orange-400" />
            <span>Profil Pengembang (Labib Fidianur Afif)</span>
          </button>
        </div>

        {/* Hero Section Profil Project */}
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -right-10 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide">
              <span>🌋</span>
              <span>PROFIL PROYEK MEDIA PEMBELAJARAN</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              VOLCANO <span className="text-orange-500">3D</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed">
              Media Pembelajaran Interaktif Simulasi Anatomi, Dinamika Magma, dan Mitigasi Kebencanaan Gunung Berapi Berbasis Web 3D (WebGL PBR).
            </p>

            {/* Quick Meta Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Sasaran Siswa</div>
                <div className="text-xs font-bold text-white mt-1">SMP / SMA / Sederajat</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Mata Pelajaran</div>
                <div className="text-xs font-bold text-orange-400 mt-1">IPA & Geografi Litosfer</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Teknologi Grafis</div>
                <div className="text-xs font-bold text-amber-400 mt-1">Three.js PBR WebGL</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Akses Platform</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">Web Browser Cross-Platform</div>
              </div>
            </div>
          </div>
        </div>

        {/* Latar Belakang & Urgensi */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-orange-400">
            <Compass className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white tracking-tight">1. Latar Belakang & Urgensi Proyek</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Indonesia merupakan negara kepulauan yang terletak tepat di pertemuan tiga lempeng tektonik utama dunia dan berada pada jalur <em>Ring of Fire</em> (Cincin Api Pasifik) dengan lebih dari 127 gunung api aktif. Kondisi geografis ini menjadikan edukasi vulkanologi dan mitigasi bencana sebagai kecakapan hidup (life skill) yang esensial bagi generasi muda Indonesia.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Namun, dalam pembelajaran konvensional di sekolah, materi gunung berapi kerap kali hanya disajikan melalui gambar 2D statis atau teks buku ajar yang sulit memberikan pemahaman ruang (spatial awareness) mengenai apa yang terjadi di kedalaman perut bumi (seperti kantong magma, tekanan pipa kepundan, dan perambatan gelombang gempa tremor). Media <strong>VOLCANO 3D</strong> hadir untuk menjembatani kesenjangan tersebut melalui simulasi 3D real-time yang interaktif dan berbasis gamifikasi.
          </p>
        </div>

        {/* Capaian Pembelajaran & Tujuan Instruksional */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400">
            <Target className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white tracking-tight">2. Capaian Pembelajaran & Tujuan Instruksional</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">Tujuan Kognitif</span>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Mengidentifikasi anatomi internal gunung berapi (kamar magma, pipa utama/conduit, kawah, dan lapisan piroklastik).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Menganalisis perbedaan karakteristik magma bawah tanah dan lava di permukaan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Memahami 4 tingkatan status aktivitas gunung berapi resmi dari PVMBG (Normal, Waspada, Siaga, Erupsi/Awas).</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Tujuan Afektif & Mitigasi</span>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Membaca tanda-tanda alam prabencana, seperti peningkatan suhu sumber air dan migrasi kawanan satwa liar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Menerapkan prosedur mitigasi dan penyelamatan diri (jalur evakuasi, masker pelindung debu, tas siaga bencana).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Menumbuhkan kesadaran ekologis terhadap peran abu vulkanik bagi kesuburan tanah pasca letusan.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fitur Utama Media Pembelajaran */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white tracking-tight">3. Fitur Unggulan Media Pembelajaran</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                3D
              </div>
              <h4 className="text-sm font-bold text-white">Visualisasi 3D Real-Time</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Render PBR stratovolcano dengan kontrol kamera 360°, pencahayaan dinamis, kawah lava pijar, dan simulasi partikel abu.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                X-Ray
              </div>
              <h4 className="text-sm font-bold text-white">Irisan Penampang Magma</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mode cutaway dinamis (0–100%) menyingkap lapisan litosfer, kantong magma, dan jalur konduit internal gunung secara transparan.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                WAVE
              </div>
              <h4 className="text-sm font-bold text-white">Simulasi Seismograf</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grafik getaran seismik gempa tremor real-time yang intensitas gelombangnya merespons status vulkanik aktif.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                GAME
              </div>
              <h4 className="text-sm font-bold text-white">Evaluasi Game Interaktif</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gamified assessment dengan 3 nyawa, combo streak, skor waktu, feedback ilmiah instan, dan reward lencana.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                LOG
              </div>
              <h4 className="text-sm font-bold text-white">Hidden Link Riwayat Kunjungan</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Portal tersembunyi bagi guru/pengembang untuk memantau data nama, kelas, waktu aktif siswa, serta ekspor CSV Excel.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                AUDIO
              </div>
              <h4 className="text-sm font-bold text-white">Web Audio Synthesizer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Efek suara procedural synthesizer untuk gemuruh vulkanik, desis fumarol, dan dentuman erupsi tanpa file audio eksternal berat.
              </p>
            </div>
          </div>
        </div>

        {/* Tim Pengembang, Pengampu & Institusi: Universitas Lambung Mangkurat */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header Institusi & Logo Media */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-slate-950 p-0.5 border border-emerald-500/50 shrink-0 shadow-lg flex items-center justify-center overflow-hidden" title="Logo Website Jelajah Gunung Berapi">
                  <img
                    src="/src/assets/images/logo_website_1792313397687.jpg"
                    alt="Logo Jelajah Gunung Berapi"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-950 p-1 border border-amber-500/40 shrink-0 shadow-lg flex items-center justify-center" title="Logo Universitas Lambung Mangkurat">
                  <img
                    src="/src/assets/images/logo_ulm_1792244771690.jpg"
                    alt="Logo Universitas Lambung Mangkurat"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  ASAL INSTITUSI PENDIDIKAN TINGGI
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  UNIVERSITAS LAMBUNG MANGKURAT (ULM)
                </h3>
                <p className="text-xs text-slate-300">
                  Fakultas Keguruan dan Ilmu Pendidikan (FKIP) • S1 Teknologi Pendidikan
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('profil_pengembang')}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer flex items-center gap-2 shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>Buka Profil Detail</span>
            </button>
          </div>

          {/* Grid Dual Profile: Pengembang & Dosen Pengampu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Kartu Pengembang */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-orange-500/30 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 p-0.5 shrink-0 shadow-md">
                <img
                  src="/src/assets/images/foto_pengembang_1792244743694.jpg"
                  alt="Foto Labib Fidianur Afif"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider block">
                  PENGEMBANG MEDIA
                </span>
                <h4 className="text-sm font-bold text-white leading-tight">
                  Labib Fidianur Afif
                </h4>
                <div className="text-[11px] font-mono text-slate-400">
                  NIM: 2510130210020
                </div>
                <div className="text-[11px] text-slate-400">
                  S1 Teknologi Pendidikan FKIP ULM
                </div>
              </div>
            </div>

            {/* Kartu Dosen Pengampu */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/30 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shrink-0 shadow-md">
                <img
                  src="/src/assets/images/foto_pengampu_1792244757677.jpg"
                  alt="Foto Brezto Asagi Dewantara, S.Pd., M.Pd."
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  DOSEN PENGAMPU &amp; PEMBIMBING
                </span>
                <h4 className="text-sm font-bold text-white leading-tight">
                  Brezto Asagi Dewantara, S.Pd., M.Pd.
                </h4>
                <div className="text-[11px] text-emerald-300">
                  Dosen Pengampu Mata Kuliah Pemrograman Komputer
                </div>
                <div className="text-[11px] text-slate-400">
                  FKIP Universitas Lambung Mangkurat
                </div>
              </div>
            </div>

          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span className="text-amber-300 font-serif italic">
              &ldquo;Waja Sampai Kaputing&rdquo; — Semangat Pengabdian dan Pendidikan ULM
            </span>
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
            >
              Kembali ke Beranda &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
