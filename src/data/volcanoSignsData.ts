/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VolcanicSignCard {
  id: string;
  icon: string;
  title: string;
  scientificTerm: string;
  shortDesc: string;
  fullExplanation: string;
  observationMethod: string;
  instrument: string;
  targetCameraPreset: 'default' | 'crater' | 'cutaway' | 'wildlife' | 'seismograph' | 'flank' | string;
  targetMarkerId?: string;
  highlightCoordinates: [number, number, number];
  keyIndicators: string[];
}

export interface SimulationStageInfo {
  step: number;
  state: 'NORMAL' | 'WASPADA' | 'SIAGA' | 'ERUPTION';
  title: string;
  statusText: string;
  statusBadge: string;
  statusColor: string;
  borderColor: string;
  bgLight: string;
  shortExplanation: string;
  visualChanges: string[];
  warningNote?: string;
  durationSeconds: number;
}

// 6 Kartu Tanda-Tanda Aktivitas Vulkanik Sebelum Erupsi
export const VOLCANIC_SIGNS: VolcanicSignCard[] = [
  {
    id: 'gempa_vulkanik',
    icon: '🌋',
    title: 'Gempa Vulkanik',
    scientificTerm: 'Seismisitas Vulkanik & Tremor',
    shortDesc: 'Peningkatan frekuensi gempa halus di dalam tanah akibat desakan magma ke atas.',
    fullExplanation: 'Ketika magma bergerak naik menuju permukaan, magma memecah dan merekah bebatuan di dalam tubuh gunung. Gesekan dan retakan ini menimbulkan getaran mikroseismik yang dapat direkam oleh seismograf di pos pengamatan.',
    observationMethod: 'Merekam gelombang gempa vulkanik dalam (VA), dangkal (VB), dan getaran tremor menerus.',
    instrument: 'Seismograf Broadband & Jaringan Seismometer Pos PVMBG',
    targetCameraPreset: 'seismograph',
    targetMarkerId: 'gempa',
    highlightCoordinates: [-17.0, 2.4, 11.0],
    keyIndicators: [
      'Jumlah gempa vulkanik meningkat dari hitungan mingguan menjadi puluhan kali per hari.',
      'Amplitudo getaran tremor menerus (RSAM) menunjukkan desakan fluida magma aktif.',
      'Sinyal frekuensi rendah menandakan resonansi gas di dalam pipa kepundan.'
    ]
  },
  {
    id: 'emisi_gas',
    icon: '💨',
    title: 'Perubahan Emisi Gas',
    scientificTerm: 'Pelepasan Fluks Gas Vulkanik',
    shortDesc: 'Keluarnya gas belerang (SO₂), karbon dioksida (CO₂), dan uap air dengan tekanan lebih tinggi.',
    fullExplanation: 'Magma mengandung gas terlarut dalam jumlah besar. Saat magma mendekati permukaan, tekanan batuan berkurang sehingga gas terlepas (proses dekompresi) dan menyembur keluar melalui rekahan solfatara serta kawah utama.',
    observationMethod: 'Mengukur konsentrasi dan fluks gas harian yang melayang di atas kawah.',
    instrument: 'DOAS (Differential Optical Absorption Spectroscopy) & Sensor Multi-GAS',
    targetCameraPreset: 'crater',
    targetMarkerId: 'kawah',
    highlightCoordinates: [0, 15.6, 0],
    keyIndicators: [
      'Peningkatan debit gas Belerang Dioksida (SO₂) secara drastis dari ton per hari.',
      'Bau belerang yang menyengat tercium hingga radius beberapa kilometer lereng.',
      'Perubahan rasio gas CO₂ terhadap SO₂ mengindikasikan pasokan magma baru dari kedalaman.'
    ]
  },
  {
    id: 'asap_uap',
    icon: '🌫️',
    title: 'Perubahan Asap/Uap',
    scientificTerm: 'Dinamika Kolom Hembusan Kawah',
    shortDesc: 'Kepulan asap kawah menjadi lebih tebal, membubung lebih tinggi, dan berubah warna kelabu.',
    fullExplanation: 'Pada kondisi tenang, gunung hanya mengeluarkan hembusan uap air putih tipis (solfatara). Namun saat aktivitas meningkat, semburan gas bertekanan tinggi mulai mengikis dinding kawah sehingga asap berubah menjadi kelabu gelap bercampur abu halus.',
    observationMethod: 'Pengamatan visual harian tinggi kolom asap dan warnanya dari pos pengamatan.',
    instrument: 'Kamera CCTV Pengawas Kawah 24 Jam & Teropong Prisma Presisi',
    targetCameraPreset: 'crater',
    targetMarkerId: 'abu',
    highlightCoordinates: [0, 18.0, 0],
    keyIndicators: [
      'Tinggi kolom asap meningkat dari 50 meter menjadi ratusan meter ke langit.',
      'Warna asap berubah dari putih uap air bersih menjadi putih kelabu tebal.',
      'Tekanan semburan dari kawah terlihat bertenaga dan berbentuk kolom silinder tegak.'
    ]
  },
  {
    id: 'perubahan_suhu',
    icon: '🌡️',
    title: 'Perubahan Suhu',
    scientificTerm: 'Anomali Termal Panas Bumi',
    shortDesc: 'Suhu air danau kawah, solfatara, dan mata air lereng mengalami kenaikan nyata.',
    fullExplanation: 'Panas dari kantung magma yang mendesak ke atas dihantarkan ke lapisan batuan permukaan dan sistem hidrotermal. Akibatnya, air tanah memanas, danau kawah mendidih, dan mata air di lereng gunung suhunya meningkat drastis.',
    observationMethod: 'Pemindaian suhu permukaan dari satelit dan pengukuran berkala di lapangan.',
    instrument: 'Kamera Termal Inframerah (Thermal Cam) & Termokopel Digital Tahan Asam',
    targetCameraPreset: 'crater',
    targetMarkerId: 'kawah',
    highlightCoordinates: [0, 14.8, 0],
    keyIndicators: [
      'Suhu danau kawah naik melampaui batas normal (misal dari 40°C menjadi di atas 70°C).',
      'Mata air dingin di lereng gunung terasa menghangat atau bahkan mengering.',
      'Vegetasi di sekitar kawah menguning layu akibat suhu tanah yang meningkat.'
    ]
  },
  {
    id: 'perubahan_bentuk',
    icon: '🏔️',
    title: 'Perubahan Bentuk Gunung',
    scientificTerm: 'Deformasi & Inflasi Tubuh Gunung',
    shortDesc: 'Lereng gunung menggembung sedikit akibat tekanan volume magma di bawah tanah.',
    fullExplanation: 'Ketika magma baru terus mengisi saluran dan kantung magma, tubuh gunung berapi akan meregang dan menggembung seperti balon yang ditiup (inflasi). Fenomena ini tidak mudah dilihat dengan mata telanjang, tetapi terbaca jelas oleh sensor presisi.',
    observationMethod: 'Mengukur sudut kemiringan lereng mikro-radian dan jarak antar titik geodetik.',
    instrument: 'Tiltmeter Elektronik & GPS Geodetik Kontinu PVMBG',
    targetCameraPreset: 'flank',
    targetMarkerId: 'strata',
    highlightCoordinates: [-4.8, 5.2, 0],
    keyIndicators: [
      'Data tiltmeter menunjukkan grafik kenaikan sudut kemiringan lereng secara kontinu.',
      'Jarak vertikal dan horizontal titik GPS pada tubuh gunung bergeser beberapa milimeter/sentimeter.',
      'Tekanan magma yang tertahan di balik kubah batuan memicu rekahan baru di permukaan.'
    ]
  },
  {
    id: 'aktivitas_kawah',
    icon: '🪨',
    title: 'Perubahan Aktivitas di Kawah',
    scientificTerm: 'Morfologi Kubah Lava & Freatik',
    shortDesc: 'Munculnya letupan freatik kecil, guguran batu pijar, atau pertumbuhan kubah lava baru.',
    fullExplanation: 'Di area kawah aktif, magma kental yang mencapai bibir saluran mulai membentuk kubah lava membara. Letupan uap (freatik) dapat melontarkan batu-batu kecil, dan guguran lava pijar menandakan material cair terus bertambah di puncak.',
    observationMethod: 'Pengamatan langsung via drone, radar satelit SAR, dan sensor visual termal malam.',
    instrument: 'Drone Pengawas Tahan Gas Belerang & Radar Citra Satelit InSAR',
    targetCameraPreset: 'crater',
    targetMarkerId: 'kawah',
    highlightCoordinates: [0, 15.2, 0],
    keyIndicators: [
      'Guguran lava pijar dan letupan gas kecil terlihat terutama pada malam hari.',
      'Volume kubah lava di tengah kawah bertambah besar secara signifikan.',
      'Muncul lubang hembusan solfatara baru di dinding kaldera kawah.'
    ]
  }
];

