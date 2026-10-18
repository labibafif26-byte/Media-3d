/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Flame,
  Layers,
  BookOpen,
  Gamepad2,
  User,
  FolderGit2,
  Volume2,
  VolumeX,
  Settings,
  Menu,
  X,
  BookMarked,
  Trophy,
  LogIn,
  LogOut,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { AppView, StudentLevel, StudentUser } from '../types';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  studentLevel: StudentLevel;
  student: StudentUser | null;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  onOpenSettings: () => void;
  onOpenJournal: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onNavigate,
  studentLevel,
  student,
  isAudioOn,
  onToggleAudio,
  onOpenSettings,
  onOpenJournal,
  onOpenLogin,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 5 Menu Utama Sesuai Spesifikasi Master Prompt:
  // Simulasi 3D, Materi, Evaluasi Game, Profil Proyek, Profil Pengembang
  const navItems: { id: AppView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: student ? 'home' : 'login', label: 'Beranda', icon: Flame },
    { id: 'simulasi', label: 'Simulasi 3D', icon: Layers },
    { id: 'materi', label: 'Materi', icon: BookOpen },
    { id: 'game_evaluasi', label: 'Evaluasi Game', icon: Gamepad2 },
    { id: 'profil_project', label: 'Profil Proyek', icon: FolderGit2 },
    { id: 'profil_pengembang', label: 'Profil Pengembang', icon: User }
  ];

  const handleNavClick = (view: AppView) => {
    if (!student && view !== 'login') {
      onOpenLogin();
      return;
    }
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* 1. TOP NAVBAR */}
      <header className="h-16 w-full bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/40 sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between shadow-lg shadow-black/20 text-slate-200">
        
        {/* Brand Logo & Title */}
        <div
          onClick={() => handleNavClick(student ? 'home' : 'login')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-950 border border-emerald-400/50 shadow-md shadow-emerald-900/30 group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
            <img
              src="/src/assets/images/logo_website_1792313397687.jpg"
              alt="Logo Jelajah Gunung Berapi"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-white tracking-wider font-mono">
                JELAJAH <span className="text-emerald-400">GUNUNG BERAPI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                KELAS 4 SD
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Main Navigation Links (Center): Hanya aktif jika siswa sudah login */}
        {student ? (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive =
                currentView === item.id ||
                (item.id === 'simulasi' && currentView === 'explore_3d') ||
                (item.id === 'home' && currentView === 'landing');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-extrabold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/70 border border-emerald-900/50 text-xs font-medium text-emerald-300/80">
            <span className="text-amber-400">🔒</span>
            <span>Menu &amp; Fitur Terkunci — Harap Isi Nama &amp; Kelas</span>
          </div>
        )}

        {/* Right Tools & Student Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Student Status or Login Button */}
          {student ? (
            <button
              onClick={() => handleNavClick('home')}
              title={`Siswa: ${student.name} (${student.className})`}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-white cursor-pointer transition-colors"
            >
              <div className="w-5 h-5 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-bold text-white max-w-[90px] truncate">{student.name}</span>
                <span className="text-[9px] text-emerald-400 font-mono -mt-0.5">{student.className}</span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition-all cursor-pointer border border-emerald-400/40"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk (Nama &amp; Kelas)</span>
            </button>
          )}

          {/* Level Pill: Hanya aktif jika siswa sudah login */}
          {student && (
            <button
              onClick={() => handleNavClick('achievements')}
              title="Pencapaian & Lencana"
              className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              <span>{studentLevel === 'PEMULA' ? '🌱' : studentLevel === 'PENGAMAT' ? '🔎' : '🌋'}</span>
              <span className="text-[11px] hidden xl:inline">
                {studentLevel === 'PEMULA' && 'Pemula'}
                {studentLevel === 'PENGAMAT' && 'Pengamat'}
                {studentLevel === 'AHLI' && 'Ahli 3D'}
              </span>
            </button>
          )}

          {/* Jurnal Penemuan: Hanya aktif jika siswa sudah login */}
          {student && (
            <button
              onClick={onOpenJournal}
              title="Buka Jurnal Penemuan"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <BookMarked className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-xs">Jurnal</span>
            </button>
          )}

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={onToggleAudio}
            title={isAudioOn ? 'Matikan Suara Synth' : 'Nyalakan Suara Synth'}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer transition-colors"
          >
            {isAudioOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Mobile Hamburger Menu Toggle: Hanya aktif jika siswa sudah login */}
          {student && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

        </div>
      </header>

      {/* 2. MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          
          {/* Student Profile Card (if logged in) */}
          {student && (
            <div className="p-3 mb-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{student.name}</div>
                  <div className="text-[10px] text-slate-400">Kelas: {student.className}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          )}

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive =
                currentView === item.id ||
                (item.id === 'simulasi' && currentView === 'explore_3d') ||
                (item.id === 'home' && currentView === 'landing' && student);

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white font-extrabold shadow-md shadow-orange-600/30'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Buttons */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end text-xs">
            <button
              onClick={() => {
                onOpenSettings();
                setMobileMenuOpen(false);
              }}
              className="text-slate-400 hover:text-white flex items-center gap-1 py-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Pengaturan</span>
            </button>
          </div>

        </div>
      )}
    </>
  );
};
