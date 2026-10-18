/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  Layers,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  X,
  Compass,
  ArrowRight
} from 'lucide-react';
import { AppView } from '../types';

interface TopicItem {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  content: string[];
  keyFacts: string[];
}

const TOPICS: TopicItem[] = [
  {
    id: 1,
    title: 'Mengenal Gunung Berapi',
    subtitle: 'Konsep Dasar & Terbentuknya Gunung Api',
    icon: '⛰️',
    description: 'Gunung berapi adalah bukaan pada kerak bumi tempat magma, gas, dan material piroklastik keluar ke permukaan.',
    content: [
      'Sebagian besar gunung api di bumi terbentuk di sepanjang batas lempeng tektonik, terutama pada zona subduksi tempat satu lempeng menunjam ke bawah lempeng lain.',
      'Indonesia terletak di pertemuan tiga lempeng tektonik utama (Indo-Australia, Eurasia, dan Pasifik) yang menjadikannya bagian dari Cincin Api Pasifik (Ring of Fire) dengan lebih dari 120 gunung api aktif.',
      'Gunung berapi terbagi menjadi beberapa tipe morfologi, seperti stratovolcano (komposit), perisai, dan kaldera runtuhan.'
    ],
    keyFacts: [
      'Indonesia memiliki jumlah gunung api aktif terbanyak di dunia.',
      'Stratovolcano adalah jenis gunung berapi paling umum di kepulauan Indonesia.'
    ]
  },
  {
    id: 2,
    title: 'Struktur Gunung Berapi',
    subtitle: 'Anatomi Interior & Morfologi Fisik',
    icon: '📐',
    description: 'Membedah bagian-bagian penting mulai dari dapur magma di bawah tanah hingga puncak kawah.',
    content: [
      'Dapur Magma (Magma Chamber): Ruang reservoir besar di kedalaman bumi tempat magma cair berkumpul sebelum terangkat naik.',
      'Pipa Kepundan Utama (Central Conduit): Lorong atau saluran utama vertikal yang menghubungkan dapur magma dengan kawah puncak.',
      'Kepundan Samping (Parasitic Vent): Rekahan cabang pada lereng gunung tempat keluarnya aliran lava tambahan.',
      'Kawah (Crater): Cekungan atau depresi melingkar di puncak gunung tempat keluarnya material letusan.'
    ],
    keyFacts: [
      'Tekanan dalam dapur magma dapat mencapai ribuan atmosfer.',
      'Dinding lereng stratovolcano tersusun dari lapisan perselingan lava dan abu padat.'
    ]
  },
  {
    id: 3,
    title: 'Magma dan Lava',
    subtitle: 'Perbedaan Fisika & Kimia Batuan Cair',
    icon: '🔥',
    description: 'Memahami perbedaan mendasar antara cairan pijar yang berada di dalam bumi vs yang telah keluar ke udara bebas.',
    content: [
      'Magma adalah batuan cair pijar yang masih berada di bawah permukaan kerak bumi, mengandung gas terlarut dan kristal mineral pada suhu 700°C–1.300°C.',
      'Lava adalah magma yang telah mencapai permukaan bumi dan mengalir keluar melalui kawah atau celah rekahan lereng.',
      'Saat magma menyembur menjadi lava, gas-gas terlarut seperti uap air, CO₂, dan SO₂ memuai dan terlepas ke atmosfer.'
    ],
    keyFacts: [
      'Magma = Batuan cair di bawah tanah (belum kehilangan gas).',
      'Lava = Batuan cair di permukaan bumi (gas telah terlepas).'
    ]
  },
  {
    id: 4,
    title: 'Tanda-tanda Gunung Akan Erupsi',
    subtitle: 'Gejala Awal & Peringatan Dini Geologis',
    icon: '📡',
    description: 'Bagaimana alam dan instrumen sains memberi petunjuk sebelum letusan besar terjadi.',
    content: [
      'Peningkatan Aktivitas Seismik: Terjadi getaran gempa tremor vulkanik berulang akibat magma mendesak dan meretakkan batuan penutup.',
      'Deformasi Permukaan Lereng: Lereng gunung membengkak (inflasi) yang diukur menggunakan instrumen Tiltmeter dan GPS geodetik.',
      'Peningkatan Emisi Gas Belerang: Keluarnya gas SO₂ dan uap fumarol pekat dari kawah puncak.',
      'Perilaku Hewan & Lingkungan: Suhu mata air lereng menghangat, vegetasi sekitar kawah menguning, dan satwa liar berbondong-bondong turun lereng.'
    ],
    keyFacts: [
      'Satwa liar memiliki kepekaan insting terhadap getaran seismik frekuensi rendah (infrasonik).',
      'Tiltmeter mencatat perubahan kemiringan lereng dalam satuan mikro-radian.'
    ]
  },
  {
    id: 5,
    title: 'Proses Erupsi',
    subtitle: 'Mekanisme Pelepasan Energi Vulkanik',
    icon: '💥',
    description: 'Tahapan pelepasan tekanan gas hingga menyemburkan material batuan pijar ke stratosfer.',
    content: [
      'Akumulasi Tekanan: Gas-gas volatil dalam magma membentuk jutaan gelembung saat magma bergerak naik ke area bertekanan lebih rendah.',
      'Dekompresi & Ledakan: Ketika tekanan gas melampaui kekuatan batuan penutup kawah, sumbat kawah terlempar hancur berkeping-keping.',
      'Pembentukan Kolom Erupsi: Kolom gas panas dan abu vulkanik membubung ke angkasa hingga ketinggian belasan kilometer.',
      'Aliran Piroklastik (Awan Panas): Campuran gas panas, abu, dan bebatuan runtuh dan meluncur menuruni lereng dengan kecepatan lebih dari 100 km/jam.'
    ],
    keyFacts: [
      'Suhu awan panas (wedhus gembel) dapat melampaui 600°C.',
      'Tipe erupsi Plinian mampu melontarkan material hingga lapisan stratosfer.'
    ]
  },
  {
    id: 6,
    title: 'Material Vulkanik',
    subtitle: 'Zat Padat, Cair, dan Gas yang Dikeluarkan',
    icon: '🪨',
    description: 'Klasifikasi ragam produk letusan mulai dari bom vulkanik hingga partikel abu mikroskopis.',
    content: [
      'Material Padat (Eflata / Piroklastik): Bom vulkanik (bongkahan batu besar > 64 mm), lapili (kerikil 2–64 mm), dan abu vulkanik halus (< 2 mm).',
      'Material Cair: Aliran lava pijar yang mengendap menjadi batuan beku andesit atau basalt.',
      'Material Gas: Fumarol dan solfatara yang melepaskan H₂O, CO₂, SO₂, H₂S, dan HCl.',
      'Lahar Dingin / Lahar Hujan: Endapan abu dan batu vulkanik di hulu sungai yang tersapu banjir lahar saat hujan lebat.'
    ],
    keyFacts: [
      'Abu vulkanik bukan abu pembakaran kayu, melainkan pecahan kaca silika tajam berukuran mikroskopis.',
      'Bom vulkanik terlempar dalam kondisi membara dan membeku saat melayang di udara.'
    ]
  },
  {
    id: 7,
    title: 'Dampak Erupsi',
    subtitle: 'Konsekuensi Terhadap Ekosistem & Kehidupan',
    icon: '🌱',
    description: 'Memahami dua sisi letusan: bahaya primer bencana serta manfaat kesuburan tanah jangka panjang.',
    content: [
      'Dampak Bahaya (Primer & Sekunder): Kerusakan pemukiman akibat awan panas, gangguan saluran pernapasan akibat abu, dan banjir lahar hujan di lembah sungai.',
      'Dampak Positif Jangka Panjang: Material abu vulkanik mengandung kalium, fosfor, dan kalsium yang menjadikan tanah andosol di lereng gunung sangat subur untuk pertanian.',
      'Potensi Energi & Mineral: Pembentukan sumber energi panas bumi (geotermal), endapan belerang, dan bahan galian tambang pasir berkualitas tinggi.'
    ],
    keyFacts: [
      'Kawasan di sekitar gunung api di Jawa dan Sumatra menjadi lumbung padi berkat kesuburan tanah vulkanik.',
      'Indonesia memiliki 40% cadangan energi geotermal dunia.'
    ]
  },
  {
    id: 8,
    title: 'Mitigasi Bencana',
    subtitle: 'Kesiapsiagaan, Tingkat Status & Evakuasi',
    icon: '🛡️',
    description: 'Langkah penyelamatan mandiri dan pemahaman 4 tingkatan status resmi PVMBG.',
    content: [
      'Tingkat Status PVMBG: Level I (Normal • Hijau), Level II (Waspada • Kuning), Level III (Siaga • Oranye), dan Level IV (Awas • Merah).',
      'Kawasan Rawan Bencana (KRB): KRB III (area paling berbahaya di puncak/jalur awan panas), KRB II, dan KRB I.',
      'Tindakan Saat Erupsi: Segera evakuasi ke titik kumpul aman di luar radius bahaya, gunakan masker dan kacamata pelindung untuk menghindari abu.',
      'Rujukan Resmi: Selalu ikuti instruksi resmi dari PVMBG (Badan Geologi) dan BPBD/BNPB, serta hindari penyebaran berita hoaks.'
    ],
    keyFacts: [
      'Pada status Level IV (Awas), masyarakat di dalam radius bahaya wajib segera mengungsi.',
      'Masker N95 atau kain basah efektif menyaring partikel abu vulkanik silika.'
    ]
  }
];

