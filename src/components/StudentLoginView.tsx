/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, GraduationCap, ArrowRight, Sparkles, ShieldCheck, Heart, Compass } from 'lucide-react';
import { recordStudentVisit } from '../utils/storage';
import { StudentUser } from '../types';

interface StudentLoginViewProps {
  onLoginSuccess: (user: StudentUser) => void;
  onAdminAccess: () => void;
  onToast: (msg: string) => void;
}

export const StudentLoginView: React.FC<StudentLoginViewProps> = ({
  onLoginSuccess,
  onAdminAccess,
  onToast
}) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('Kelas 4A');
  const [customClass, setCustomClass] = useState('');
  const [isCustomClass, setIsCustomClass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const defaultClasses = ['Kelas 4A', 'Kelas 4B', 'Kelas 4C', 'Kelas 4D'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    const trimmedName = name.trim();
    const finalClass = (isCustomClass ? customClass : className).trim();

    if (!trimmedName) {
      setError('Yuk tulis namamu terlebih dahulu ya!');
      return;
    }
    if (!finalClass) {
      setError('Pilih atau masukkan kelasmu ya!');
      return;
    }

    // Kredensial Khusus Pengawas:
    // Username: admin & Kelas: admin123 -> otomatis masuk ke cek riwayat pengunjung
    if (trimmedName.toLowerCase() === 'admin' && finalClass === 'admin123') {
      setName('');
      setError(null);
      onToast('🔓 Akses Pengawas Terverifikasi: Membuka Riwayat Kunjungan...');
      onAdminAccess();
      return;
    }

    const record = recordStudentVisit(trimmedName, finalClass);
    const studentUser: StudentUser = {
      id: record.id,
      name: record.studentName,
      className: record.className,
      loginTime: record.loginTimestamp,
      lastActiveTime: record.lastActiveTimestamp
    };

    setIsLoggingIn(true);
    onToast(`Halo, ${studentUser.name}! Membuka petualangan gunung berapi... 🌋`);
    setTimeout(() => {
      onLoginSuccess(studentUser);
    }, 220);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 sm:p-8 bg-[#071311] text-slate-100 relative overflow-hidden select-none">
      
      {/* Background Natural Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className={`relative z-10 w-full max-w-lg bg-slate-900/90 border border-emerald-800/40 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out ${
        isLoggingIn ? 'opacity-30 scale-[0.98]' : 'opacity-100 scale-100'
      }`}>
        
        {/* Top Header Badge & Illustration */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 p-1 shadow-xl shadow-emerald-900/30 overflow-hidden">
            <img
              src="/src/assets/images/logo_website_1792313397687.jpg"
              alt="Logo Jelajah Gunung Berapi"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-[22px]"
            />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>MASUK PETUALANG CILIK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Jelajah Gunung Berapi 3D
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/80 max-w-sm">
              Tuliskan namamu dan pilih kelasmu untuk mulai menjelajah!
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Kolom Nama Siswa */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Nama Lengkap / Panggilan</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Budi Santoso / Siti"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-emerald-900/70 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 text-sm text-white placeholder-slate-500 outline-hidden transition-all font-medium"
              autoFocus
            />
          </div>

          {/* Pilihan Kelas */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pilihan Kelas (Kelas 4 SD)</span>
            </label>

            {/* Quick Class Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {defaultClasses.map(cls => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => {
                    setClassName(cls);
                    setIsCustomClass(false);
                    if (error) setError(null);
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    !isCustomClass && className === cls
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-700/20'
                      : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-emerald-700'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {/* Opsi Kelas Lainnya */}
            <div className="pt-1">
              {!isCustomClass ? (
                <button
                  type="button"
                  onClick={() => setIsCustomClass(true)}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
                >
                  + Tulis kelas lain (misal: 4 Unggulan / admin123)
                </button>
              ) : (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={customClass}
                    onChange={(e) => setCustomClass(e.target.value)}
                    placeholder="Ketik nama kelasmu..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-900/70 text-xs text-white placeholder-slate-500 outline-hidden focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomClass(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    &larr; Gunakan pilihan kelas 4A-4D
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-900/30 transition-all cursor-pointer border border-emerald-400/40 ${
                isLoggingIn ? 'opacity-85 scale-[0.99] cursor-wait' : ''
              }`}
            >
              {isLoggingIn ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Membuka Petualangan...</span>
                </>
              ) : (
                <>
                  <span>Mulai Petualangan 🌋</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* Footer Card: Attribution to ULM, Pengembang & Pengampu */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-950 p-0.5 border border-amber-500/40 shrink-0 shadow-sm flex items-center justify-center">
              <img
                src="/src/assets/images/logo_ulm_1792244771690.jpg"
                alt="Logo ULM"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded"
              />
            </div>
            <div className="text-left text-[10px] leading-tight">
              <span className="text-slate-300 font-bold block">Universitas Lambung Mangkurat (ULM)</span>
              <span className="text-slate-400">FKIP S1 Teknologi Pendidikan • Angkatan 2025</span>
            </div>
          </div>
          <span className="text-slate-500 font-mono text-[10px]">Kurikulum Merdeka IPAS</span>
        </div>

      </div>

    </div>
  );
};
