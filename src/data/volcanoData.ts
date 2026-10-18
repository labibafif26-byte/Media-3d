/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarkerItem, EducationalSection, Mission, BadgeItem } from '../types';

export const VOLCANO_MARKERS: MarkerItem[] = [
  {
    id: 'kawah',
    name: 'Kawah Utama (Crater)',
    category: 'Puncak Gunung',
    position: [0, 14.5, 0],
    summary: 'Mulut cekungan terbuka di puncak gunung tempat keluarnya asap, gas, abu, dan lelehan lava.',
    simpleExplanation: 'Kawah adalah seperti "pintu keluar" di puncak gunung. Dari lubang inilah asap putih, debu abu, dan cairan panas lava keluar ke alam bebas.',
    description: 'Kawah merupakan depresi melingkar di permukaan bumi yang terbentuk dari lubang ventilasi vulkanik. Di kawah inilah material gas fumarol dan magma cair berinteraksi langsung dengan atmosfer.',
    metrics: [
      { label: 'Suhu Permukaan', value: '450°C - 800°C' },
      { label: 'Kedalaman Kawah', value: '180 meter' },
      { label: 'Emisi Gas Utama', value: 'SO₂, H₂O, CO₂' }
    ]
  },
  {
    id: 'vent',
    name: 'Saluran Magma (Vent / Pipa Kepundan)',
    category: 'Struktur Dalam',
    position: [0, 7.5, 0.5],
    summary: 'Pipa lorong utama yang mengalirkan magma cair dari dapur magma menuju ke puncak kawah.',
    simpleExplanation: 'Pipa saluran ini seperti sedotan raksasa di dalam gunung. Magma cair yang sangat panas didorong naik lewat saluran ini menuju kawah!',
    description: 'Saluran magma (conduit) berperan seperti pipa penekan bertekanan tinggi. Selama magma naik, gas-gas terlarut mulai mengalami dekompresi membentuk gelembung (vesikulasi).',
    metrics: [
      { label: 'Diameter Saluran', value: '12 - 25 meter' },
      { label: 'Tekanan Magma', value: 'Sangat Tinggi (> 150 MPa)' },
      { label: 'Sifat Aliran', value: 'Dorongan Gas Kuat' }
    ]
  },
  {
    id: 'chamber',
    name: 'Dapur Magma (Magma Chamber)',
    category: 'Reservoir Bawah Tanah',
    position: [0, -1, 0],
    summary: 'Kolam batuan cair raksasa yang sangat panas di bawah kerak bumi tempat magma berkumpul.',
    simpleExplanation: 'Dapur magma adalah "wadah raksasa" yang terletak jauh di dalam bumi. Di sinilah batuan meleleh karena suhu ribuan derajat celcius sebelum meletus.',
    description: 'Dapur magma terletak beberapa kilometer di bawah permukaan. Tekanan akumulasi gas dan pengisian magma baru dari mantel bumi menjadi pemicu utama kenaikan magma ke permukaan.',
    metrics: [
      { label: 'Kedalaman Rerata', value: '3 - 8 km di bawah tanah' },
      { label: 'Suhu Magma', value: '1.050°C - 1.250°C' },
      { label: 'Kondisi Batuan', value: 'Cair Meleleh & Berpijar' }
    ]
  },
  {
    id: 'lava',
    name: 'Aliran Lava (Lava Flow)',
    category: 'Material Vulkanik',
    position: [3.8, 8.5, 3.8],
    summary: 'Lelehan batuan pijar bersuhu panas yang menuruni lereng gunung api.',
    simpleExplanation: 'Ketika magma sudah keluar ke permukaan dan menuruni lereng, namanya berubah menjadi lava! Warnanya merah menyala dan sangat panas.',
    description: 'Lava bersuhu sangat tinggi mengalir melalui lembah alami di lereng gunung. Kecepatannya dipengaruhi oleh kekentalan lelehan dan kemiringan lereng topografi.',
    metrics: [
      { label: 'Suhu Aliran', value: '850°C - 1.100°C' },
      { label: 'Warna Saat Panas', value: 'Merah Oranye Terang' },
      { label: 'Setelah Dingin', value: 'Membatu Menjadi Andesit/Basalt' }
    ]
  },
  {
    id: 'abu',
    name: 'Awan Abu Vulkanik (Ash Cloud)',
    category: 'Material Letusan',
    position: [0, 19.5, 0],
    summary: 'Kepulan debu halus batuan dan kaca vulkanik yang disemburkan tinggi ke angkasa.',
    simpleExplanation: 'Abu vulkanik bukanlah abu biasa seperti sisa bakaran kayu, melainkan pecahan halus batuan beku yang runcing dan bisa terbawa angin sampai jauh!',
    description: 'Kolom erupsi abu membubung ke troposfer akibat ekspansi gas yang eksplosif. Abu ini sangat subur untuk tanaman setelah beberapa tahun mengendap.',
    metrics: [
      { label: 'Tinggi Semburan', value: '1 - 15 km ke langit' },
      { label: 'Sifat Debu', value: 'Kaya mineral silika & hara tanah' },
      { label: 'Pencegahan', value: 'Gunakan masker & kacamata pelindung' }
    ]
  },
  {
    id: 'strata',
    name: 'Lereng Gunung (Flanks & Strata)',
    category: 'Badan Gunung',
    position: [-4.8, 5.2, 0],
    summary: 'Tubuh gunung yang terbentuk dari tumpukan lapisan lava beku dan abu selama ribuan tahun.',
    simpleExplanation: 'Gunung bertambah tinggi dan besar dari letusan demi letusan yang menumpuk lava beku dan bebatuan lapis demi lapis.',
    description: 'Stratovolcano memiliki lereng berlapis-lapis hasil erupsi efusif (aliran lava) berselingan dengan erupsi eksplosif (endapan abu tefra).',
    metrics: [
      { label: 'Tipe Gunung', value: 'Strato / Kerucut Berlapis' },
      { label: 'Kesuburan Tanah', value: 'Sangat Subur untuk Pertanian' },
      { label: 'Kemiringan Lereng', value: '25° - 40°' }
    ]
  },
  {
    id: 'gempa',
    name: 'Stasiun Seismograf (Pos Pantau)',
    category: 'Alat Pengamat',
    position: [-17.0, 2.4, 11.0],
    summary: 'Alat perekam getaran bumi yang dipasang petugas untuk mendeteksi tanda-tanda magma bergerak.',
    simpleExplanation: 'Petugas PVMBG menaruh alat ini di lereng untuk "mendengarkan" detak jantung gunung. Jika gempa makin sering, gunung sedang bersiap meletus!',
    description: 'Seismometer mencatat getaran tremor mikroseismik yang ditimbulkan oleh desakan magma menerobos rekahan batuan bawah tanah.',
    metrics: [
      { label: 'Sinyal Tremor', value: 'Frekuensi 1.0 - 5.0 Hz' },
      { label: 'Fungsi Utama', value: 'Peringatan Dini Bencana' },
      { label: 'Petugas Pemantau', value: 'Pengamat Pos PVMBG' }
    ]
  },
  {
    id: 'hewan',
    name: 'Satwa Liar Lereng (Rusa & Burung)',
    category: 'Lingkungan Hidup',
    position: [-14.5, 2.0, 0],
    summary: 'Hewan yang hidup di hutan lereng gunung dan memiliki naluri alami mendeteksi bahaya.',
    simpleExplanation: 'Hewan seperti rusa dan burung bisa merasakan panas dan getaran tanah lebih cepat daripada manusia. Mereka akan lari menuruni lereng saat bahaya mendekat!',
    description: 'Respon instingtif satwa liar yang melarikan diri ke lembah bawah merupakan tanda pendukung bagi penduduk lereng bahwa kondisi gunung menghangat.',
    metrics: [
      { label: 'Perilaku Normal', value: 'Tenang mencari makan di hutan' },
      { label: 'Perilaku Waspada', value: 'Burung terbang & kawanan rusa lari' },
      { label: 'Penyebab', value: 'Hawa panas & getaran tanah halus' }
    ]
  },
  {
    id: 'sungai',
    name: 'Sungai & Aliran Lahar Tropis',
    category: 'Hidrologi Lereng',
    position: [7.0, 0.6, 9.0],
    summary: 'Aliran air tawar yang membawa sedimen kaya mineral vulkanik dari lereng menuju dataran rendah.',
    simpleExplanation: 'Sungai di lereng gunung sangat subur untuk pertanian. Namun saat musim hujan setelah letusan, sungai ini bisa menjadi jalur aliran lahar dingin yang berbahaya!',
    description: 'Sistem hidrologi lereng gunung api mengalirkan air hujan dan endapan pasir abu vulkanik. Di masa tenang, sungai ini menjadi sumber kehidupan ekosistem lereng.',
    metrics: [
      { label: 'Fungsi Alami', value: 'Daerah Aliran Sungai (DAS) Subur' },
      { label: 'Potensi Bahaya', value: 'Jalur Lahar Hujan Pasca Erupsi' },
      { label: 'Kandungan', value: 'Kaya Mineral Hara Fosfor & Silika' }
    ]
  },
  {
    id: 'hutan',
    name: 'Hutan Hujan Tropis Lereng',
    category: 'Ekosistem Lereng',
    position: [-16.0, 2.2, -6.0],
    summary: 'Vegetasi lereng lebat yang tumbuh subur berkat tanah andosol vulkanik yang kaya unsur hara.',
    simpleExplanation: 'Pohon-pohon di lereng gunung berfungsi sebagai peredam erosi dan penyimpan cadangan air tanah. Jika pepohonan mulai layu menguning, itu pertanda suhu tanah lereng meningkat!',
    description: 'Ekosistem hutan pegunungan menjadi habitat satwa liar dan zona tangkapan air alami yang melindungi desa-desa di dataran bawah dari ancaman longsor.',
    metrics: [
      { label: 'Tipe Vegetasi', value: 'Hutan Hujan Pegunungan Tropis' },
      { label: 'Jenis Tanah', value: 'Andosol Vulkanik Subur' },
      { label: 'Peran Ekologis', value: 'Serapan Air & Penahan Erosi Lereng' }
    ]
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'misi-1',
    stepNumber: '01',
    title: 'Kenalan dengan Gunung Api',
    description: 'Pelajari apa itu gunung api dan amati pemandangan lereng alam tropis yang subur.',
    targetCount: 1,
    currentCount: 0,
    isUnlocked: true,
    isCompleted: false,
    rewardBadgeId: 'badge-pemula',
    actionRoute: 'explore_3d',
    targetPreset: 'default'
  },
  {
    id: 'misi-2',
    stepNumber: '02',
    title: 'Jelajah Bagian Gunung',
    description: 'Gunakan mode 3D untuk menemukan Kawah, Saluran Pipa, dan Dapur Magma.',
    targetCount: 4,
    currentCount: 0,
    isUnlocked: false,
    isCompleted: false,
    rewardBadgeId: 'badge-anatomi',
    actionRoute: 'explore_3d',
    targetPreset: 'crater'
  },
  {
    id: 'misi-3',
    stepNumber: '03',
    title: 'Pelajari Proses Erupsi',
    description: 'Amati bagaimana magma naik dari bawah tanah hingga menyembur menjadi lava dan abu.',
    targetCount: 1,
    currentCount: 0,
    isUnlocked: false,
    isCompleted: false,
    rewardBadgeId: 'badge-erupsi',
    actionRoute: 'lab'
  },
  {
    id: 'misi-4',
    stepNumber: '04',
    title: 'Kenali Dampak & Satwa',
    description: 'Lihat bagaimana satwa liar merespon bahaya dan pahami manfaat tanah vulkanik.',
    targetCount: 1,
    currentCount: 0,
    isUnlocked: false,
    isCompleted: false,
    rewardBadgeId: 'badge-ekologi',
    actionRoute: 'explore_3d',
    targetPreset: 'wildlife'
  },
  {
    id: 'misi-5',
    stepNumber: '05',
    title: 'Tantangan Kuis Cilik',
    description: 'Selesaikan tantangan pertanyaan seru untuk menguji pengetahuan barumu!',
    targetCount: 4,
    currentCount: 0,
    isUnlocked: false,
    isCompleted: false,
    rewardBadgeId: 'badge-juara',
    actionRoute: 'missions'
  },
  {
    id: 'misi-6',
    stepNumber: '06',
    title: 'Hasil & Piagam Petualang',
    description: 'Kumpulkan semua lencana dan jadilah Ahli Cilik Gunung Api Indonesia!',
    targetCount: 1,
    currentCount: 0,
    isUnlocked: false,
    isCompleted: false,
    rewardBadgeId: 'badge-master',
    actionRoute: 'achievements'
  }
];

