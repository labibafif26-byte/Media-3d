/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MarkerItem {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  summary: string;
  description: string;
  simpleExplanation?: string;
  metrics?: { label: string; value: string }[];
}

export type VolcanoState = 'NORMAL' | 'WARNING' | 'ERUPTION' | 'WASPADA' | 'SIAGA' | 'ERUPSI';

export interface EducationalSection {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  content: string;
  scientificDetails: string[];
  fieldObservations: string[];
}

export interface ParticleSettings {
  lavaIntensity: number;     // 0.0 - 2.0
  ashSpread: number;        // 0.0 - 2.0
}

// Learning Adventure Types
export type AppView = 
  | 'loading'
  | 'login'
  | 'landing' 
  | 'home'
  | 'simulasi' 
  | 'explore_3d' 
  | 'explore'
  | 'materi' 
  | 'game_evaluasi' 
  | 'missions' 
  | 'profil_pengembang' 
  | 'profil_project' 
  | 'riwayat_kunjungan'
  | 'about' 
  | 'adventure_map' 
  | 'lab' 
  | 'achievements' 
  | 'safety';

// Legacy Compatibility Types (prevent orphan lint failure)
export type OrganismId = string;
export type TimeOfDay = 'day' | 'sunset' | 'night';
export type WeatherCondition = 'clear' | 'rain' | 'cloudy' | 'fog';
export type CameraPreset = 'default' | 'crater' | 'cutaway' | 'wildlife' | 'overview' | string;

export interface OrganismItem {
  id: string;
  name: string;
  scientificName?: string;
  role?: string;
  category: string;
  trophicLevel?: string | number;
  energyPercent?: string;
  energyKcal: number;
  food?: string;
  predator?: string;
  predators?: string[];
  prey?: string[];
  population?: number;
  summary?: string;
  description: string;
  ecologicalFunction?: string;
  funFact?: string;
  position: [number, number, number];
  scale: [number, number, number];
  color?: string;
  icon?: string;
  badgeBg?: string;
  badgeBorder?: string;
  badgeText?: string;
  unlocked?: boolean;
}

export interface FoodChainStep {
  step: number;
  level?: string;
  organism?: string;
  title: string;
  narration?: string;
  scientificExplanation?: string;
  energyTransferred: string;
  [key: string]: any;
}

export interface ExperimentScenario {
  id: string;
  title?: string;
  label: string;
  description?: string;
  scientificMechanism?: string;
  trophicCascade?: string;
  mitigationSolution?: string;
  effects: Record<string, any>;
  [key: string]: any;
}

export interface QuizQuestion {
  id?: string | number;
  question: string;
  options: string[];
  correctAnswer?: number;
  correctIndex?: number;
  explanation: string;
  trophicContext?: string;
  [key: string]: any;
}

export interface StudentUser {
  id: string;
  name: string;
  className: string;
  loginTime: string;
  lastActiveTime: string;
}

export interface VisitRecord {
  id: string;
  studentName: string;
  className: string;
  loginTimestamp: string;
  lastActiveTimestamp: string;
  quizGameScore?: number;
  completedMissionsCount: number;
  activityNotes?: string;
}

export type StudentLevel = 'PEMULA' | 'PENGAMAT' | 'AHLI';

export interface Mission {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  rewardBadgeId: string;
  actionRoute: AppView;
  targetPreset?: 'default' | 'crater' | 'cutaway' | 'wildlife';
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  earnedAt?: string;
  isEarned: boolean;
}

export interface DiscoveredObject {
  id: string;
  name: string;
  category: string;
  summary: string;
  discoveredAt: string;
  iconName: string;
}

export interface UserAdventureProgress {
  level: StudentLevel;
  exp: number;
  completedMissions: string[];
  discoveredObjects: string[];
  earnedBadges: string[];
  quizScores: { [quizId: string]: number };
  soundEnabled: boolean;
  visualEffectsEnabled: boolean;
  performanceMode: 'low' | 'medium' | 'high';
  tutorialCompleted: boolean;
  introSeen: boolean;
}
