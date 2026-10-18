/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserAdventureProgress, AppView, StudentLevel } from '../types';

const STORAGE_KEY = 'petualangan_gunung_api_progress_v2';

export const DEFAULT_PROGRESS: UserAdventureProgress = {
  level: 'PEMULA',
  exp: 20,
  completedMissions: [],
  discoveredObjects: ['kawah'],
  earnedBadges: ['badge-pemula'],
  quizScores: {},
  soundEnabled: true,
  visualEffectsEnabled: true,
  performanceMode: 'high',
  tutorialCompleted: false,
  introSeen: false
};

export const loadUserProgress = (): UserAdventureProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
};

export const saveUserProgress = (progress: UserAdventureProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress', e);
  }
};

export const calculateStudentLevel = (completedMissionsCount: number, discoveredCount: number): StudentLevel => {
  const totalScore = completedMissionsCount * 2 + discoveredCount;
  if (totalScore >= 10) return 'AHLI';
  if (totalScore >= 4) return 'PENGAMAT';
  return 'PEMULA';
};

// --- Student Session & Visit Records Tracking ---
const ACTIVE_STUDENT_KEY = 'volcano_3d_active_student_v1';
const VISIT_HISTORY_KEY = 'volcano_3d_visit_history_v1';

export const getActiveStudent = (): { id: string; name: string; className: string; loginTime: string; lastActiveTime: string } | null => {
  try {
    const raw = localStorage.getItem(ACTIVE_STUDENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setActiveStudent = (user: { id: string; name: string; className: string; loginTime: string; lastActiveTime: string } | null): void => {
  try {
    if (!user) {
      localStorage.removeItem(ACTIVE_STUDENT_KEY);
    } else {
      localStorage.setItem(ACTIVE_STUDENT_KEY, JSON.stringify(user));
    }
  } catch (e) {
    console.error('Failed to set active student', e);
  }
};

export const getAllVisits = (): Array<{
  id: string;
  studentName: string;
  className: string;
  loginTimestamp: string;
  lastActiveTimestamp: string;
  quizGameScore?: number;
  completedMissionsCount: number;
  activityNotes?: string;
}> => {
  try {
    const raw = localStorage.getItem(VISIT_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const recordStudentVisit = (name: string, className: string): {
  id: string;
  studentName: string;
  className: string;
  loginTimestamp: string;
  lastActiveTimestamp: string;
  quizGameScore?: number;
  completedMissionsCount: number;
  activityNotes?: string;
} => {
  const visits = getAllVisits();
  const now = new Date();
  const formattedTime = now.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const newRecord = {
    id: `visit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    studentName: name.trim(),
    className: className.trim(),
    loginTimestamp: formattedTime,
    lastActiveTimestamp: formattedTime,
    quizGameScore: 0,
    completedMissionsCount: 0,
    activityNotes: 'Masuk ke simulasi'
  };

  // Simpan record baru di paling atas
  const updated = [newRecord, ...visits];
  try {
    localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to record visit', e);
  }

  // Set active student
  setActiveStudent({
    id: newRecord.id,
    name: newRecord.studentName,
    className: newRecord.className,
    loginTime: formattedTime,
    lastActiveTime: formattedTime
  });

  return newRecord;
};

export const updateCurrentVisitActivity = (recordId: string, updates: { quizGameScore?: number; activityNotes?: string; completedMissionsCount?: number }): void => {
  try {
    const visits = getAllVisits();
    const formattedNow = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const updated = visits.map(v => {
      if (v.id === recordId) {
        return {
          ...v,
          ...updates,
          lastActiveTimestamp: formattedNow
        };
      }
      return v;
    });

    localStorage.setItem(VISIT_HISTORY_KEY, JSON.stringify(updated));

    // Update active student session too
    const current = getActiveStudent();
    if (current && current.id === recordId) {
      setActiveStudent({
        ...current,
        lastActiveTime: formattedNow
      });
    }
  } catch (e) {
    console.error('Failed to update visit activity', e);
  }
};

export const clearAllVisits = (): void => {
  try {
    localStorage.removeItem(VISIT_HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear visits', e);
  }
};

export const exportVisitsToCSV = (): string => {
  const visits = getAllVisits();
  if (visits.length === 0) return '';

  const headers = ['No', 'Nama Siswa', 'Kelas', 'Waktu Masuk', 'Terakhir Aktif', 'Skor Game Evaluasi', 'Catatan Aktivitas'];
  const rows = visits.map((v, index) => [
    index + 1,
    `"${v.studentName.replace(/"/g, '""')}"`,
    `"${v.className.replace(/"/g, '""')}"`,
    `"${v.loginTimestamp}"`,
    `"${v.lastActiveTimestamp}"`,
    v.quizGameScore ?? 0,
    `"${(v.activityNotes || '').replace(/"/g, '""')}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
};