// 4 Tahap Simulasi Aktivitas Berurutan (Normal -> Meningkat -> Tinggi -> Erupsi)
export const STEPPED_SIMULATION_STAGES: SimulationStageInfo[] = [
  {
    step: 1,
    state: 'NORMAL',
    title: 'Kondisi Normal',
    statusText: 'STATUS: AKTIVITAS NORMAL',
    statusBadge: 'LEVEL I • AKTIVITAS NORMAL',
    statusColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgLight: 'bg-emerald-950/60',
    shortExplanation: 'Gunung berada dalam kondisi relatif tenang. Aktivitas vulkanik tetap perlu dipantau oleh pihak berwenang.',
    visualChanges: [
      'Asap/uap sangat sedikit atau tipis menyerupai kabut putih tenang.',
      'Tidak ada lelehan lava di kawah maupun di lereng gunung.',
      'Lingkungan alam asri, pohon berdiri tenang ditiup angin sepoi-sepoi.',
      'Kawanan burung terbang melingkar santai di udara bebas.',
      'Satwa liar (rusa/kancil) tenang mencari makan di rerumputan lereng bawah.',
      'Tidak ada efek getaran pada tanah maupun kamera pengamatan.'
    ],
    durationSeconds: 6
  },
  {
    step: 2,
    state: 'WASPADA',
    title: 'Peningkatan Aktivitas',
    statusText: 'STATUS: AKTIVITAS MENINGKAT',
    statusBadge: 'LEVEL II • AKTIVITAS MENINGKAT (WASPADA)',
    statusColor: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgLight: 'bg-amber-950/60',
    shortExplanation: 'Beberapa perubahan dapat menyertai peningkatan aktivitas vulkanik. Pemantauan ilmiah diperlukan untuk menentukan tingkat aktivitas gunung.',
    visualChanges: [
      'Frekuensi atau intensitas getaran visual halus mulai terdeteksi pada instrumen.',
      'Asap dan uap solfatara dari kawah mulai terlihat lebih jelas dan aktif membubung.',
      'Emisi gas vulkanik divisualisasikan semakin aktif mengepul dari lubang fumarol.',
      'Area sekitar kawah terlihat lebih aktif dengan pendaran hangat samar di bagian dasar.',
      'Kawanan burung mulai meninggalkan area sekitar puncak gunung sebagai respon alami.',
      'Dedaunan pohon di sekitar lereng bergoyang sedikit lebih aktif tertiup hembusan gas.'
    ],
    warningNote: 'Catatan Edukasi: Peningkatan aktivitas tidak berarti gunung pasti akan meletus seketika. Ahli vulkanologi menganalisis tren data berkala sebelum mengambil kesimpulan.',
    durationSeconds: 7
  },
  {
    step: 3,
    state: 'SIAGA',
    title: 'Menjelang Erupsi',
    statusText: 'STATUS: AKTIVITAS TINGGI',
    statusBadge: 'LEVEL III • AKTIVITAS TINGGI (SIAGA)',
    statusColor: 'text-orange-400',
    borderColor: 'border-orange-500/40',
    bgLight: 'bg-orange-950/60',
    shortExplanation: 'Pada simulasi ini, perubahan visual menunjukkan aktivitas vulkanik yang semakin tinggi. Kondisi nyata gunung berapi harus ditentukan berdasarkan pengamatan dan data dari lembaga berwenang.',
    visualChanges: [
      'Asap dari kawah menjadi jauh lebih tebal, berwarna kelabu gelap dan membubung tinggi ke angkasa.',
      'Partikel kecil abu dan lapili mulai terlontar keluar dari lubang kawah.',
      'Gunung mengalami getaran visual secara perlahan (tremor terus menerus terasa pada kamera).',
      'Cahaya merah/oranye membara mulai terlihat jelas di dalam kawah menandakan magma mendekati permukaan.',
      'Lava pijar mulai terbentuk dan menekan kubah di bibir kawah.',
      'Awan dan kepulan asap bergerak sangat aktif ditiup dorongan gas bertekanan tinggi.',
      'Burung telah menjauh terbang tinggi meninggalkan area gunung berapi.',
      'Satwa liar (rusa/kancil) mulai bergerak lari menjauh dari lereng menuju zona pinggir yang aman.',
      'Efek suara gemuruh magma di dalam tanah terdengar perlahan melalui audio simulator.'
    ],
    warningNote: 'Penilaian Ilmiah: Di tingkat Siaga, masyarakat diminta mengosongkan zona bahaya radius tertentu dan bersiap jika status dinaikkan menjadi Awas.',
    durationSeconds: 8
  },
  {
    step: 4,
    state: 'ERUPTION',
    title: 'Erupsi Utama',
    statusText: 'STATUS: ERUPSI',
    statusBadge: 'LEVEL IV • ERUPSI (AWAS)',
    statusColor: 'text-red-400',
    borderColor: 'border-red-500/50',
    bgLight: 'bg-red-950/70',
    shortExplanation: 'Erupsi terjadi ketika tekanan gas dan volume magma meluap keluar dari saluran utama, melepaskan energi dahsyat ke atmosfer.',
    visualChanges: [
      'Ledakan material piroklastik melontarkan bom vulkanik panas tinggi ke udara.',
      'Kolom abu vulkanik hitam pekat raksasa membubung tinggi menembus troposfer.',
      'Endapan abu vulkanik menyebar dan jatuh menyelimuti area sekitar lereng.',
      'Lelehan lava pijar merah menyala keluar dari kawah dan lereng mengalir deras menuruni lembah.',
      'Pendaran cahaya panas intens menyinari kawah dan lereng aliran lava.',
      'Getaran tanah (seismik) sangat kuat mengguncang seluruh tubuh gunung dan kamera.',
      'Seluruh satwa liar dan burung telah menyelamatkan diri ke batas luar radius aman.',
      'Dentuman suara letusan dan gemuruh dahsyat membahana.'
    ],
    warningNote: 'Peringatan Resmi: Zona bahaya harus steril total. Warga wajib mengikuti arahan evakuasi PVMBG dan BPBD ke pos pengungsian.',
    durationSeconds: 10
  }
];

// Edukasi Resmi Penyangkalan (Disclaimer) Sesuai Ketentuan Peringatan Edukasi
export const OFFICIAL_VOLCANO_DISCLAIMER = 
  "Simulasi ini dibuat untuk tujuan pembelajaran. Perubahan visual dalam simulasi bukan alat untuk memprediksi waktu terjadinya erupsi. Penilaian aktivitas gunung berapi harus berdasarkan pemantauan ilmiah dan informasi resmi dari lembaga berwenang (PVMBG / Badan Geologi Kementerian ESDM).";
