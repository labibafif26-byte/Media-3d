/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { VolcanoState, MarkerItem, ParticleSettings, AppView, Mission, UserAdventureProgress, StudentUser, CameraPreset } from './types';
import { VOLCANO_MARKERS, INITIAL_MISSIONS, BADGE_DEFINITIONS } from './data/volcanoData';
import {
  loadUserProgress,
  saveUserProgress,
  calculateStudentLevel,
  getActiveStudent,
  setActiveStudent,
  updateCurrentVisitActivity
} from './utils/storage';
import { audioEngine } from './utils/audioEngine';

// Components
import { Navigation } from './components/Navigation';
import { LoadingPage } from './components/LoadingPage';
import { StudentLoginView } from './components/StudentLoginView';
import { LandingPage } from './components/LandingPage';
import { HomePage } from './components/HomePage';
import { LoginModal } from './components/LoginModal';
import { VisitHistoryModal } from './components/VisitHistoryModal';
import { DeveloperProfileView } from './components/DeveloperProfileView';
import { ProjectProfileView } from './components/ProjectProfileView';
import { InteractiveGameEvaluation } from './components/InteractiveGameEvaluation';
import { WelcomeExperience } from './components/WelcomeExperience';
import { AdventureMap } from './components/AdventureMap';
import { Explore3DView } from './components/Explore3DView';
import { VolcanoLab } from './components/VolcanoLab';
import { MissionQuizActivity } from './components/MissionQuizActivity';
import { AchievementsView } from './components/AchievementsView';
import { SafetyAndLocalView } from './components/SafetyAndLocalView';
import { StorytellingMaterialView } from './components/StorytellingMaterialView';
import { CharacterGuide, CharacterMood } from './components/CharacterGuide';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { DiscoveryJournalModal } from './components/DiscoveryJournalModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AboutView } from './components/AboutView';
import { Lock, Heart, Shield, Sparkles, ExternalLink, Flame } from 'lucide-react';

