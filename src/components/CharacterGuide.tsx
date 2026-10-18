/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Heart } from 'lucide-react';

export type CharacterMood = 'happy' | 'thinking' | 'pointing' | 'surprised' | 'cheering';

interface CharacterGuideProps {
  mood?: CharacterMood;
  message: string;
  onDismiss?: () => void;
  actionText?: string;
  onAction?: () => void;
}

export const CharacterGuide: React.FC<CharacterGuideProps> = ({
  mood = 'happy',
  message,
  onDismiss,
  actionText,
  onAction
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const getAvatarEmoji = () => {
    switch (mood) {
      case 'happy': return '😄';
      case 'thinking': return '🤔';
      case 'pointing': return '👉';
      case 'surprised': return '😮';
      case 'cheering': return '🎉';
      default: return '🧭';
    }
  };

  return (
    <aside
      aria-label="Pemandu Petualangan Kara"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 max-w-sm w-[90%] sm:w-84 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-amber-400 shadow-2xl p-4 flex items-start gap-3.5 relative">
        
        {/* Karakter Avatar Bulat dengan Ekspresi Sesuai Prompt 23 */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border border-amber-300 flex items-center justify-center text-2xl shadow-md">
            {getAvatarEmoji()}
          </div>
          <span className="absolute -bottom-1 -right-1 text-[10px] bg-white border border-amber-200 rounded-full px-1 shadow-2xs font-bold">
            KARA
          </span>
        </div>

        {/* Bubble Percakapan */}
        <div className="flex-1 space-y-1.5 min-w-0 pr-4">
          <div className="text-[10px] font-black text-amber-800 tracking-wider uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Pemandu Petualangan</span>
          </div>
          <p className="text-xs text-slate-800 font-extrabold leading-snug">
            {message}
          </p>

          {actionText && onAction && (
            <button
              onClick={onAction}
              className="text-[11px] font-black text-amber-700 hover:text-amber-900 underline underline-offset-2 cursor-pointer pt-0.5 block"
            >
              {actionText} →
            </button>
          )}
        </div>

        {/* Tombol Tutup Bubble */}
        <button
          onClick={() => {
            setIsVisible(false);
            if (onDismiss) onDismiss();
          }}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </aside>
  );
};