export const BADGE_DEFINITIONS: BadgeItem[] = [
  {
    id: 'badge-pemula',
    title: 'Penjelajah Pemula',
    description: 'Berhasil memulai langkah pertama di dunia Petualangan Gunung Api!',
    iconName: 'Sparkles',
    isEarned: false
  },
  {
    id: 'badge-anatomi',
    title: 'Ahli Anatomi 3D',
    description: 'Mengenal kawah, pipa magma, dan dapur batuan cair dengan sempurna.',
    iconName: 'Layers',
    isEarned: false
  },
  {
    id: 'badge-xray',
    title: 'Mata Sinar-X',
    description: 'Mengaktifkan mode X-Ray untuk melihat rahasia magma di dalam perut bumi.',
    iconName: 'Eye',
    isEarned: false
  },
  {
    id: 'badge-erupsi',
    title: 'Peneliti Erupsi',
    description: 'Berhasil mensimulasikan proses pelepasan energi vulkanik di laboratorium.',
    iconName: 'Flame',
    isEarned: false
  },
  {
    id: 'badge-ekologi',
    title: 'Sahabat Satwa Lereng',
    description: 'Mengamati kawanan rusa dan burung yang memiliki naluri peringatan dini.',
    iconName: 'Bird',
    isEarned: false
  },
  {
    id: 'badge-juara',
    title: 'Bintang Kuis Vulkanik',
    description: 'Menjawab seluruh pertanyaan kuis dan tantangan materi dengan cemerlang.',
    iconName: 'Award',
    isEarned: false
  },
  {
    id: 'badge-master',
    title: 'Ahli Gunung Api Cilik',
    description: 'Menuntaskan seluruh rangkaian misi eksplorasi dan keselamatan mandiri!',
    iconName: 'GraduationCap',
    isEarned: false
  }
];

