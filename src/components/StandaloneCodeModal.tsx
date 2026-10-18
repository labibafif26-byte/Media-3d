/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileCode2, Copy, Check, X, Download } from 'lucide-react';

interface StandaloneCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneCodeModal: React.FC<StandaloneCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<'index' | 'css' | 'js'>('index');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getFileContent = () => {
    if (activeFile === 'index') {
      return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simulasi 3D Gunung Berapi & Aktivitas Vulkanik</title>
  <link rel="stylesheet" href="style.css">
  <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
  <script src="https://unpkg.com/three@0.160.0/examples/js/controls/OrbitControls.js"></script>
  <script src="https://unpkg.com/three@0.160.0/examples/js/loaders/GLTFLoader.js"></script>
</head>
<body>
  <div id="canvas-container"></div>
  <div id="toast">Notifikasi</div>
  <div id="ui-overlay">
    <header class="top-header glass-panel interactive">
      <div class="header-brand">
        <h1>🌋 VOLCANO 3D</h1>
        <div class="subtitle">Simulasi Interaktif Anatomi & Tanda Aktivitas Vulkanik</div>
      </div>
      <div class="header-actions">
        <div id="status-badge" class="status-badge">
          <span class="status-dot"></span>
          <span id="status-text">AKTIVITAS NORMAL (LEVEL I)</span>
        </div>
        <button id="btn-sound" class="btn-state interactive">🔊 SOUND</button>
        <button id="btn-reset-cam" class="btn-icon" title="Reset Kamera">🔄</button>
      </div>
    </header>

    <main class="main-content-zone">
      <aside class="left-sidebar">
        <div class="glass-panel" style="padding: 12px;">
          <div class="section-title">Mode Tampilan 3D</div>
          <div class="toggle-group">
            <button id="mode-full" class="toggle-btn active">Mode Normal</button>
            <button id="mode-cutaway" class="toggle-btn">Mode Penampang</button>
          </div>
        </div>
        <div class="glass-panel" style="padding: 14px;">
          <div class="section-title">Tanda Peningkatan Aktivitas</div>
          <div class="indicators-list">
            <div class="indicator-item" data-type="gempa"><span>📈 1. Gempa Vulkanik</span><span class="tag">Tremor</span></div>
            <div class="indicator-item" data-type="suhu"><span>🌡️ 2. Peningkatan Suhu</span><span class="tag">Termal</span></div>
            <div class="indicator-item" data-type="gas"><span>💨 3. Gas & Asap Kawah</span><span class="tag">SO₂/CO₂</span></div>
            <div class="indicator-item" data-type="air"><span>💧 4. Perubahan Air</span><span class="tag">Mata Air</span></div>
            <div class="indicator-item" data-type="hewan"><span>🦌 5. Perilaku Hewan</span><span class="tag">Migrasi</span></div>
            <div class="indicator-item" data-type="deformasi"><span>📐 6. Deformasi Gunung</span><span class="tag">Tiltmeter</span></div>
            <div class="indicator-item" data-type="lava"><span>🔥 7. Aktivitas Lava</span><span class="tag">Kubah</span></div>
          </div>
        </div>
        <div class="glass-panel seismograph-widget">
          <div class="section-title">Seismograf Vulkanik</div>
          <canvas id="seismo-canvas" class="seismo-canvas" width="250" height="70"></canvas>
        </div>
      </aside>

      <aside class="right-sidebar">
        <div id="info-panel" class="glass-panel info-card">
          <div class="card-header">
            <h3 id="info-title">🌋 Kawah (Crater)</h3>
            <button class="btn-close" onclick="hideInfo()">✕</button>
          </div>
          <div class="card-body">
            <p id="info-desc">Bagian terbuka di puncak gunung tempat material vulkanik keluar.</p>
            <div id="info-callout" class="data-callout">Pemantauan visual & thermal 24 jam.</div>
          </div>
        </div>
      </aside>
    </main>

    <footer class="bottom-dock">
      <div class="simulation-timeline-bar">
        <div id="timeline-progress" class="timeline-fill"></div>
      </div>
      <div class="controls-row glass-panel interactive">
        <button id="btn-normal" class="btn-state active">● NORMAL</button>
        <button id="btn-warning" class="btn-state">▲ AKTIVITAS MENINGKAT</button>
        <button id="btn-erupt" class="btn-state btn-erupt">🌋 MULAI ERUPSI</button>
        <button id="btn-reset" class="btn-state btn-reset">↺ RESET</button>
      </div>
      <div class="disclaimer-bar">
        Simulasi Edukasi: Dibuat untuk tujuan pembelajaran tugas sekolah/kuliah. Status nyata ditentukan otoritas resmi (PVMBG).
      </div>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>`;
    } else if (activeFile === 'css') {
      return `/* style.css - Lihat file lengkap di public/standalone/style.css */
:root {
  --color-bg: #030712;
  --color-panel-bg: rgba(15, 23, 42, 0.82);
  --color-accent: #f97316;
}
html, body {
  width: 100%; height: 100%; overflow: hidden;
  background-color: var(--color-bg); font-family: sans-serif;
}
#canvas-container { position: absolute; width: 100%; height: 100%; }
#ui-overlay { position: absolute; width: 100%; height: 100%; z-index: 10; pointer-events: none; padding: 18px; }
.interactive { pointer-events: auto; }
.glass-panel { background: var(--color-panel-bg); backdrop-filter: blur(14px); border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); }
.status-badge { padding: 6px 14px; border-radius: 9999px; font-weight: bold; background: rgba(16,185,129,0.15); color: #34d399; }
.status-badge.warning { background: rgba(245,158,11,0.15); color: #fbbf24; }
.status-badge.eruption { background: rgba(239,68,68,0.2); color: #f87171; }
.btn-erupt { background: linear-gradient(135deg, #dc2626, #ea580c); color: #fff; font-weight: bold; }
/* (File style.css lengkap tersedia di folder /public/standalone/style.css) */`;
    } else {
      return `// script.js - Fungsi terpisah lengkap (Three.js WebGL & Volcanic Simulation)
// Berisi fungsi:
// init(), initScene(), initCamera(), initRenderer(), initLights(), initControls(),
// loadModels(), createEnvironment(), createAnimals(), createTrees(), createSmoke(),
// createLava(), createUI(), animate(), updateAnimals(), updateBirds(), updateSmoke(),
// updateLava(), startEruption(), resetSimulation(), resetCamera(), showInfo(), hideInfo()
//
// File lengkap telah dibuat di: /public/standalone/script.js`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFileContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-white/15 rounded-2xl flex flex-col shadow-2xl overflow-hidden max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Kode Standalone (index.html / style.css / script.js)
              </h2>
              <p className="text-[11px] text-slate-400">
                File bersih tanpa framework untuk Live Server & tugas kuliah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-950/40 border-b border-white/10">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFile('index')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFile === 'index' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              index.html
            </button>
            <button
              onClick={() => setActiveFile('css')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFile === 'css' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              style.css
            </button>
            <button
              onClick={() => setActiveFile('js')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeFile === 'js' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              script.js
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            {copied ? 'Tersalin!' : 'Salin Kode'}
          </button>
        </div>

        {/* Code View */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950">
          <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
            {getFileContent()}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>File siap pakai tersimpan di folder <code className="text-amber-400">public/standalone/</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
