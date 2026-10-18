/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Trash2,
  Search,
  Users,
  Calendar,
  Trophy,
  RefreshCw,
  FileSpreadsheet,
  Shield,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { getAllVisits, clearAllVisits, exportVisitsToCSV } from '../utils/storage';
import { VisitRecord } from '../types';

interface VisitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const VisitHistoryModal: React.FC<VisitHistoryModalProps> = ({
  isOpen,
  onClose,
  onToast
}) => {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const loadData = () => {
    setVisits(getAllVisits());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      setConfirmDelete(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtered visits
  const filteredVisits = visits.filter(v => {
    const matchesSearch =
      v.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'all' || v.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  // Extract unique classes
  const uniqueClasses = Array.from(new Set(visits.map(v => v.className))).filter(Boolean);

  // Statistics
  const totalVisits = visits.length;
  const uniqueStudents = new Set(visits.map(v => v.studentName.toLowerCase().trim())).size;
  const averageScore = totalVisits > 0
    ? Math.round(visits.reduce((acc, v) => acc + (v.quizGameScore || 0), 0) / totalVisits)
    : 0;

  const handleExportCSV = () => {
    const csvContent = exportVisitsToCSV();
    if (!csvContent) {
      onToast('Belum ada data kunjungan untuk diekspor.');
      return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `riwayat_kunjungan_volcano_3d_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onToast('File CSV berhasil diunduh!');
  };

  const handleClearHistory = () => {
    clearAllVisits();
    setVisits([]);
    setConfirmDelete(false);
    onToast('Seluruh riwayat kunjungan telah dibersihkan.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">Cek Riwayat Pengunjung</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Akses Khusus: admin / admin123
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Log akses dan riwayat belajar siswa Media Pembelajaran VOLCANO 3D
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-slate-900/60 border-b border-slate-800/60">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Total Kunjungan</span>
            </div>
            <div className="text-2xl font-black text-white">{totalVisits}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Siswa Terdaftar</span>
            </div>
            <div className="text-2xl font-black text-emerald-400">{uniqueStudents}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Rata-Rata Skor</span>
            </div>
            <div className="text-2xl font-black text-amber-400">{averageScore} <span className="text-xs text-slate-400 font-normal">pts</span></div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Kelas Aktif</span>
            </div>
            <div className="text-2xl font-black text-purple-400">{uniqueClasses.length}</div>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-800/60 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama siswa atau kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:border-orange-500 outline-hidden"
              />
            </div>

            {uniqueClasses.length > 0 && (
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 outline-hidden cursor-pointer"
              >
                <option value="all">Semua Kelas</option>
                {uniqueClasses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={loadData}
              title="Segarkan Data"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor CSV</span>
            </button>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Log</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-950/70 border border-red-800 p-1 rounded-xl">
                <span className="text-[11px] text-red-300 font-bold px-2">Yakin hapus?</span>
                <button
                  onClick={handleClearHistory}
                  className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500 cursor-pointer"
                >
                  Ya, Hapus
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredVisits.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 text-slate-600 opacity-60" />
              <p className="text-sm font-semibold text-slate-300">Belum ada riwayat kunjungan yang sesuai</p>
              <p className="text-xs text-slate-500 mt-1">
                Data akan otomatis tercatat saat siswa melakukan login akses di awal.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/90 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No</th>
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-4">Kelas</th>
                    <th className="py-3 px-4">Waktu Masuk</th>
                    <th className="py-3 px-4">Terakhir Aktif</th>
                    <th className="py-3 px-4 text-center">Skor Game Evaluasi</th>
                    <th className="py-3 px-4">Catatan Aktivitas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
                  {filteredVisits.map((v, index) => (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-500 font-mono">{index + 1}</td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[11px]">
                          {v.studentName.charAt(0).toUpperCase()}
                        </div>
                        <span>{v.studentName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700/60">
                          {v.className}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {v.loginTimestamp}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {v.lastActiveTimestamp}
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[11px] ${
                          (v.quizGameScore || 0) >= 80
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : (v.quizGameScore || 0) >= 60
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {v.quizGameScore || 0} pts
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 text-[11px]">
                        {v.activityNotes || 'Sesi aktif'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span className="text-[11px]">
            Portal Riwayat Pengunjung — Akses Kredensial Khusus: admin &amp; admin123
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