export const INDONESIA_VOLCANOES = [
  {
    name: 'Gunung Merapi',
    island: 'Jawa Tengah & D.I. Yogyakarta',
    height: '2.968 mdpl',
    status: 'Level III (Siaga)',
    fact: 'Salah satu gunung api teraktif di dunia dengan siklus erupsi khas kubah lava dan awan panas guguran (Wedhus Gembel).'
  },
  {
    name: 'Gunung Bromo',
    island: 'Jawa Timur',
    height: '2.329 mdpl',
    status: 'Level II (Waspada)',
    fact: 'Terkenal dengan kaldera lautan pasir raksasa seluas 10 km persegi dan upacara adat Yadnya Kasada suku Tengger.'
  },
  {
    name: 'Gunung Krakatau (Anak Krakatau)',
    island: 'Selat Sunda (Lampung / Banten)',
    height: '157 mdpl',
    status: 'Level III (Siaga)',
    fact: 'Lahir di bekas kaldera letusan legendaris Krakatau 1883 yang suaranya terdengar hingga ribuan kilometer.'
  },
  {
    name: 'Gunung Sinabung',
    island: 'Sumatera Utara',
    height: '2.460 mdpl',
    status: 'Level II (Waspada)',
    fact: 'Setelah tidur selama lebih dari 400 tahun, gunung ini kembali bangun dan aktif meletus sejak tahun 2010.'
  },
  {
    name: 'Gunung Rinjani',
    island: 'Lombok, Nusa Tenggara Barat',
    height: '3.726 mdpl',
    status: 'Level II (Waspada)',
    fact: 'Memiliki danau kawah indah berwarna biru toska bernama Segara Anak dengan kerucut Gunung Barujari di tengahnya.'
  },
  {
    name: 'Gunung Lokon',
    island: 'Sulawesi Utara (Tomohon)',
    height: '1.580 mdpl',
    status: 'Level II (Waspada)',
    fact: 'Kawah aktifnya bernama Kawah Tompaluan yang berada di celah antara Gunung Lokon dan Gunung Empung.'
  }
];

