/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Timer,
  Zap,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Flame,
  ArrowRight,
  Shield,
  Sparkles,
  Award,
  ChevronRight,
  Volume2
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { updateCurrentVisitActivity, getActiveStudent } from '../utils/storage';
import { AppView } from '../types';

interface InteractiveGameEvaluationProps {
  onCompleteGame: (score: number) => void;
  onNavigate: (view: AppView) => void;
  onToast: (msg: string) => void;
}

interface GameScenario {
  id: number;
  levelTitle: string;
  scenario: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  badgeHint: string;
}

const GAME_SCENARIOS: GameScenario[] = [
  {
    id: 1,
    levelTitle: 'Misi 1: Deteksi Gejala Awal',
    scenario: 'Sensor seismometer di pos pengamatan mencatat peningkatan getaran tremor menerus secara berkala dari kedalaman 5 km di bawah gunung api.',
    question: 'Apa arti fenomena peningkatan gempa tremor vulkanik tersebut?',
    options: [
      { id: 'a', text: 'Magma sedang bergerak naik dan mendesak batuan penyumbat', isCorrect: true },
      { id: 'b', text: 'Gunung berapi sedang mendingin dan memasuki fase dorman', isCorrect: false },
      { id: 'c', text: 'Terjadi erosi tanah akibat hujan lebat di puncak kawah', isCorrect: false },
      { id: 'd', text: 'Keluarnya angin kencang dari lubang gua bawah tanah', isCorrect: false }
    ],
    explanation: 'Gempa tremor vulkanik disebabkan oleh pergerakan fluida magma bertekanan tinggi yang merekah dan menekan batuan litosfer saat naik menuju permukaan.',
    badgeHint: 'Sensor Seismik'
  },
  {
    id: 2,
    levelTitle: 'Misi 2: Pengamatan Satwa Liar',
    scenario: 'Warga di lereng atas melaporkan banyak kawanan rusa, burung, dan monyet liar berbondong-bondong turun lereng menuju area pemukiman rendah.',
    question: 'Mengapa perilaku satwa liar ini menjadi indikator penting pra-erupsi?',
    options: [
      { id: 'a', text: 'Satwa hanya mencari sumber makanan baru di perkebunan warga', isCorrect: false },
      { id: 'b', text: 'Satwa mendeteksi kenaikan suhu tanah, getaran mikro, dan bau gas beracun lebih awal', isCorrect: true },
      { id: 'c', text: 'Musim kawin satwa liar tahunan yang kebetulan bersamaan', isCorrect: false },
      { id: 'd', text: 'Kondisi cuaca cerah membuat satwa lebih senang bermain di lereng bawah', isCorrect: false }
    ],
    explanation: 'Satwa memiliki kepekaan sensorik tajam terhadap kenaikan suhu lereng, gelombang infrasonik, dan gas vulkanik (seperti SO2) sehingga insting mereka memerintahkan untuk mengungsi.',
    badgeHint: 'Insting Satwa'
  },
  {
    id: 3,
    levelTitle: 'Misi 3: Penampang Dalam Bumi',
    scenario: 'Tim geologi memindai penampang gunung dan menemukan rongga raksasa tempat bertemunya batuan cair panas sebelum keluar ke pipa utama.',
    question: 'Disebut apakah struktur rongga penampung magma di kedalaman perut bumi?',
    options: [
      { id: 'a', text: 'Kawah Kepundan (Crater)', isCorrect: false },
      { id: 'b', text: 'Kantung / Dapur Magma (Magma Chamber)', isCorrect: true },
      { id: 'c', text: 'Piroklastik Sekunder', isCorrect: false },
      { id: 'd', text: 'Kubah Lava Padat', isCorrect: false }
    ],
    explanation: 'Dapur magma (magma chamber) adalah kolam batuan cair pijar bertekanan masif di bawah kerak bumi yang menjadi sumber material seluruh letusan gunung berapi.',
    badgeHint: 'Ahli Anatomi'
  },
  {
    id: 4,
    levelTitle: 'Misi 4: Gas Beracun Fumarol',
    scenario: 'Di sekitar bibir kawah muncul hembusan gas putih pekat berbau tajam seperti telur busuk yang sangat menyengat hidung.',
    question: 'Gas berbahaya apa yang terkandung dan tindakan apa yang wajib diambil?',
    options: [
      { id: 'a', text: 'Oksigen murni; aman untuk dihirup secara mendalam', isCorrect: false },
      { id: 'b', text: 'Gas belerang (SO2 & H2S); wajib segera menjauh dan memakai masker respirator basah/khusus', isCorrect: true },
      { id: 'c', text: 'Uap air tawar murni; tidak memiliki risiko kesehatan', isCorrect: false },
      { id: 'd', text: 'Gas nitrogen alami pendingin kawah', isCorrect: false }
    ],
    explanation: 'Gas belerang seperti Sulfur Dioksida (SO2) dan Hidrogen Sulfida (H2S) sangat korosif dan dapat menyebabkan iritasi saluran pernapasan hingga kematian jika terhirup dalam konsentrasi tinggi.',
    badgeHint: 'Detektor Kimia'
  },
  {
    id: 5,
    levelTitle: 'Misi 5: Tingkat Status PVMBG',
    scenario: 'PVMBG menaikkan status gunung menjadi SIAGA (Level III) setelah kubah lava membesar dan gempa vulkanik meningkat drastis.',
    question: 'Apa arahan kesiapsiagaan yang wajib dilakukan oleh masyarakat?',
    options: [
      { id: 'a', text: 'Tetap berwisata ke puncak kawah karena letusan masih lama', isCorrect: false },
      { id: 'b', text: 'Masyarakat di radius bahaya bersiap mengungsi dan kelompok rentan mulai dievakuasi', isCorrect: true },
      { id: 'c', text: 'Mengabaikan sirine karena belum ada semburan lava pijar', isCorrect: false },
      { id: 'd', text: 'Menutup seluruh sekolah tanpa mencari informasi resmi BNPB', isCorrect: false }
    ],
    explanation: 'Pada status SIAGA (Level III), ancaman letusan dapat terjadi dalam kurun waktu dekat. Masyarakat harus mengosongkan Kawasan Rawan Bencana (KRB) terdekat dan kelompok lansia/anak-anak segera dievakuasi.',
    badgeHint: 'Komandan Mitigasi'
  },
  {
    id: 6,
    levelTitle: 'Misi 6: Ancaman Awan Panas',
    scenario: 'Gunung meletus dan memuntahkan aliran campuran gas membara, pasir, dan bebatuan bersuhu 700°C yang meluncur turun lereng dengan kecepatan hingga 200 km/jam.',
    question: 'Apa nama fenomena letusan paling mematikan ini di Indonesia?',
    options: [
      { id: 'a', text: 'Lahar Dingin Musim Hujan', isCorrect: false },
      { id: 'b', text: 'Awan Panas Guguran / Piroklastik (Wedhus Gembel)', isCorrect: true },
      { id: 'c', text: 'Hujan Abu Ringan', isCorrect: false },
      { id: 'd', text: 'Patahan Sesar Tektonik', isCorrect: false }
    ],
    explanation: 'Awan panas guguran (aliran piroklastik) atau dikenal secara lokal sebagai "Wedhus Gembel" memiliki kecepatan dan suhu luar biasa tinggi sehingga wajib dihindari dengan menjauhi lembah sungai purba.',
    badgeHint: 'Penyintas Piroklastik'
  },
  {
    id: 7,
    levelTitle: 'Misi 7: Perlindungan Diri dari Abu',
    scenario: 'Hujan abu vulkanik tebal mengguyur kota di sekitar lereng hingga jarak 30 km dari pusat kawah.',
    question: 'Tindakan mitigasi pribadi mana yang paling tepat dilakukan saat hujan abu?',
    options: [
      { id: 'a', text: 'Memakai masker kain/N95, kacamata pelindung, baju lengan panjang, dan menutup tempat penampungan air', isCorrect: true },
      { id: 'b', text: 'Mengendarai motor dengan kecepatan tinggi untuk menghindari abu', isCorrect: false },
      { id: 'c', text: 'Membuka seluruh ventilasi rumah agar abu cepat keluar', isCorrect: false },
      { id: 'd', text: 'Mencuci muka menggunakan air hujan yang baru turun bercampur abu', isCorrect: false }
    ],
    explanation: 'Abu vulkanik mengandung partikel silika tajam seperti serpihan kaca kecil. Masker dan kacamata melindungi mata dan saluran pernapasan dari penyakit ISPA.',
    badgeHint: 'Proteksi Maksimal'
  },
  {
    id: 8,
    levelTitle: 'Misi 8: Bahaya Sekunder Lahar',
    scenario: 'Dua minggu setelah letusan mereda, terjadi hujan sangat lebat berdurasi lama di sekitar puncak gunung berapi.',
    question: 'Bahaya sekunder apa yang mengancam wilayah di bantaran sungai hilir?',
    options: [
      { id: 'a', text: 'Gempa bumi tektonik susulan berkekuatan 9 SR', isCorrect: false },
      { id: 'b', text: 'Banjir lahar dingin yang membawa jutaan meter kubik material pasir dan batu besar', isCorrect: true },
      { id: 'c', text: 'Kenaikan suhu udara mencapai 100°C di hilir', isCorrect: false },
      { id: 'd', text: 'Pembentukan danau kawah baru di pantai', isCorrect: false }
    ],
    explanation: 'Endapan material letusan di puncak akan terbawa oleh aliran air hujan deras menjadi banjir lumpur pekat dan batu besar (lahar dingin) yang dapat menerjang jembatan dan pemukiman.',
    badgeHint: 'Waspada Lahar'
  },
  {
    id: 9,
    levelTitle: 'Misi 9: Tas Siaga Bencana',
    scenario: 'Setiap keluarga yang tinggal di lereng gunung api dianjurkan menyiapkan satu tas khusus di dekat pintu keluar rumah.',
    question: 'Benda-benda krusial apa yang wajib ada di dalam Tas Siaga Bencana (Grab Bag)?',
    options: [
      { id: 'a', text: 'Pakaian mewah, mainan video game, dan perabot rumah', isCorrect: false },
      { id: 'b', text: 'Dokumen penting, kotak P3K, senter, peluit, air minum, makanan darurat, dan radio baterai', isCorrect: true },
      { id: 'c', text: 'Buku pelajaran tebal dan perlengkapan tidur lengkap', isCorrect: false },
      { id: 'd', text: 'Bahan bakar minyak dan kompor gas portable besar', isCorrect: false }
    ],
    explanation: 'Tas siaga bencana dirancang untuk bertahan hidup mandiri minimal 3 hari pertama saat evakuasi darurat sebelum bantuan logistik tiba.',
    badgeHint: 'Siaga 72 Jam'
  },
  {
    id: 10,
    levelTitle: 'Misi 10: Berkah Pasca Bencana',
    scenario: 'Setelah beberapa tahun proses erupsi selesai dan vegetasi mulai tumbuh kembali, tanah pertanian lereng menjadi sangat subur.',
    question: 'Mengapa abu vulkanik letusan gunung berapi bermanfaat bagi pertanian jangka panjang?',
    options: [
      { id: 'a', text: 'Abu vulkanik kaya akan unsur hara mineral penting (fosfor, kalium, magnesium) yang menyuburkan tanah', isCorrect: true },
      { id: 'b', text: 'Abu vulkanik mematikan seluruh serangga di muka bumi selamanya', isCorrect: false },
      { id: 'c', text: 'Abu vulkanik mengubah tanah menjadi lempung semen yang mengeras', isCorrect: false },
      { id: 'd', text: 'Abu vulkanik menghangatkan tanah sehingga tidak membutuhkan air', isCorrect: false }
    ],
    explanation: 'Pelapukan batuan dan abu vulkanik menghasilkan tanah andosol yang sangat subur, kaya unsur hara fosfat, kalium, dan kalsium yang menjadi tumpuan lumbung pangan Indonesia.',
    badgeHint: 'Keseimbangan Alam'
  }
];

