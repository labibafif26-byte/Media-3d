/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  Compass
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/ecoData';
import { AppView } from '../types';
import { ecoAudio } from '../utils/ecoAudio';

interface QuizViewProps {
  onCompleteQuiz: (score: number) => void;
  onNavigate: (view: AppView) => void;
  onToast: (msg: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  onCompleteQuiz,
  onNavigate,
  onToast
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) {
      onToast('⚠️ Pilih salah satu opsi jawaban terlebih dahulu!');
      return;
    }

    const isCorrect = selectedAnswer === currentQ.correctIndex;
    if (isCorrect) {
      ecoAudio.playQuizCorrect();
    } else {
      ecoAudio.playQuizWrong();
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const updatedAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(updatedAnswers);

    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      ecoAudio.playClick();
    } else {
      // Finished all 10 questions
      setIsFinished(true);
      const correctCount = updatedAnswers.filter(
        (ans, idx) => ans === QUIZ_QUESTIONS[idx].correctIndex
      ).length;
      const finalScore = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
      onCompleteQuiz(finalScore);
      ecoAudio.playQuizCorrect();
      onToast(`🏆 Kuis Selesai! Skor akhirmu: ${finalScore}/100 (+50 XP)`);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setUserAnswers([]);
    setIsFinished(false);
    ecoAudio.playClick();
  };

  // Result Calculation
  const correctCount = userAnswers.filter(
    (ans, idx) => ans === QUIZ_QUESTIONS[idx].correctIndex
  ).length;
  const wrongCount = QUIZ_QUESTIONS.length - correctCount;
  const finalScore = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  // 1. RESULT SCREEN (Section U)
  if (isFinished) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-in zoom-in-95 duration-300 text-slate-100">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-emerald-500/40 shadow-2xl text-center space-y-7">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-4xl mx-auto shadow-inner">
            {finalScore >= 80 ? '🏆' : finalScore >= 60 ? '⭐' : '🌱'}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              HASIL PEMBELAJARAN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {finalScore >= 80
                ? 'Luar Biasa! Pemahaman Sangat Baik'
                : finalScore >= 60
                ? 'Bagus Sekali! Pemahaman Cukup Matang'
                : 'Terus Semangat Belajar! Coba Ulangi Sekali Lagi'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Kamu telah menyelesaikan 10 soal evaluasi tentang rantai makanan dan transfer energi trofik ekosistem padang rumput.
            </p>
          </div>

          {/* Score Stats Badge */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">SKOR AKHIR</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                {finalScore} <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">JUMLAH BENAR</span>
              <div className="text-2xl font-black text-emerald-300 font-mono mt-0.5">
                {correctCount}
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">JUMLAH SALAH</span>
              <div className="text-2xl font-black text-rose-400 font-mono mt-0.5">
                {wrongCount}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>ULANGI KUIS</span>
            </button>

            <button
              onClick={() => {
                ecoAudio.playClick();
                onNavigate('explore');
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>KEMBALI KE EKOSISTEM</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE QUESTION SCREEN (Section T)
  const isSelected = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQ.correctIndex;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6 animate-in fade-in duration-300 text-slate-100">
      
      {/* Progress Bar & Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400">
          <span>PERTANYAAN {currentIndex + 1} DARI {QUIZ_QUESTIONS.length}</span>
          <span className="text-emerald-400 font-mono">
            {Math.round(((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
        <div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
            {currentQ.trophicContext}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white mt-3 leading-relaxed">
            {currentQ.question}
          </h2>
        </div>

        {/* 4 Options Grid */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const isOptSelected = selectedAnswer === idx;
            const isOptCorrect = idx === currentQ.correctIndex;

            let btnStyle = 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 text-slate-300';
            if (showFeedback) {
              if (isOptCorrect) {
                btnStyle = 'bg-emerald-950/80 border-emerald-400 text-white font-bold';
              } else if (isOptSelected && !isOptCorrect) {
                btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
              } else {
                btnStyle = 'opacity-40 border-slate-800 text-slate-500';
              }
            } else if (isOptSelected) {
              btnStyle = 'bg-emerald-950/60 border-emerald-400 text-white shadow-md';
            }

            return (
              <button
                key={idx}
                disabled={showFeedback}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {['A', 'B', 'C', 'D'][idx]}
                  </span>
                  <span>{opt}</span>
                </div>

                {showFeedback && isOptCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {showFeedback && isOptSelected && !isOptCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback Callout (Section T) */}
        {showFeedback && (
          <div
            className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 animate-in slide-in-from-top-2 duration-200 ${
              isCorrect
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              {isCorrect ? '✓ Jawaban benar!' : '✕ Jawaban belum tepat.'}
            </div>
            <p className="text-slate-300">{currentQ.explanation}</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          {!showFeedback ? (
            <button
              onClick={handleConfirmAnswer}
              disabled={!isSelected}
              className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 cursor-pointer transition-all active:scale-95"
            >
              Konfirmasi Jawaban
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
