/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { AppView } from '../types';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Apa sebutan untuk batuan cair pijar yang masih berada di dalam perut bumi?',
    options: ['Magma', 'Lava', 'Lahar', 'Basalt'],
    correctAnswerIndex: 0,
    explanation: 'Magma adalah batuan cair pijar bersuhu 700°C–1.300°C yang masih tertampung di dalam kerak bumi.'
  },
  {
    id: 2,
    question: 'Bagian gunung berapi yang berfungsi sebagai wadah reservoir penampungan magma di kedalaman bumi adalah...',
    options: ['Pipa kepundan', 'Dapur magma (Magma chamber)', 'Kawah puncak', 'Kepundan samping'],
    correctAnswerIndex: 1,
    explanation: 'Dapur magma adalah ruang besar di bawah tanah tempat magma berkumpul sebelum terdorong naik ke permukaan.'
  },
  {
    id: 3,
    question: 'Apa perbedaan mendasar antara magma dan lava?',
    options: [
      'Magma bersuhu dingin sedangkan lava panas',
      'Lava adalah magma yang telah mencapai permukaan bumi dan kehilangan sebagian gas terlarutnya',
      'Magma berwujud padat sedangkan lava cair',
      'Lava selalu tersimpan di bawah lempeng samudera'
    ],
    correctAnswerIndex: 1,
    explanation: 'Ketika magma menerobos ke permukaan bumi melalui kawah, gas volatilnya memuai dan cairan tersebut disebut lava.'
  },
  {
    id: 4,
    question: 'Salah satu tanda awal peningkatan aktivitas gunung api yang dapat diamati dari perilaku satwa liar adalah...',
    options: [
      'Hewan berkembang biak lebih cepat',
      'Satwa liar berbondong-bondong turun lereng menjauhi kawah',
      'Kawanan burung bersarang di bibir kawah',
      'Hewan tidur lebih lama dari biasanya'
    ],
    correctAnswerIndex: 1,
    explanation: 'Satwa liar mendeteksi getaran gempa tremor frekuensi rendah dan gas belerang, sehingga instingtif turun lereng.'
  },
  {
    id: 5,
    question: 'Instrumen ilmiah yang digunakan oleh vulkanolog PVMBG untuk mencatat getaran gempa bumi vulkanik adalah...',
    options: ['Anemometer', 'Barometer', 'Seismograf', 'Termometer air raksa'],
    correctAnswerIndex: 2,
    explanation: 'Seismograf mencatat gelombang getaran mekanis bumi akibat dorongan magma meretakkan batuan penutup.'
  },
  {
    id: 6,
    question: 'Campuran gas panas, abu vulkanik, dan bebatuan yang meluncur deras menuruni lereng dengan kecepatan tinggi disebut...',
    options: ['Awan panas (Aliran piroklastik)', 'Lahar hujan', 'Geiser air panas', 'Solfatara'],
    correctAnswerIndex: 0,
    explanation: 'Awan panas piroklastik bersuhu hingga 600°C dan dapat meluncur menuruni lembah dengan kecepatan lebih dari 100 km/jam.'
  },
  {
    id: 7,
    question: 'Pada sistem peringatan dini PVMBG di Indonesia, status tingkat tertinggi yang mewajibkan evakuasi penduduk adalah...',
    options: ['Level I (Normal)', 'Level II (Waspada)', 'Level III (Siaga)', 'Level IV (Awas)'],
    correctAnswerIndex: 3,
    explanation: 'Level IV (Awas) menandakan erupsi utama sedang atau akan segera terjadi sehingga zona bahaya wajib dikosongkan.'
  },
  {
    id: 8,
    question: 'Mengapa kawasan di sekitar lereng gunung berapi umumnya sangat subur untuk pertanian?',
    options: [
      'Karena sering terbakar oleh lava',
      'Abu vulkanik kaya unsur hara mineral seperti kalium, fosfor, dan kalsium yang menyuburkan tanah',
      'Karena tidak pernah mendapatkan sinar matahari',
      'Karena airnya mengandung kadar asam belerang tinggi'
    ],
    correctAnswerIndex: 1,
    explanation: 'Pelapukan batuan dan abu vulkanik membentuk tanah andosol yang sangat subur bagi tanaman perkebunan dan pertanian.'
  },
  {
    id: 9,
    question: 'Apa yang dimaksud dengan lahar hujan (lahar dingin)?',
    options: [
      'Air hujan yang membeku di kawah puncak',
      'Banjir lumpur yang membawa endapan abu dan batu vulkanik di lembah sungai saat terjadi curah hujan lebat',
      'Hujan es yang turun saat letusan',
      'Asap belerang yang mencair menjadi hujan'
    ],
    correctAnswerIndex: 1,
    explanation: 'Lahar hujan adalah bahaya sekunder berupa aliran air deras yang menyapu endapan pasir dan batu vulkanik di hulu sungai.'
  },
  {
    id: 10,
    question: 'Tindakan mitigasi yang paling tepat dilakukan oleh warga jika terjadi hujan abu vulkanik pekat adalah...',
    options: [
      'Menonton letusan di area terbuka tanpa pelindung',
      'Memakai masker dan kacamata pelindung, serta berlindung di dalam bangunan beratap kokoh',
      'Menjemur pakaian di pekarangan rumah',
      'Mengonsumsi air dari bak penampungan terbuka'
    ],
    correctAnswerIndex: 1,
    explanation: 'Abu vulkanik mengandung pecahan kaca silika tajam; masker dan kacamata melindungi paru-paru dan mata dari iritasi parah.'
  }
];