export const InteractiveGameEvaluation: React.FC<InteractiveGameEvaluationProps> = ({
  onCompleteGame,
  onNavigate,
  onToast
}) => {
  // Game State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const activeStudent = getActiveStudent();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentScenario = GAME_SCENARIOS[currentQuestionIndex];

  // Timer Tick during gameplay
  useEffect(() => {
    if (gameState === 'playing' && !showExplanation) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, showExplanation, currentQuestionIndex]);

  // Handle Timeout
  const handleTimeOut = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOptionId('timeout');
    setShowExplanation(true);
    setStreak(0);
    const remainingLives = lives - 1;
    setLives(remainingLives);
    onToast('Waktu habis! Hati berkurang 1 ❤️');

    if (remainingLives <= 0) {
      setTimeout(() => {
        finishGame(score, false);
      }, 2500);
    }
  };

  // Start the game
  const startGame = () => {
    setCurrentQuestionIndex(0);
    setLives(3);
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setSelectedOptionId(null);
    setShowExplanation(false);
    setCorrectAnswersCount(0);
    setGameState('playing');
    onToast('Game Tantangan Dimulai! Semoga berhasil!');
  };

  // Handle Option Selection
  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (showExplanation || selectedOptionId) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOptionId(optionId);
    setShowExplanation(true);

    if (isCorrect) {
      const timeBonus = timeLeft * 5;
      const streakBonus = streak * 20;
      const pointsEarned = 100 + timeBonus + streakBonus;
      const newScore = score + pointsEarned;
      const newStreak = streak + 1;
      const newCorrectCount = correctAnswersCount + 1;

      setScore(newScore);
      setStreak(newStreak);
      setCorrectAnswersCount(newCorrectCount);
      onToast(`Tepat Sekali! +${pointsEarned} Poin (Bonus Waktu: +${timeBonus})`);
    } else {
      setStreak(0);
      const remainingLives = lives - 1;
      setLives(remainingLives);
      onToast('Jawaban kurang tepat! Hati berkurang 1 ❤️');

      if (remainingLives <= 0) {
        setTimeout(() => {
          finishGame(score, false);
        }, 2500);
        return;
      }
    }
  };

  // Next question or finish
  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < GAME_SCENARIOS.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      finishGame(score, true);
    }
  };

  // Finish game
  const finishGame = (finalScore: number, isWin: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Save score to visit history and user profile
    if (activeStudent) {
      updateCurrentVisitActivity(activeStudent.id, {
        quizGameScore: finalScore,
        activityNotes: isWin
          ? `Menyelesaikan Game Evaluasi dengan skor ${finalScore} pts`
          : `Mencoba Game Evaluasi (Skor ${finalScore} pts)`
      });
    }

    onCompleteGame(finalScore);
    setGameState(isWin ? 'victory' : 'gameover');
  };

  // Calculate Stars
  const calculateStars = (finalScore: number) => {
    if (finalScore >= 1200) return 3;
    if (finalScore >= 700) return 2;
    return 1;
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-[#080d1a] text-slate-100 py-8 px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-6">

        {/* 1. INTRO SCREEN */}
        {gameState === 'intro' && (
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 text-center shadow-2xl overflow-hidden">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide mb-6">
              <span>🎮</span>
              <span>GAME EVALUASI EDUKATIF INTERAKTIF</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              VulkanoQuest: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400">
                Tantangan Tanggap Bencana
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Uji pemahamanmu tentang struktur gunung berapi, membaca gelombang tremor, deteksi gas beracun, dan prosedur penyelamatan diri erupsi melalui 10 misi simulasi gamifikasi!
            </p>

            {/* Game Rules Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 text-left">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1">
                  <Heart className="w-4 h-4 fill-rose-500" />
                  <span>3 Nyawa (Hati)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Salah menjawab atau waktu habis mengurangi 1 hati. Pertahankan nyawamu hingga misi akhir!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
                  <Timer className="w-4 h-4" />
                  <span>30 Detik / Ronde</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Semakin cepat kamu menjawab dengan tepat, semakin besar bonus kecepatan yang didapatkan!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Streak Combo Poin</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Raih rentetan jawaban benar berturut-turut untuk melipatgandakan skor dan membuka bintang 3!
                </p>
              </div>
            </div>

            {/* Student Info Pill */}
            {activeStudent && (
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <span>Pemain Aktif:</span>
                <strong className="text-white">{activeStudent.name}</strong>
                <span className="text-slate-500">•</span>
                <span className="text-orange-400">{activeStudent.className}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={startGame}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all cursor-pointer border border-orange-400/40"
              >
                <span>Mulai Tantangan Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer border border-slate-700/60"
              >
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. PLAYING SCREEN */}
        {gameState === 'playing' && (
          <div className="space-y-4">
            
            {/* Top Game HUD Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md flex items-center justify-between shadow-lg">
              {/* Left: Level & Progress */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm border border-orange-500/30">
                  {currentQuestionIndex + 1}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{currentScenario.levelTitle}</div>
                  <div className="text-[10px] text-slate-400">Soal {currentQuestionIndex + 1} dari {GAME_SCENARIOS.length}</div>
                </div>
              </div>

              {/* Center: Lives */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800">
                {[1, 2, 3].map(heartIdx => (
                  <Heart
                    key={heartIdx}
                    className={`w-4 h-4 ${
                      heartIdx <= lives
                        ? 'text-rose-500 fill-rose-500 animate-pulse'
                        : 'text-slate-700 fill-transparent'
                    }`}
                  />
                ))}
              </div>

              {/* Right: Score & Streak */}
              <div className="flex items-center gap-3">
                {streak > 1 && (
                  <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/40">
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>Streak {streak}x!</span>
                  </div>
                )}
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Skor</div>
                  <div className="text-sm font-black text-amber-400 font-mono">{score} pts</div>
                </div>
              </div>
            </div>

            {/* Timer Bar */}
            <div className="relative w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft > 15
                    ? 'bg-emerald-500'
                    : timeLeft > 7
                    ? 'bg-amber-500'
                    : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>

            {/* Question & Scenario Box */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              
              {/* Scenario Narrative */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 mb-6 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400 shrink-0">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider block mb-1">
                    Skenario Situasi di Lapangan:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {currentScenario.scenario}
                  </p>
                </div>
              </div>

              {/* Main Question */}
              <h2 className="text-base sm:text-lg font-bold text-white mb-6">
                {currentScenario.question}
              </h2>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3">
                {currentScenario.options.map((opt) => {
                  let btnStyle = 'bg-slate-950/80 hover:bg-slate-800 border-slate-800 text-slate-200';

                  if (showExplanation) {
                    if (opt.isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20';
                    } else if (selectedOptionId === opt.id) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                    } else {
                      btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs uppercase shrink-0">
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {showExplanation && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {showExplanation && selectedOptionId === opt.id && !opt.isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {showExplanation && (
                <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Penjelasan Ilmiah:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {currentScenario.explanation}
                  </p>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-600/30 transition-all cursor-pointer"
                    >
                      <span>
                        {currentQuestionIndex + 1 < GAME_SCENARIOS.length ? 'Lanjut ke Misi Berikutnya' : 'Lihat Hasil Akhir'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* 3. GAME OVER SCREEN */}
        {gameState === 'gameover' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 text-center shadow-2xl space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Misi Terhenti! Nyawa Habis</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
                Tantangan mitigasi membutuhkan kecermatan tinggi. Jangan putus asa, pelajari kembali materi dan coba sekali lagi!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-sm mx-auto">
              <div className="text-xs text-slate-400 font-mono">Skor Akhir yang Tercatat:</div>
              <div className="text-3xl font-black text-amber-400 font-mono mt-1">{score} pts</div>
              <div className="text-xs text-emerald-400 mt-1">
                Menjawab Benar: {correctAnswersCount} dari {GAME_SCENARIOS.length} soal
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={startGame}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Coba Mainkan Lagi</span>
              </button>

              <button
                onClick={() => onNavigate('materi')}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700/60 cursor-pointer transition-colors"
              >
                <span>Pelajari Materi Dulu</span>
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 text-xs cursor-pointer transition-colors"
              >
                <span>Ke Beranda</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. VICTORY SCREEN */}
        {gameState === 'victory' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 text-center shadow-2xl space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30 shadow-xl shadow-amber-500/20">
              <Trophy className="w-10 h-10 text-amber-400" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
                <span>🏆</span>
                <span>MISI SELESAI DENGAN GEMILANG</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">Selamat, Komandan Tanggap Bencana!</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto">
                Kamu berhasil melewati seluruh tantangan simulasi vulkanologi dan mitigasi erupsi gunung berapi!
              </p>
            </div>

            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3].map(starIdx => (
                <span
                  key={starIdx}
                  className={`text-3xl ${
                    starIdx <= calculateStars(score) ? 'text-amber-400 filter drop-shadow' : 'text-slate-700'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Score & Student Summary */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span>Pemain:</span>
                <span className="font-bold text-white">{activeStudent?.name || 'Siswa'} ({activeStudent?.className || '-'})</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span>Jawaban Tepat:</span>
                <span className="font-bold text-emerald-400">{correctAnswersCount} / {GAME_SCENARIOS.length} Misi</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Skor Total:</span>
                <span className="text-2xl font-black text-amber-400 font-mono">{score} pts</span>
              </div>
            </div>

            <p className="text-xs text-emerald-400 font-semibold">
              ✓ Nilai kamu telah otomatis tercatat ke dalam log riwayat kunjungan!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={startGame}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Mainkan Lagi</span>
              </button>

              <button
                onClick={() => onNavigate('home')}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700/60 cursor-pointer transition-colors"
              >
                <span>Kembali ke Beranda</span>
              </button>

              <button
                onClick={() => onNavigate('simulasi')}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer transition-colors"
              >
                <span>Lihat Simulasi 3D</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
