/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Puzzle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';
import { ecoAudio } from '../utils/ecoAudio';

interface MiniGameViewProps {
  onGameWon: (score: number) => void;
  onToast: (msg: string) => void;
}

interface ChainCard {
  id: string;
  name: string;
  icon: string;
  role: string;
  correctIndex: number;
}

const CARDS_INITIAL: ChainCard[] = [
  { id: 'rumput', name: 'Rumput Padang', icon: '🌱', role: 'Produsen', correctIndex: 0 },
  { id: 'belalang', name: 'Belalang Padang', icon: '🦗', role: 'Konsumen I', correctIndex: 1 },
  { id: 'katak', name: 'Katak Sawah', icon: '🐸', role: 'Konsumen II', correctIndex: 2 },
  { id: 'ular', name: 'Ular Rumput', icon: '🐍', role: 'Konsumen III', correctIndex: 3 },
  { id: 'elang', name: 'Elang Jawa', icon: '🦅', role: 'Predator Puncak', correctIndex: 4 }
];

export const MiniGameView: React.FC<MiniGameViewProps> = ({ onGameWon, onToast }) => {
  // Scramble cards initially
  const [deck, setDeck] = useState<ChainCard[]>(() => {
    return [...CARDS_INITIAL].sort(() => Math.random() - 0.5);
  });

  const [slots, setSlots] = useState<(ChainCard | null)[]>([null, null, null, null, null]);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Handle click card from deck to first empty slot
  const handleSelectCard = (card: ChainCard) => {
    const emptyIdx = slots.indexOf(null);
    if (emptyIdx === -1) return;

    ecoAudio.playClick();
    const newSlots = [...slots];
    newSlots[emptyIdx] = card;
    setSlots(newSlots);

    setDeck(deck.filter((c) => c.id !== card.id));
    setIsEvaluated(false);
  };

  // Handle remove card from slot back to deck
  const handleRemoveFromSlot = (slotIdx: number) => {
    const card = slots[slotIdx];
    if (!card) return;

    ecoAudio.playClick();
    const newSlots = [...slots];
    newSlots[slotIdx] = null;
    setSlots(newSlots);

    setDeck([...deck, card]);
    setIsEvaluated(false);
  };

  // Check user arrangement
  const handleVerifyChain = () => {
    // Check if all slots filled
    if (slots.some((s) => s === null)) {
      onToast('⚠️ Silakan isi kelima slot organisme terlebih dahulu!');
      return;
    }

    const isAllCorrect = slots.every((card, idx) => card?.correctIndex === idx);
    setIsEvaluated(true);

    if (isAllCorrect) {
      setIsSuccess(true);
      setFeedbackMsg('🎉 SEMPURNA! Kamu berhasil menyusun rantai makanan padang rumput secara tepat dari Produsen hingga Predator Puncak!');
      ecoAudio.playQuizCorrect();
      onGameWon(100);
      onToast('🏆 Selamat! Kamu mendapatkan +30 XP!');
    } else {
      setIsSuccess(false);
      ecoAudio.playQuizWrong();

      // Check specific mistakes to give helpful educational advice
      if (slots[0]?.id !== 'rumput') {
        setFeedbackMsg('💡 Petunjuk: Rantai makanan selalu berawal dari PRODUSEN (tumbuhan hijau) yang menangkap energi fotosintesis.');
      } else if (slots[1]?.id !== 'belalang') {
        setFeedbackMsg('💡 Petunjuk: Siapa yang memakan rumput secara langsung? Cari hewan herbivora di antara pilihanmu.');
      } else if (slots[2]?.id !== 'katak') {
        setFeedbackMsg('💡 Petunjuk: Katak adalah pemakan serangga (belalang), letakkan katak setelah belalang.');
      } else {
        setFeedbackMsg('💡 Petunjuk: Ular memangsa katak, sedangkan elang menempati puncak piramida sebagai pemangsa ular.');
      }
    }
  };

  const handleReset = () => {
    setDeck([...CARDS_INITIAL].sort(() => Math.random() - 0.5));
    setSlots([null, null, null, null, null]);
    setIsEvaluated(false);
    setIsSuccess(false);
    setFeedbackMsg('');
    ecoAudio.playClick();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10 animate-in fade-in duration-300 text-slate-100">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wide">
          <Puzzle className="w-3.5 h-3.5" />
          <span>MINI GAME INTERAKTIF</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Susun Rantai Makanan
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          Klik kartu organisme yang tersedia di bawah dan susunlah ke dalam 5 slot berurutan dari <strong>Produsen Primer</strong> hingga <strong>Predator Puncak</strong>!
        </p>
      </div>

      {/* Target Slots Sequence (5 Steps) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 px-1">
          <span>ALUR RANTAI MAKANAN (KIRI KE KANAN)</span>
          <span className="text-emerald-400 font-bold">5 Slot Terbuka</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {slots.map((card, idx) => {
            const stepLabel = [
              '1. Produsen',
              '2. Konsumen I',
              '3. Konsumen II',
              '4. Konsumen III',
              '5. Predator Puncak'
            ][idx];

            return (
              <div
                key={idx}
                onClick={() => handleRemoveFromSlot(idx)}
                className={`relative min-h-[145px] p-4 rounded-3xl border-2 flex flex-col justify-between items-center text-center transition-all ${
                  card
                    ? 'bg-slate-900/90 border-emerald-500/60 shadow-lg cursor-pointer hover:border-rose-400/80 group'
                    : 'bg-slate-950/60 border-dashed border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  {stepLabel}
                </span>

                {card ? (
                  <>
                    <span className="text-4xl group-hover:scale-110 transition-transform">
                      {card.icon}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-xs text-white group-hover:text-rose-400 transition-colors">
                        {card.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 block">{card.role}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 group-hover:text-rose-400">
                      (Klik untuk lepas)
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 gap-1">
                    <span className="text-2xl opacity-40">📥</span>
                    <span className="text-[10px] font-mono">Slot Kosong</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Organism Deck */}
      <div className="space-y-3 p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>KARTU ORGANISME YANG TERSEDIA:</span>
          <span>{deck.length} Kartu Tersisa</span>
        </div>

        {deck.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            {deck.map((card) => (
              <button
                key={card.id}
                onClick={() => handleSelectCard(card)}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/70 hover:border-emerald-400/60 transition-all cursor-pointer text-center space-y-2 group shadow-md active:scale-95"
              >
                <span className="text-3xl block group-hover:scale-110 transition-transform">
                  {card.icon}
                </span>
                <span className="font-extrabold text-xs text-white block group-hover:text-emerald-300">
                  {card.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block">{card.role}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-slate-400 font-mono">
            Semua kartu telah ditempatkan ke dalam slot di atas! Silakan klik tombol periksa di bawah.
          </div>
        )}
      </div>

      {/* Verification Feedback Banner */}
      {isEvaluated && (
        <div
          className={`p-5 rounded-2xl border flex items-start gap-3.5 animate-in slide-in-from-top-3 duration-200 ${
            isSuccess
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-sm text-white">
              {isSuccess ? 'Selamat! Susunan Rantai Makanan Benar' : 'Periksa Kembali Urutan'}
            </h4>
            <p className="leading-relaxed">{feedbackMsg}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={handleVerifyChain}
          disabled={slots.some((s) => s === null)}
          className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Periksa Susunan Rantai</span>
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm cursor-pointer transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Acak Ulang</span>
        </button>
      </div>

    </div>
  );
};
