/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { VolcanoState } from '../types';

interface SeismographProps {
  volcanoState: VolcanoState;
  height?: number;
}

export const Seismograph: React.FC<SeismographProps> = ({ volcanoState, height = 75 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      const w = canvas.width;
      const h = canvas.height;

      // Background Grid
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      // Fine Grid Lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      for (let y = 10; y < h; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Seismogram Trace
      ctx.beginPath();
      const midY = h / 2;

      let amp = 3.0;
      let freq = 0.12;
      let strokeColor = '#059669';

      if (volcanoState === 'WARNING') {
        amp = 14.0;
        freq = 0.22;
        strokeColor = '#d97706';
      } else if (volcanoState === 'ERUPTION') {
        amp = 26.0;
        freq = 0.35;
        strokeColor = '#dc2626';
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.6;

      for (let x = 0; x < w; x++) {
        // Combinasi sinusoidal untuk simulasi sinyal seismik harmonik
        const t = (x + offset) * freq;
        const mainWave = Math.sin(t) * Math.cos(t * 0.45);
        const microJitter = (Math.random() - 0.5) * (amp * 0.35);
        const y = midY + mainWave * amp + microJitter;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      offset += volcanoState === 'ERUPTION' ? 6 : (volcanoState === 'WARNING' ? 3.5 : 1.2);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [volcanoState]);

  return (
    <div className="w-full bg-white rounded-xl p-2.5 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 mb-1">
        <span className="flex items-center gap-1 font-semibold">
          <span className={`w-2 h-2 rounded-full ${
            volcanoState === 'ERUPTION' ? 'bg-red-500 animate-ping' : volcanoState === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
          }`} />
          SEISMOGRAM LERENG (REALTIME)
        </span>
        <span className="text-slate-500 tabular-nums font-medium">
          {volcanoState === 'ERUPTION' ? 'AMP: 48.5 mm (TREMOR)' : volcanoState === 'WARNING' ? 'AMP: 18.2 mm' : 'AMP: 2.1 mm'}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={320}
        height={height}
        className="w-full rounded border border-slate-200 block"
      />
      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-1">
        <span>Stasiun Kawah-01</span>
        <span>Filter: 1.0 - 5.0 Hz</span>
      </div>
    </div>
  );
};
