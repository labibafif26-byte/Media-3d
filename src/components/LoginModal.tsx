/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, GraduationCap, ArrowRight, ShieldCheck, Sparkles, X } from 'lucide-react';
import { recordStudentVisit } from '../utils/storage';
import { StudentUser } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: StudentUser) => void;
  onAdminAccess: () => void;
  onToast: (msg: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onAdminAccess,
  onToast
}) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedClass = className.trim();

    if (!trimmedName) {
      setError('Silakan masukkan nama lengkap Anda.');
      return;
    }
    if (!trimmedClass) {
      setError('Silakan masukkan kelas Anda (misal: 8A, X Geografi).');
      return;
    }

    // KREDENSIAL RAHASIA PENGAWAS:
    // Username: admin & Kelas: admin123 -> otomatis masuk ke cek riwayat pengunjung
    if (trimmedName.toLowerCase() === 'admin' && trimmedClass === 'admin123') {
      setName('');
      setClassName('');
      setError(null);
      onToast('🔓 Kredensial Pengawas Valid: Membuka Riwayat Kunjungan Pengunjung');
      onAdminAccess();
      return;
    }

    const record = recordStudentVisit(trimmedName, trimmedClass);
    const studentUser: StudentUser = {
      id: record.id,
      name: record.studentName,
      className: record.className,
      loginTime: record.loginTimestamp,
      lastActiveTime: record.lastActiveTimestamp
    };

    onToast(`Selamat datang, ${studentUser.name}! Selamat belajar.`);
    onSuccess(studentUser);
    setName('');
    setClassName('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 border border-orange-400/40">
            <span className="text-2xl">🌋</span>
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Login Akses Siswa</h3>
            <p className="text-xs text-slate-400">Media Pembelajaran 3D Gunung Berapi</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
          Masukkan <strong>Nama</strong> dan <strong>Kelas</strong> Anda untuk memulai eksplorasi simulasi, materi sains, dan game evaluasi interaktif.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-orange-400" />
              <span>Nama Lengkap</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Labib Fidianur"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-white placeholder-slate-500 outline-hidden transition-all font-medium"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Kelas / Rombel</span>
            </label>
            <input
              type="text"
              required
              value={className}
              onChange={(e) => {
                setClassName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: 8A atau X Geografi"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-sm text-white placeholder-slate-500 outline-hidden transition-all font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/30 transition-all cursor-pointer border border-orange-400/40"
            >
              <span>Masuk ke Pembelajaran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Riwayat tersimpan otomatis
          </span>
          <span className="text-slate-500">Teknologi Pendidikan</span>
        </div>
      </div>
    </div>
  );
};