interface StorytellingMaterialViewProps {
  onNavigate: (view: AppView) => void;
}

export const StorytellingMaterialView: React.FC<StorytellingMaterialViewProps> = ({ onNavigate }) => {
  const [readTopics, setReadTopics] = useState<number[]>([1]);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(null);

  // Prevent background scroll when modal reader dialog is open
  useEffect(() => {
    if (selectedTopic) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedTopic(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedTopic]);

  const markAsRead = (id: number) => {
    if (!readTopics.includes(id)) {
      setReadTopics(prev => [...prev, id]);
    }
  };

  const progressPercent = Math.round((readTopics.length / TOPICS.length) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-12 space-y-8 animate-in fade-in duration-300 text-slate-100">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-bold font-mono">
            <span>📖 MATERI PEMBELAJARAN</span>
            <span>•</span>
            <span>8 TOPIK LENGKAP</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Konsep Vulkanologi &amp; Kebencanaan
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal max-w-xl leading-relaxed">
            Pelajari 8 bab terstruktur mengenai dinamika dapur magma, tanda peringatan dini erupsi, hingga pedoman mitigasi resmi BNPB.
          </p>
        </div>

        {/* Learning Progress Indicator */}
        <div className="w-full md:w-64 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-md space-y-2 relative z-10 shrink-0">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">Progress Belajar:</span>
            <span className="text-orange-400 font-mono">{readTopics.length}/8 Topik ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            {progressPercent === 100
              ? '🎉 Selamat! Kamu telah menuntaskan seluruh materi.'
              : 'Klik kartu di bawah untuk membaca detail bab.'}
          </p>
        </div>
      </div>

      {/* Grid: 8 Topik Kartu Modern (Section 13) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOPICS.map((topic) => {
          const isRead = readTopics.includes(topic.id);

          return (
            <div
              key={topic.id}
              onClick={() => {
                setSelectedTopic(topic);
                markAsRead(topic.id);
              }}
              className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 shadow-lg backdrop-blur-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {topic.icon}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                    isRead
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {isRead ? 'SELESAI' : 'BELUM'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-orange-400 block font-bold">
                    TOPIK 0{topic.id}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors line-clamp-1">
                    {topic.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium line-clamp-2 mt-1 leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-orange-400 group-hover:text-orange-300">
                <span>Pelajari Bab</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Modal Drawer for Detailed Learning */}
      {selectedTopic && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTopic(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="max-w-2xl w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[82vh] overflow-hidden text-slate-200">
            
            {/* Modal Fixed Header */}
            <div className="shrink-0 p-5 sm:p-6 border-b border-slate-800/90 bg-slate-900/95 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">{selectedTopic.icon}</span>
                <div>
                  <span className="text-[10px] font-mono font-bold text-orange-400 tracking-wider uppercase block">
                    TOPIK 0{selectedTopic.id} • {selectedTopic.subtitle}
                  </span>
                  <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                    {selectedTopic.title}
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                aria-label="Tutup Dialog"
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Content paragraphs */}
              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {selectedTopic.content.map((p, idx) => (
                  <p key={idx} className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/70">
                    {p}
                  </p>
                ))}
              </div>

              {/* Key Facts box */}
              <div className="p-4 rounded-2xl bg-orange-950/20 border border-orange-500/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Poin Penting Sains:</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                  {selectedTopic.keyFacts.map((fact, idx) => (
                    <li key={idx}>{fact}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Fixed Footer Buttons */}
            <div className="shrink-0 p-3.5 sm:p-4 border-t border-slate-800/90 bg-slate-900/95 flex flex-wrap items-center justify-between gap-2.5">
              <button
                onClick={() => {
                  setSelectedTopic(null);
                  onNavigate('explore_3d');
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700/60"
              >
                <Layers className="w-3.5 h-3.5 text-orange-400" />
                <span>Amati di Tampilan 3D</span>
              </button>

              <button
                onClick={() => setSelectedTopic(null)}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/30 transition-all cursor-pointer"
              >
                <span>Tutup Pembahasan</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Direct CTA to Quiz */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-white">Sudah Menguasai Materi?</h3>
          <p className="text-xs text-slate-400">Uji pemahamanmu sekarang melalui 10 soal kuis pilihan ganda interaktif.</p>
        </div>
        <button
          onClick={() => onNavigate('missions')}
          className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/25 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <span>Mulai Kuis 10 Soal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