export const DID_YOU_KNOW_FACTS = [
  'Abu vulkanik bukanlah debu biasa! Abu ini adalah serpihan kaca dan batuan halus yang kaya mineral, sehingga membuat tanah pertanian di sekitarnya sangat subur.',
  'Indonesia berada di Jalur Cincin Api Pasifik (Ring of Fire) dan memiliki lebih dari 120 gunung api aktif.',
  'Saat magma masih berada di dalam tanah, namanya adalah Magma. Begitu mengalir keluar ke permukaan, namanya berubah menjadi Lava!',
  'Hewan seperti burung dan rusa sering kali kabur menuruni lereng berhari-hari sebelum letusan karena mereka bisa merasakan getaran tanah yang sangat halus.',
  'Suhu lava yang baru keluar dari kawah bisa mencapai lebih dari 1.000 derajat Celcius, sanggup melelehkan logam!'
];

export const SAFETY_GUIDELINES = {
  before: [
    { title: 'Kenali Tanda Bahaya', desc: 'Dengarkan arahan dari petugas PVMBG dan kepala desa jika status gunung mulai naik.' },
    { title: 'Siapkan Tas Siaga', desc: 'Simpan dokumen penting, air minum, makanan kering, senter, dan obat-obatan pribadi dalam satu tas mudah dibawa.' },
    { title: 'Hafalkan Jalur Evakuasi', desc: 'Ketahui letak rambu tanda evakuasi menuju tempat pengungsian yang aman di luar radius bahaya.' }
  ],
  during: [
    { title: 'Jauhi Radius Bahaya Segera', desc: 'Ikuti instruksi petugas dan evakuasi diri bersama keluarga dengan tenang tanpa panik.' },
    { title: 'Lindungi Pernapasan & Mata', desc: 'Gunakan masker atau kain basah untuk menutup hidung serta kacamata agar terhindar dari serbuan abu vulkanik.' },
    { title: 'Jauhi Aliran Sungai', desc: 'Hindari lembah sungai di lereng karena aliran lahar dingin dan awan panas mengalir sangat cepat di sana.' }
  ],
  after: [
    { title: 'Tunggu Status Aman', desc: 'Jangan terburu-buru pulang ke rumah sebelum petugas BPBD menyatakan kondisi sudah benar-benar aman.' },
    { title: 'Bersihkan Atap Rumah', desc: 'Abu vulkanik yang basah sangat berat dan bisa merobohkan atap jika tidak dibersihkan dengan hati-hati.' },
    { title: 'Tetap Gunakan Masker', desc: 'Debu abu yang beterbangan masih bisa mengganggu saluran napas selama beberapa hari setelah letusan.' }
  ]
};