export default function App() {
  // 1. Student Session State
  const [student, setStudent] = useState<StudentUser | null>(getActiveStudent());
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showVisitHistoryModal, setShowVisitHistoryModal] = useState<boolean>(false);

  // 2. Navigation & App Views
  // Struktur Wajib: Loading Page -> Login Siswa -> Homepage -> Menu Pembelajaran
  const [currentView, setCurrentView] = useState<AppView>('loading');
  
  // 3. User Progress State
  const [progress, setProgress] = useState<UserAdventureProgress>(loadUserProgress());
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);

  // 4. Volcano 3D State
  const [volcanoState, setVolcanoState] = useState<VolcanoState>('NORMAL');
  const [isCutaway, setIsCutaway] = useState<boolean>(false);
  const [cutawayProgress, setCutawayProgress] = useState<number>(0);
  const [selectedMarker, setSelectedMarker] = useState<MarkerItem | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('default');
  const [particleSettings, setParticleSettings] = useState<ParticleSettings>({
    lavaIntensity: 1.0,
    ashSpread: 1.0
  });

  // 5. Modals & Guided Experience
  const [showWelcomeIntro, setShowWelcomeIntro] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showJournalModal, setShowJournalModal] = useState<boolean>(false);

  // 6. Audio & Toast
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 7. Secret click counter for hidden link on copyright
  const [secretClickCount, setSecretClickCount] = useState<number>(0);

  // 8. Character Guide Dynamic Message
  const [guideMood, setGuideMood] = useState<CharacterMood>('happy');
  const [guideMessage, setGuideMessage] = useState<string>(
    'Halo! Aku Kara. Yuk putar dan amati gunung berapi ini dari dekat!'
  );
  const [guideActionText, setGuideActionText] = useState<string | undefined>('Buka Peta Petualangan');

  // URL Hash & Shortcut listener for Hidden Link
  useEffect(() => {
    const handleUrlCheck = () => {
      if (
        window.location.hash === '#riwayat' ||
        window.location.hash === '#history' ||
        window.location.search.includes('admin=history') ||
        window.location.search.includes('view=riwayat')
      ) {
        setShowVisitHistoryModal(true);
      }
    };

    handleUrlCheck();
    window.addEventListener('hashchange', handleUrlCheck);

    // Keyboard shortcut: Ctrl + Shift + H
    const handleKeyShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShowVisitHistoryModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyShortcut);

    return () => {
      window.removeEventListener('hashchange', handleUrlCheck);
      window.removeEventListener('keydown', handleKeyShortcut);
    };
  }, []);

  // Save Progress when changed
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Strict Route Guard: Pengguna yang belum mengisi login siswa TIDAK DAPAT mengakses menu atau fitur apapun
  useEffect(() => {
    if (!student && currentView !== 'loading' && currentView !== 'login') {
      setCurrentView('login');
      showToast('🔒 Akses Terkunci: Silakan isi nama dan kelas pada form login untuk membuka fitur!');
    }
  }, [student, currentView]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  // Page Transition State for Smooth Cross-Fading (Fade-Out / Fade-In)
  const [isPageFading, setIsPageFading] = useState<boolean>(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth Cross-Fade View Switcher
  const transitionToView = (nextView: AppView) => {
    if (nextView === currentView) return;

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Phase 1: Mulai Fade-Out halus
    setIsPageFading(true);

    // Phase 2: Tukar view di tengah transisi saat konten memudar (240ms)
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentView(nextView);
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Phase 3: Trigger Fade-In halus
      setTimeout(() => {
        setIsPageFading(false);
      }, 40);
    }, 240);
  };

  // Cleanup transition timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Protected Navigation Handler with Smooth Transition
  const handleProtectedNavigate = (view: AppView) => {
    if (!student && view !== 'login' && view !== 'loading') {
      transitionToView('login');
      showToast('🔒 Akses Terkunci: Silakan isi nama dan kelas terlebih dahulu!');
      return;
    }
    transitionToView(view);
    if (view === 'simulasi' || view === 'explore_3d') {
      setGuideMessage('Gunakan tombol X-Ray di atas untuk membelah gunung dan melihat saluran magma!');
      setGuideMood('pointing');
    } else if (view === 'game_evaluasi') {
      setGuideMessage('Mainkan game tantangan mitigasi erupsi dan kumpulkan skor setinggi-tingginya!');
      setGuideMood('cheering');
    } else if (view === 'materi') {
      setGuideMessage('Pelajari 8 topik sains lengkap mengenai pembentukan dan erupsi gunung api!');
      setGuideMood('happy');
    } else if (view === 'profil_pengembang') {
      setGuideMessage('Kenali pengembang media pembelajaran ini: Labib Fidianur Afif (Teknologi Pendidikan).');
      setGuideMood('happy');
    } else if (view === 'profil_project') {
      setGuideMessage('Pelajari profil lengkap media pembelajaran Petualangan Gunung Api ini.');
      setGuideMood('happy');
    }
  };

  // Audio Toggle
  const toggleAudio = () => {
    const status = audioEngine.toggle();
    setIsAudioOn(status);
    showToast(status ? 'Efek Suara Diaktifkan (Web Audio Synthesizer)' : 'Efek Suara Dinonaktifkan');
  };

  // Handle Login Success with Smooth Fade Transition
  const handleLoginSuccess = (user: StudentUser) => {
    setStudent(user);
    setShowLoginModal(false);
    transitionToView('home');
    setGuideMessage(`Senang bertemu denganmu, ${user.name}! Yuk mulai dengan Simulasi 3D atau Materi.`);
    setGuideMood('happy');
  };

  // Handle Logout with Smooth Transition
  const handleLogout = () => {
    setActiveStudent(null);
    setStudent(null);
    transitionToView('login');
    showToast('Siswa berhasil keluar. Silakan masukkan nama untuk petualangan baru.');
  };

  // Handle Volcano State Change
  const handleStateChange = (newState: VolcanoState) => {
    setVolcanoState(newState);
    audioEngine.setState(newState);

    if (newState === 'NORMAL') {
      showToast('Kondisi Normal: Langit cerah, lereng hijau subur, satwa beraktivitas tenang.');
      setGuideMood('happy');
      setGuideMessage('Saat normal, alam sekitar gunung tampak sangat subur dan tenang!');
    } else if (newState === 'WARNING') {
      showToast('Status Waspada: Tremor naik, gas belerang menebal, satwa bersiap.');
      setGuideMood('surprised');
      setGuideMessage('Perhatikan lereng! Satwa liar mulai merasakan getaran halus dan bersiap melarikan diri!');
    } else if (newState === 'ERUPTION') {
      showToast('Status Erupsi! Lava meluap, abu membubung tinggi, energi vulkanik terlepas.');
      setGuideMood('cheering');
      setGuideMessage('Luar biasa! Energi magma yang tersimpan ribuan tahun akhirnya menyembur keluar!');
    }
  };

  // Handle Marker Discovery
  const handleDiscoverObject = (markerId: string) => {
    if (!progress.discoveredObjects.includes(markerId)) {
      const updatedDiscovered = [...progress.discoveredObjects, markerId];
      const newLevel = calculateStudentLevel(progress.completedMissions.length, updatedDiscovered.length);
      
      const newBadges = [...progress.earnedBadges];
      if (markerId === 'chamber' && !newBadges.includes('badge-xray')) {
        newBadges.push('badge-xray');
        showToast('🏆 Lencana Baru Diraih: Mata Sinar-X!');
      }

      setProgress(prev => ({
        ...prev,
        discoveredObjects: updatedDiscovered,
        level: newLevel,
        earnedBadges: newBadges,
        exp: prev.exp + 15
      }));
    }
  };

  // Complete a Mission
  const handleCompleteMission = (missionId: string) => {
    if (!progress.completedMissions.includes(missionId)) {
      const updatedMissions = [...progress.completedMissions, missionId];
      const newLevel = calculateStudentLevel(updatedMissions.length, progress.discoveredObjects.length);
      
      const currentMission = missions.find(m => m.id === missionId);
      const newBadges = [...progress.earnedBadges];
      if (currentMission?.rewardBadgeId && !newBadges.includes(currentMission.rewardBadgeId)) {
        newBadges.push(currentMission.rewardBadgeId);
      }

      setProgress(prev => ({
        ...prev,
        completedMissions: updatedMissions,
        level: newLevel,
        earnedBadges: newBadges,
        exp: prev.exp + 50
      }));

      showToast(`🎉 Selamat! Misi ${currentMission?.stepNumber || ''} berhasil diselesaikan!`);
      setGuideMood('cheering');
      setGuideMessage(`Keren sekali! Kamu sudah menyelesaikan Misi ${currentMission?.title}. Lanjutkan ke misi berikutnya ya!`);
    }
  };

  // Complete Interactive Game
  const handleCompleteGame = (score: number) => {
    handleCompleteMission('misi-5');
    if (progress.completedMissions.length >= 4) {
      handleCompleteMission('misi-6');
    }
    showToast(`🏆 Game Evaluasi Selesai dengan Skor ${score} pts! Tercatat ke Riwayat.`);
  };

  // Reset Progress
  const handleResetAll = () => {
    const emptyProgress: UserAdventureProgress = {
      level: 'PEMULA',
      exp: 10,
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
    setProgress(emptyProgress);
    saveUserProgress(emptyProgress);
    showToast('Seluruh data kemajuan belajar berhasil di-reset.');
  };

  // Secret Click on Copyright (3 clicks to open hidden history)
  const handleSecretCopyrightClick = () => {
    const nextCount = secretClickCount + 1;
    setSecretClickCount(nextCount);
    if (nextCount >= 3) {
      setShowVisitHistoryModal(true);
      setSecretClickCount(0);
      showToast('🔓 Portal Riwayat Kunjungan Pengawas Terbuka');
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
        
        {/* 1. Cinematic Welcome Experience Overlay */}
        {showWelcomeIntro && (
          <WelcomeExperience
            onFinishIntro={() => {
              setShowWelcomeIntro(false);
              setCurrentView('adventure_map');
              showToast('Selamat datang di Peta Petualangan! Pilih Misi 01 untuk memulai.');
            }}
            onSkipIntro={() => {
              setShowWelcomeIntro(false);
              setCurrentView('adventure_map');
            }}
          />
        )}

        {/* 2. Top Navigation (Hanya tampil jika bukan pada halaman loading) */}
        {currentView !== 'loading' && (
          <Navigation
            currentView={currentView}
            onNavigate={handleProtectedNavigate}
            studentLevel={progress.level}
            student={student}
            isAudioOn={isAudioOn}
            onToggleAudio={toggleAudio}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenJournal={() => {
              if (!student) {
                setCurrentView('login');
                showToast('🔒 Akses Terkunci: Silakan isi nama dan kelas terlebih dahulu!');
                return;
              }
              setShowJournalModal(true);
            }}
            onOpenLogin={() => setCurrentView('login')}
            onLogout={handleLogout}
          />
        )}

        {/* Cinematic Page Crossfade Shimmer Overlay */}
        <div 
          className={`fixed inset-0 bg-[#071311] z-20 pointer-events-none transition-opacity duration-300 ease-in-out ${
            isPageFading ? 'opacity-40' : 'opacity-0'
          }`} 
        />

        {/* 3. Main Views Router with Smooth Fade-Out / Fade-In Transition */}
        <main 
          className={`flex-1 pb-16 transition-all duration-300 ease-in-out ${
            isPageFading ? 'opacity-0 scale-[0.985] filter blur-[1.5px]' : 'opacity-100 scale-100 filter blur-0'
          }`}
        >
          
          {/* TAHAP 1: LOADING PAGE (Pemuatan Interaktif Pembuka) */}
          {currentView === 'loading' && (
            <LoadingPage
              onComplete={() => {
                transitionToView(student ? 'home' : 'login');
              }}
            />
          )}

          {/* TAHAP 2: LOGIN SISWA (Form Nama & Kelas Ramah Anak) */}
          {currentView === 'login' && (
            <StudentLoginView
              onLoginSuccess={handleLoginSuccess}
              onAdminAccess={() => {
                setShowVisitHistoryModal(true);
              }}
              onToast={showToast}
            />
          )}

          {/* TAHAP 3: HOMEPAGE (Pusat Navigasi 5 Menu Utama) */}
          {currentView === 'home' && (
            <HomePage
              student={student}
              progress={progress}
              onNavigate={handleProtectedNavigate}
              onLogout={handleLogout}
            />
          )}

          {/* TAMPILAN AWAL LANDING (Fallback jika diakses) */}
          {currentView === 'landing' && (
            <div className="animate-in fade-in duration-300">
              <LandingPage
                student={student}
                onOpenLogin={() => transitionToView('login')}
                onStartAdventure={() => {
                  if (student) {
                    transitionToView('home');
                  } else {
                    transitionToView('login');
                  }
                }}
                onExplore3D={() => {
                  transitionToView('simulasi');
                  showToast('Mode Simulasi 3D Aktif: Klik hotspot pin untuk belajar.');
                }}
                onLearnMateri={() => {
                  transitionToView('materi');
                  showToast('Halaman Materi: 8 Topik Sains Vulkanologi.');
                }}
                onSelectMarker={(m) => {
                  setSelectedMarker(m);
                  transitionToView('simulasi');
                }}
                onNavigate={handleProtectedNavigate}
                volcanoState={volcanoState}
              />
            </div>
          )}

          {/* VIEW 3: SIMULASI 3D GUNUNG BERAPI */}
          {(currentView === 'simulasi' || currentView === 'explore_3d') && (
            <Explore3DView
              volcanoState={volcanoState}
              onStateChange={handleStateChange}
              selectedMarker={selectedMarker}
              onSelectMarker={(m) => setSelectedMarker(m)}
              onCloseFocusMode={() => setSelectedMarker(null)}
              isCutaway={isCutaway}
              setIsCutaway={setIsCutaway}
              cutawayProgress={cutawayProgress}
              setCutawayProgress={setCutawayProgress}
              cameraPreset={cameraPreset}
              setCameraPreset={setCameraPreset}
              particleSettings={particleSettings}
              setParticleSettings={setParticleSettings}
              onToast={showToast}
              onDiscoverObject={handleDiscoverObject}
              isAudioOn={isAudioOn}
              onToggleAudio={toggleAudio}
              onTakeSnapshot={() => showToast('📸 Foto scene gunung api berhasil diabadikan!')}
            />
          )}

          {/* VIEW 4: EVALUASI BERUPA GAME INTERAKTIF */}
          {(currentView === 'game_evaluasi' || currentView === 'missions') && (
            <InteractiveGameEvaluation
              onCompleteGame={handleCompleteGame}
              onNavigate={(v) => setCurrentView(v)}
              onToast={showToast}
            />
          )}

          {/* VIEW 5: MATERI PEMBELAJARAN (8 TOPIK LENGKAP) */}
          {currentView === 'materi' && (
            <StorytellingMaterialView
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {/* VIEW 6: PROFIL PENGEMBANG */}
          {currentView === 'profil_pengembang' && (
            <DeveloperProfileView
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {/* VIEW 7: PROFIL PROJECT */}
          {currentView === 'profil_project' && (
            <ProjectProfileView
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {/* VIEW 8: TENTANG / ABOUT */}
          {currentView === 'about' && (
            <AboutView
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {/* VIEW 9: LAB GUNUNG API */}
          {currentView === 'lab' && (
            <VolcanoLab
              onToast={showToast}
              onSimulationComplete={() => {
                handleCompleteMission('misi-3');
              }}
            />
          )}

          {/* VIEW 10: PENCAPAIAN SISWA & LENCANA */}
          {currentView === 'achievements' && (
            <AchievementsView
              progress={progress}
              onResetProgress={handleResetAll}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {/* VIEW 11: KESELAMATAN & INFO MITIGASI BNPB */}
          {currentView === 'safety' && (
            <SafetyAndLocalView
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {/* VIEW 12: ADVENTURE MAP */}
          {currentView === 'adventure_map' && (
            <AdventureMap
              missions={missions}
              progress={progress}
              onSelectMission={(mission) => {
                if (mission.actionRoute === 'explore_3d' && mission.targetPreset) {
                  setCameraPreset(mission.targetPreset);
                  if (mission.targetPreset === 'cutaway') setIsCutaway(true);
                }
                setCurrentView(mission.actionRoute);
                handleCompleteMission(mission.id);
              }}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

        </main>

        {/* 4. Character Guide Floating Buddy (Hanya saat aktif belajar) */}
        {currentView !== 'loading' && currentView !== 'login' && (
          <CharacterGuide
            mood={guideMood}
            message={guideMessage}
            actionText={guideActionText}
            onAction={() => setCurrentView('game_evaluasi')}
          />
        )}

        {/* 5. FOOTER LENGKAP */}
        {currentView !== 'loading' && (
          <footer className="w-full bg-slate-950 border-t border-emerald-950 py-10 px-4 sm:px-6 lg:px-12 text-slate-400 text-xs">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-emerald-950">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-950 border border-emerald-500/40 shrink-0 shadow-md">
                      <img
                        src="/src/assets/images/logo_website_1792313397687.jpg"
                        alt="Logo Jelajah Gunung Berapi"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-black text-white font-mono tracking-wider">
                      JELAJAH <span className="text-emerald-400">GUNUNG BERAPI 3D</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono border border-emerald-900/60">
                      Kelas 4 SD
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 max-w-md">
                    Media pembelajaran 3D interaktif anatomi gunung berapi, simulasi aktivitas vulkanik, dan mitigasi bencana letusan untuk siswa sekolah dasar.
                  </p>
                </div>

                {/* Navigation Links: Hanya aktif jika siswa sudah login */}
                {student ? (
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                    <button
                      onClick={() => handleProtectedNavigate('home')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Beranda
                    </button>
                    <button
                      onClick={() => handleProtectedNavigate('simulasi')}
                      className="hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Simulasi 3D
                    </button>
                    <button
                      onClick={() => handleProtectedNavigate('materi')}
                      className="hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Materi
                    </button>
                    <button
                      onClick={() => handleProtectedNavigate('game_evaluasi')}
                      className="hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Evaluasi Game
                    </button>
                    <button
                      onClick={() => handleProtectedNavigate('profil_project')}
                      className="hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Profil Proyek
                    </button>
                    <button
                      onClick={() => handleProtectedNavigate('profil_pengembang')}
                      className="hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Profil Pengembang
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-amber-300/80 font-mono flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-emerald-950">
                    <span className="text-amber-400">🔒</span>
                    <span>Menu Terkunci — Harap Isi Nama &amp; Kelas pada Form Login</span>
                  </div>
                )}
              </div>

              {/* Bottom Row: Academic Attribution with Photos & ULM Logo */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-900/80">
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-1.5 shrink-0">
                    <img
                      src="/src/assets/images/logo_website_1792313397687.jpg"
                      alt="Logo Jelajah Gunung Berapi"
                      title="Logo Media: Jelajah Gunung Berapi"
                      className="w-7 h-7 rounded-full object-cover border-2 border-emerald-500/60 shadow-sm z-10"
                    />
                    <img
                      src="/src/assets/images/foto_pengembang_1792244743694.jpg"
                      alt="Labib Fidianur Afif"
                      title="Pengembang: Labib Fidianur Afif"
                      className="w-7 h-7 rounded-full object-cover border-2 border-slate-900 shadow-sm"
                    />
                    <img
                      src="/src/assets/images/foto_pengampu_1792244757677.jpg"
                      alt="Brezto Asagi Dewantara, S.Pd., M.Pd."
                      title="Dosen Pengampu: Brezto Asagi Dewantara, S.Pd., M.Pd."
                      className="w-7 h-7 rounded-full object-cover border-2 border-slate-900 shadow-sm"
                    />
                    <img
                      src="/src/assets/images/logo_ulm_1792244771690.jpg"
                      alt="Logo ULM"
                      title="Universitas Lambung Mangkurat"
                      className="w-7 h-7 rounded-full object-contain p-0.5 bg-slate-950 border-2 border-amber-500/40 shadow-sm"
                    />
                  </div>
                  <div>
                    <div>
                      <span>© Petualangan Gunung Api 3D — Pengembang: </span>
                      <strong className="text-slate-300 font-semibold">
                        Labib Fidianur Afif
                      </strong>{' '}
                      <span>(NIM: 2510130210020) • S1 Teknologi Pendidikan FKIP <strong className="text-amber-400">Universitas Lambung Mangkurat (ULM)</strong></span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Dosen Pengampu: <span className="text-slate-300 font-medium">Brezto Asagi Dewantara, S.Pd., M.Pd.</span> • Universitas Lambung Mangkurat
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleProtectedNavigate('profil_pengembang')}
                    className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                  >
                    Profil Lengkap &rarr;
                  </button>
                  <span className="text-slate-600">•</span>
                  <div className="text-[10px] text-emerald-500/70 font-mono">
                    Kurikulum Merdeka • IPAS Kelas 4 SD
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}

        {/* 6. MODALS */}
        {/* Modal 1: Login Akses Siswa (Hanya Nama & Kelas, atau Username: admin & Kelas: admin123) */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
          onAdminAccess={() => {
            setShowLoginModal(false);
            setShowVisitHistoryModal(true);
          }}
          onToast={showToast}
        />

        {/* Modal 2: Hidden Link Riwayat Kunjungan Siswa */}
        <VisitHistoryModal
          isOpen={showVisitHistoryModal}
          onClose={() => setShowVisitHistoryModal(false)}
          onToast={showToast}
        />

        {/* Modal 3: Settings Modal */}
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          progress={progress}
          onUpdateProgress={(updated) => setProgress(prev => ({ ...prev, ...updated }))}
          onResetAll={handleResetAll}
          onToast={showToast}
        />

        {/* Modal 4: Onboarding Tutorial */}
        <OnboardingModal
          isOpen={showOnboardingModal}
          onClose={() => {
            setShowOnboardingModal(false);
            setProgress(prev => ({ ...prev, tutorialCompleted: true }));
          }}
        />

        {/* Modal 5: Discovery Journal */}
        <DiscoveryJournalModal
          isOpen={showJournalModal}
          onClose={() => setShowJournalModal(false)}
          discoveredIds={progress.discoveredObjects}
          onSelectMarker={(m) => {
            setSelectedMarker(m);
            setCurrentView('simulasi');
          }}
          onNavigate={(v) => setCurrentView(v)}
        />

        {/* 7. Notification Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-3 duration-300 pointer-events-none">
            <div className="bg-slate-900/95 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-orange-500/40 flex items-center gap-2 max-w-sm backdrop-blur-md">
              <span className="text-orange-400 text-sm">✦</span>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

      </div>
    </ErrorBoundary>
  );
}