interface MissionQuizActivityProps {
  onCompleteQuiz: (score: number) => void;
  onNavigate: (view: AppView) => void;
  onToast: (msg: string) => void;
}

export const MissionQuizActivity: React.FC<MissionQuizActivityProps> = ({
  onCompleteQuiz,
  onNavigate,
  onToast
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  const currentQ = QUESTIONS[currentQuestionIndex];
  const userSelected = selectedAnswers[currentQ.id];
  const isAnswered = userSelected !== undefined;

  const handleSelectOption = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsQuizCompleted(true);
      const correctCount = QUESTIONS.reduce((acc, q) => {
        return acc + (selectedAnswers[q.id] === q.correctAnswerIndex ? 1 : 0);
      }, 0);
      onCompleteQuiz(correctCount * 10);
      onToast(`Kuis Selesai! Skor Anda: ${correctCount}/10`);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setIsQuizCompleted(false);
  };

  const correctAnswersCount = QUESTIONS.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctAnswerIndex ? 1 : 0);
  }, 0);

  // Result Screen (Section 14)
  if (isQuizCompleted) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300 text-slate-100">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-orange-500/10">
            {correctAnswersCount >= 8 ? '🏆' : correctAnswersCount >= 6 ? '⭐' : '📖'}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider block">
              HASIL EVALUASI PEMBELAJARAN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Skor Anda
            </h2>
            <div className="text-5xl sm:text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 py-2">
              {correctAnswersCount}/10
            </div>
            <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
              Pemahaman Anda tentang materi gunung berapi dapat terus dikembangkan.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 border-t border-slate-800/80">
            <button
              onClick={handleRestart}
              className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer border border-slate-700/60"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba Lagi</span>
            </button>

            <button
              onClick={() => onNavigate('materi')}
              className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pelajari Ulang Materi</span>
            </button>
          </div>
        </div>

        {/* Review Answers List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
            Review 10 Soal &amp; Penjelasan Sains:
          </h3>
          {QUESTIONS.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correctAnswerIndex;

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xs font-mono font-bold text-orange-400 mt-0.5">
                      #{idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                      {q.question}
                    </p>
                  </div>
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                </div>

                <div className="text-xs space-y-1 pl-6">
                  <p className="text-slate-400">
                    Jawaban Anda:{' '}
                    <strong className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                      {userChoice !== undefined ? q.options[userChoice] : 'Tidak dijawab'}
                    </strong>
                  </p>
                  {!isCorrect && (
                    <p className="text-emerald-400">
                      Jawaban Benar: <strong>{q.options[q.correctAnswerIndex]}</strong>
                    </p>
                  )}
                  <p className="text-slate-400 pt-1 border-t border-slate-800/60">
                    <strong className="text-slate-300">Penjelasan: </strong>
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Quiz View (1 Question at a time with clean, calm educational feedback)
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in duration-300 text-slate-100">
      
      {/* Quiz Progress Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wide">
              KUIS VULKANOLOGI
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            Soal {currentQuestionIndex + 1} dari {QUESTIONS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md space-y-6">
        
        <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
          {currentQ.question}
        </h2>

        {/* 4 Pilihan Jawaban */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const optionLetter = ['A', 'B', 'C', 'D'][idx];
            const isSelected = userSelected === idx;
            const isCorrect = idx === currentQ.correctAnswerIndex;

            let btnStyle = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';
            if (showFeedback) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-red-950/60 border-red-500 text-red-200';
              }
            } else if (isSelected) {
              btnStyle = 'bg-orange-950/60 border-orange-500 text-orange-200';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-orange-400 shrink-0">
                    {optionLetter}
                  </span>
                  <span className="leading-snug">{option}</span>
                </div>

                {showFeedback && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Educational Feedback Box */}
        {showFeedback && (
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-bold">
              {userSelected === currentQ.correctAnswerIndex ? (
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Jawaban Anda Tepat!
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  Jawaban Belum Tepat.
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-orange-400">Pembahasan Sains: </strong>
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Next / Submit Button */}
        {showFeedback && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <span>{currentQuestionIndex < QUESTIONS.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