export const PVMBG_STATUS_LEVELS = [
  {
    level: 'LEVEL I (NORMAL)',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
    criteria: 'Aktivitas dasar visual, seismik, dan kawah berada dalam batas aman normal. Masyarakat bisa beraktivitas tenang.'
  },
  {
    level: 'LEVEL II (WASPADA)',
    color: 'amber',
    badgeClass: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
    criteria: 'Mulai terdeteksi peningkatan getaran gempa dan asap kawah. Masyarakat dilarang mendekat ke bibir kawah aktif.'
  },
  {
    level: 'LEVEL III (SIAGA)',
    color: 'orange',
    badgeClass: 'bg-orange-500/15 text-orange-700 border-orange-500/30',
    criteria: 'Aktivitas vulkanik meningkat sangat nyata. Letusan utama bisa terjadi sewaktu-waktu. Warga bersiap mengungsi.'
  },
  {
    level: 'LEVEL IV (AWAS)',
    color: 'red',
    badgeClass: 'bg-red-500/15 text-red-700 border-red-500/30',
    criteria: 'Letusan dahsyat sedang atau segera terjadi! Seluruh warga di dalam radius bahaya wajib segera mengungsi total.'
  }
];

export const EDUCATIONAL_SIGNS: EducationalSection[] = [
  {
    id: 'gempa',
    title: '1. Gempa Vulkanik (Getaran Tanah)',
    subtitle: 'Getaran Tremor Akibat Gerakan Magma',
    badge: 'Getaran Tanah',
    content: 'Sebelum gunung meletus, magma yang panas bergerak mendesak batuan di dalam tanah. Gerakan ini menimbulkan getaran halus hingga gempa berulang kali yang dicatat oleh alat seismograf.',
    scientificDetails: [
      'Gempa vulkanik terjadi karena rekahan batuan bawah tanah yang terdorong magma naik.',
      'Tremor terus menerus menandakan cairan magma sedang mengalir deras di saluran kepundan.',
      'Sinyal direkam stasiun seismograf pos pengamatan PVMBG 24 jam non-stop.'
    ],
    fieldObservations: [
      'Warga di sekitar lereng merasakan getaran lembut di lantai dan tanah.',
      'Kaca jendela berderak dan terdengar suara gemuruh pelan dari perut bumi.'
    ]
  },
  {
    id: 'suhu',
    title: '2. Peningkatan Suhu Udara & Tanah',
    subtitle: 'Hawa Panas Dekat Kawah',
    badge: 'Hawa Panas',
    content: 'Karena magma bersuhu ribuan derajat naik kian dekat ke permukaan, hawa di sekitar puncak menjadi jauh lebih panas. Tanaman menguning dan mata air menjadi hangat.',
    scientificDetails: [
      'Panas dari dapur magma merambat menghangatkan air tanah dan batuan permukaan.',
      'Kamera inframerah satelit dapat mendeteksi titik panas (hotspot) di kawah gunung.',
      'Peningkatan suhu kawah bisa mencapai ratusan derajat Celsius.'
    ],
    fieldObservations: [
      'Pohon dan semak-semak di lereng atas mengering dan layu terbakar hawa panas.',
      'Mata air yang biasanya dingin berubah menjadi suam-suam kuku hingga panas.'
    ]
  },
  {
    id: 'gas',
    title: '3. Hembusan Gas & Asap Kawah',
    subtitle: 'Bau Belerang & Kepulan Asap Tebal',
    badge: 'Gas Kawah',
    content: 'Gas vulkanik seperti belerang menyembur keluar lebih banyak dari lubang kawah. Asap putih tipis yang biasanya keluar berubah menjadi kepulan abu kelabu tebal yang membubung tinggi ke langit.',
    scientificDetails: [
      'Gas utama terdiri dari uap air (H₂O), gas belerang (SO₂), dan karbon dioksida (CO₂).',
      'Gas belerang berbau menyengat seperti telur busuk dan terasa perih di mata.',
      'Petugas mengukur jumlah gas yang keluar setiap hari untuk memprediksi letusan.'
    ],
    fieldObservations: [
      'Bau belerang yang tajam tercium terbawa angin hingga ke desa-desa di lereng.',
      'Kepulan asap kawah tampak semakin tebal, gelap, dan menjulang tinggi.'
    ]
  },
  {
    id: 'air',
    title: '4. Perubahan Mata Air Lereng',
    subtitle: 'Mata Air Mengering atau Keruh',
    badge: 'Sumber Air',
    content: 'Mata air dan sumur warga di lereng gunung sering kali mengering tiba-tiba karena rekahan batuan menyedot air ke dalam, atau sebaliknya air menjadi sangat keruh dan berbau belerang.',
    scientificDetails: [
      'Panas magma dapat mendidihkan air tanah bawah permukaan.',
      'Rekahan baru yang terbuka akibat desakan magma mengalihkan aliran air tanah.',
      'Tingkat keasaman (pH) air turun drastis menjadi sangat asam.'
    ],
    fieldObservations: [
      'Air sumur warga berubah keruh kecokelatan dan berbau menyengat.',
      'Debit sumber mata air berkurang mendadak atau air terasa hangat di tangan.'
    ]
  },
  {
    id: 'hewan',
    title: '5. Satwa Liar Melarikan Diri',
    subtitle: 'Naluri Alami Hewan Hutan',
    badge: 'Satwa Lereng',
    content: 'Hewan seperti rusa, kera, dan burung memiliki pendengaran dan kepekaan luar biasa terhadap getaran halus dan hawa panas. Mereka akan berbondong-bondong lari menuruni lereng ke tempat yang lebih aman.',
    scientificDetails: [
      'Hewan peka terhadap gelombang infrasonik (suara berfrekuensi sangat rendah di bawah 20 Hz).',
      'Naluri bertahan hidup membuat hewan meninggalkan sarangnya di hutan puncak.',
      'Fenomena ini menjadi salah satu kearifan lokal peringatan dini bagi masyarakat lereng.'
    ],
    fieldObservations: [
      'Kawanan rusa terlihat keluar dari hutan dan berlari menuju kebun warga di bawah.',
      'Burung-burung beterbangan berkelompok menjauhi arah puncak kawah.'
    ]
  },
  {
    id: 'deformasi',
    title: '6. Tubuh Gunung Menggembung (Inflasi)',
    subtitle: 'Pembengkakan Lereng Gunung',
    badge: 'Bentuk Gunung',
    content: 'Saat jutaan meter kubik magma mendesak ke atas, tubuh gunung api sebenarnya sedikit menggembung seperti balon yang ditiup! Alat sensor tiltmeter dapat mengukur pembengkakan ini.',
    scientificDetails: [
      'Proses pembengkakan ini disebut inflasi vulkanik.',
      'Setelah erupsi dan magma keluar, badan gunung akan mengempis kembali (deflasi).',
      'Dipantau menggunakan satelit GPS dan sensor kemiringan tanah berakurasi tinggi.'
    ],
    fieldObservations: [
      'Muncul rekahan atau retakan tanah baru di lereng gunung.',
      'Kubah batu di kawah terlihat semakin membesar dari hari ke hari.'
    ]
  },
  {
    id: 'lava',
    title: '7. Pijaran Merah di Puncak',
    subtitle: 'Kubah Lava & Guguran Batu Pijar',
    badge: 'Pijaran Api',
    content: 'Pada malam hari, puncak kawah tampak berpendar merah membara. Terkadang terdengar dentuman dan terlihat guguran batu pijar yang bergulingan menuruni jurang kawah.',
    scientificDetails: [
      'Cahaya merah adalah pancaran radiasi termal dari magma cair bersuhu di atas 800°C.',
      'Kubah lava yang rapuh di bibir kawah bisa runtuh menghasilkan awan panas guguran.',
      'Guguran lava pijar menandakan magma segar sudah mencapai permukaan luar kawah.'
    ],
    fieldObservations: [
      'Puncak gunung tampak menyala merah oranye terang di malam hari yang gelap.',
      'Terdengar suara gemertak dan gemuruh runtuhan batu dari bibir kawah.'
    ]
  }
];
