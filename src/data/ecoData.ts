/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OrganismItem, FoodChainStep, ExperimentScenario, QuizQuestion } from '../types';

export const ORGANISMS: OrganismItem[] = [
  {
    id: 'sun',
    name: 'Matahari',
    scientificName: 'Sol (Pusat Tata Surya)',
    role: 'Sumber Energi Utama',
    category: 'energi',
    trophicLevel: 0,
    energyPercent: '100% (Energi Awal)',
    energyKcal: 100000,
    food: 'Fusi Termonuklir Inti Bintang',
    predator: 'Tidak Ada',
    summary: 'Penyedia energi foton cahaya dan panas terbesar yang menggerakkan seluruh kehidupan di bumi.',
    description: 'Tanpa radiasi sinar matahari, produsen di muka bumi tidak dapat melakukan proses fotosintesis. Energi foton inilah yang diubah menjadi energi kimiawi dalam biomassa tumbuhan.',
    ecologicalFunction: 'Menyinari atmosfer, memicu siklus air, dan menyediakan gelombang cahaya tampak untuk sintesis makanan tumbuhan hijau.',
    funFact: 'Hanya sekitar 1-2% dari total energi sinar matahari yang berhasil diserap dan diubah oleh tumbuhan hijau menjadi energi biomassa.',
    position: [0, 16.5, -4],
    scale: [2.2, 2.2, 2.2],
    color: '#fbbf24',
    icon: '☀️',
    badgeBg: 'bg-amber-950/70',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300'
  },
  {
    id: 'rumput',
    name: 'Rumput Padang',
    scientificName: 'Cynodon dactylon',
    role: 'Produsen (Autotrof)',
    category: 'produsen',
    trophicLevel: 1,
    energyPercent: '100% (Tingkat Trofik 1)',
    energyKcal: 10000,
    food: 'Sinar Matahari, Air (H₂O) & CO₂',
    predator: 'Belalang, Ulat & Hewan Herbivora',
    summary: 'Tumbuhan hijau penghasil makanan mandiri melalui fotosintesis, fondasi piramida makanan.',
    description: 'Rumput berperan sebagai produsen primer (autotrof). Melalui klorofil, rumput mengikat karbon dioksida dan air menggunakan energi cahaya untuk memproduksi glukosa dan melepaskan oksigen segar.',
    ecologicalFunction: 'Menghasilkan oksigen, mencegah erosi tanah padang rumput, serta menjadi penyedia biomassa organik pertama bagi konsumen herbivora.',
    funFact: 'Rumput padang memiliki jaringan meristem basal yang memungkinkannya cepat tumbuh kembali meski pucuknya terus-menerus dimakan hewan herbivora.',
    position: [-4.5, 0.4, 3.5],
    scale: [1.3, 1.3, 1.3],
    color: '#22c55e',
    icon: '🌱',
    badgeBg: 'bg-emerald-950/70',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300'
  },
  {
    id: 'belalang',
    name: 'Belalang Padang',
    scientificName: 'Locusta migratoria',
    role: 'Konsumen I (Herbivora)',
    category: 'konsumen',
    trophicLevel: 2,
    energyPercent: '10% (Tingkat Trofik 2)',
    energyKcal: 1000,
    food: 'Daun Rumput Segar',
    predator: 'Katak Sawah & Burung Pemakan Serangga',
    summary: 'Serangga pemakan tumbuhan yang mentransfer energi kimiawi dari tumbuhan ke rantai konsumen.',
    description: 'Belalang adalah konsumen primer (Herbivora). Belalang memakan helai daun rumput hijau menggunakan mulut pengunyahnya. Sesuai hukum efisiensi energi 10%, hanya sekitar 10% energi rumput yang disimpan dalam tubuh belalang.',
    ecologicalFunction: 'Mengontrol laju pertumbuhan tanaman rumput dan menjadi sumber protein berlimpah bagi karnivora tingkat pertama.',
    funFact: 'Belalang memiliki kaki belakang yang kuat dengan sendi pengungkit yang mampu melompat sejauh 20 kali panjang tubuhnya sendiri untuk menghindari pemangsa.',
    position: [-2.2, 0.5, 1.2],
    scale: [0.9, 0.9, 0.9],
    color: '#84cc16',
    icon: '🦗',
    badgeBg: 'bg-lime-950/70',
    badgeBorder: 'border-lime-500/40',
    badgeText: 'text-lime-300'
  },
  {
    id: 'katak',
    name: 'Katak Sawah',
    scientificName: 'Fejervarya cancrivora',
    role: 'Konsumen II (Karnivora Kecil)',
    category: 'konsumen',
    trophicLevel: 3,
    energyPercent: '1% (Tingkat Trofik 3)',
    energyKcal: 100,
    food: 'Belalang, Jangkrik & Serangga Kecil',
    predator: 'Ular Rumput & Burung Kuntul',
    summary: 'Amfibi predator serangga yang aktif di sekitar perairan dan semak lembab.',
    description: 'Katak menempati konsumen sekunder (Karnivora tingkat I). Katak menggunakan penglihatan tajam dan lidah berlendir yang melesat secepat kilat untuk menyambar belalang yang sedang hinggap di dedaunan.',
    ecologicalFunction: 'Pengendali alami populasi hama serangga tanaman dan bioindikator kualitas kebersihan perairan lingkungan.',
    funFact: 'Lidah katak terhubung di bagian depan mulut (bukan pangkal belakang) dan mampu menarik beban hingga 1,4 kali berat tubuhnya dalam waktu kurang dari 0,07 detik.',
    position: [1.2, 0.45, 0.8],
    scale: [1.0, 1.0, 1.0],
    color: '#06b6d4',
    icon: '🐸',
    badgeBg: 'bg-cyan-950/70',
    badgeBorder: 'border-cyan-500/40',
    badgeText: 'text-cyan-300'
  },
  {
    id: 'ular',
    name: 'Ular Rumput',
    scientificName: 'Ptyas mucosa',
    role: 'Konsumen III (Karnivora Menengah)',
    category: 'predator',
    trophicLevel: 4,
    energyPercent: '0.1% (Tingkat Trofik 4)',
    energyKcal: 10,
    food: 'Katak Sawah, Kadal & Tikus',
    predator: 'Elang Jawa',
    summary: 'Reptil karnivora lincah yang menyergap mangsa tanpa suara di antara rerumputan tinggi.',
    description: 'Ular rumput bertindak sebagai konsumen tersier. Ular mendeteksi getaran dan aroma katak menggunakan lidah bercabangnya (organ Jacobson), lalu meluncur cepat untuk menelan mangsa bulat-bulat.',
    ecologicalFunction: 'Mencegah ledakan populasi amfibi dan hewan pengerat, menjaga stabilitas dinamika jaring-jaring makanan.',
    funFact: 'Rahang bawah ular terhubung oleh ligamen elastis fleksibel, memungkinkannya membuka mulut hingga 150 derajat untuk menelan mangsa yang jauh lebih besar dari kepalanya.',
    position: [3.8, 0.4, -0.6],
    scale: [1.1, 1.1, 1.1],
    color: '#f97316',
    icon: '🐍',
    badgeBg: 'bg-orange-950/70',
    badgeBorder: 'border-orange-500/40',
    badgeText: 'text-orange-300'
  },
  {
    id: 'elang',
    name: 'Elang Jawa',
    scientificName: 'Nisaetus bartelsi',
    role: 'Predator Puncak (Konsumen IV)',
    category: 'predator',
    trophicLevel: 5,
    energyPercent: '0.01% (Puncak Trofik)',
    energyKcal: 1,
    food: 'Ular Rumput, Burung Kecil & Kelinci',
    predator: 'Tidak Memiliki Predator Alami',
    summary: 'Penguasa udara puncak rantai makanan dengan cakar kokoh dan penglihatan teleskopik tajam.',
    description: 'Sebagai predator puncak (Apex Predator), elang tidak memiliki pemangsa alami dalam ekosistem. Elang mengintai ular dari atas ranting pohon tinggi atau saat melayang di angkasa, lalu menukik menyergap dengan kecepatan tinggi.',
    ecologicalFunction: 'Menyeleksi individu yang lemah dalam populasi mangsa dan menjaga kesehatan genetik seluruh komunitas ekosistem.',
    funFact: 'Mata elang memiliki kepadatan sel fotoreseptor 5 kali lipat lebih tinggi dari mata manusia, memungkinkannya melihat seekor ular dari ketinggian lebih dari 1.000 meter.',
    position: [1.5, 9.8, 2.5],
    scale: [1.4, 1.4, 1.4],
    color: '#ef4444',
    icon: '🦅',
    badgeBg: 'bg-rose-950/70',
    badgeBorder: 'border-rose-500/40',
    badgeText: 'text-rose-300'
  },
  {
    id: 'jamur',
    name: 'Jamur Dekomposer',
    scientificName: 'Agaricus & Fungi Saprofit',
    role: 'Pengurai (Dekomposer)',
    category: 'pengurai',
    trophicLevel: 6,
    energyPercent: 'Daur Ulang Nutrisi',
    energyKcal: 0,
    food: 'Bangkai Hewan, Daun Gugur & Sisa Organik',
    predator: 'Hewan Detritivor (Cacing Tanah)',
    summary: 'Pembersih alami bumi yang mengurai materi organik mati menjadi unsur hara penyubur tanah.',
    description: 'Ketika elang, ular, katak, belalang, atau rumput mati, jamur bersama bakteri menguraikan materi organik kompleks menjadi zat anorganik sederhana (nitrogen, fosfor, kalium) yang dikembalikan ke dalam tanah untuk diserap kembali oleh akar rumput.',
    ecologicalFunction: 'Menutup siklus materi dalam ekosistem (biogeokimia), memastikan nutrisi tidak habis tertimbun dan dapat digunakan kembali oleh produsen.',
    funFact: 'Hifa jamur di bawah tanah membentuk jaringan raksasa yang disebut miselium, yang bertindak seperti "internet alami" penghubung nutrisi antar akar tanaman di ekosistem.',
    position: [-5.8, 0.35, -2.5],
    scale: [1.1, 1.1, 1.1],
    color: '#a855f7',
    icon: '🍄',
    badgeBg: 'bg-purple-950/70',
    badgeBorder: 'border-purple-500/40',
    badgeText: 'text-purple-300'
  }
];

export const FOOD_CHAIN_STEPS: FoodChainStep[] = [
  {
    step: 1,
    title: 'Pancaran Energi Matahari',
    sourceId: 'sun',
    targetId: 'rumput',
    narration: 'Matahari memancarkan energi cahaya dan foton sebagai sumber energi primordial seluruh ekosistem.',
    energyTransferred: '100.000 kkal Radiasi Foton Surya',
    scientificExplanation: 'Energi cahaya matahari diterima oleh pigmen klorofil pada sel daun rumput untuk memulai reaksi terang fotosintesis.',
    cameraPosition: [-4, 14, 12],
    cameraTarget: [-2, 8, 0]
  },
  {
    step: 2,
    title: 'Fotosintesis oleh Produsen',
    sourceId: 'rumput',
    targetId: 'belalang',
    narration: 'Rumput menyerap energi surya dan mengubahnya menjadi energi kimia (glukosa) tersimpan dalam daun.',
    energyTransferred: '10.000 kkal Biomassa Organik (100% Tingkat I)',
    scientificExplanation: 'Tumbuhan hijau adalah satu-satunya organisme autotrof yang mampu mengikat energi anorganik menjadi bahan organik bernilai kalori.',
    cameraPosition: [-5.5, 3.5, 7.5],
    cameraTarget: [-3.5, 1.0, 2.5]
  },
  {
    step: 3,
    title: 'Herbivora Memakan Produsen',
    sourceId: 'belalang',
    targetId: 'katak',
    narration: 'Belalang memakan helai daun rumput dan menyerap nutrisi untuk tumbuh serta melompat.',
    energyTransferred: '1.000 kkal Energi Kimiawi (10% Tingkat II)',
    scientificExplanation: 'Sekitar 90% energi hilang sebagai panas metabolisme, respirasi, dan kotoran. Hanya 10% energi yang menjadi biomassa belalang (Hukum Lindeman 10%).',
    cameraPosition: [-2.5, 2.2, 4.2],
    cameraTarget: [-1.2, 0.8, 1.0]
  },
  {
    step: 4,
    title: 'Karnivora Kecil Memangsa Herbivora',
    sourceId: 'katak',
    targetId: 'ular',
    narration: 'Katak sawah menyambar belalang secara cepat menggunakan lidah panjang berperekat.',
    energyTransferred: '100 kkal Energi Tersimpan (1% Tingkat III)',
    scientificExplanation: 'Katak mendapatkan asupan protein dari belalang. Energi yang tersisa semakin kecil karena sebagian besar digunakan untuk melompat dan bernapas.',
    cameraPosition: [1.8, 2.0, 3.8],
    cameraTarget: [1.2, 0.6, 0.8]
  },
  {
    step: 5,
    title: 'Karnivora Menengah Menyergap Amfibi',
    sourceId: 'ular',
    targetId: 'elang',
    narration: 'Ular rumput meluncur di antara semak-semak dan menelan katak untuk mempertahankan energinya.',
    energyTransferred: '10 kkal Energi Tersimpan (0.1% Tingkat IV)',
    scientificExplanation: 'Ular adalah karnivora berdarah dingin (ektoterm) yang efisien dalam menyimpan kalori tetapi hanya menerima 10 kkal dari tingkat sebelumnya.',
    cameraPosition: [4.2, 2.2, 2.5],
    cameraTarget: [3.2, 0.7, -0.4]
  },
  {
    step: 6,
    title: 'Predator Puncak Menukik Menyambar',
    sourceId: 'elang',
    targetId: 'jamur',
    narration: 'Elang Jawa menukik tajam dari langit dengan kecepatan tinggi dan mencengkeram ular dengan cakar kuatnya.',
    energyTransferred: '1 kkal Energi Puncak (0.01% Tingkat V)',
    scientificExplanation: 'Sebagai predator puncak, elang membutuhkan wilayah perburuan (home range) yang sangat luas karena energi pada puncak piramida sangat terbatas.',
    cameraPosition: [2.5, 11.5, 8.5],
    cameraTarget: [1.5, 9.0, 2.0]
  },
  {
    step: 7,
    title: 'Penguraian Nutrisi oleh Jamur',
    sourceId: 'jamur',
    targetId: 'rumput',
    narration: 'Sisa-sisa organik dan bangkai diurai oleh jamur menjadi unsur hara yang menyuburkan tanah kembali untuk rumput.',
    energyTransferred: 'Daur Ulang Materi & Siklus Hara Mineral',
    scientificExplanation: 'Energi mengalir secara satu arah (linear) dan akhirnya terdisipasi sebagai panas, tetapi materi (karbon, nitrogen, mineral) didaur ulang tanpa henti dalam siklus tertutup.',
    cameraPosition: [-6.5, 3.2, 0.5],
    cameraTarget: [-5.0, 0.8, -1.8]
  }
];

export const EXPERIMENT_SCENARIOS: ExperimentScenario[] = [
  {
    id: 'rumput',
    label: 'Hilangkan Rumput',
    icon: '🌱',
    question: 'Apa yang terjadi jika produsen (rumput) musnah akibat kekeringan parah atau pencemaran tanah?',
    summary: 'Runtuhnya fondasi ekosistem (Bottom-Up Trophic Collapse).',
    effects: {
      rumput: {
        trend: 'extinct',
        percentageText: '0% (Musnah)',
        explanation: 'Ketiadaan fotosintesis menghentikan suplai energi organik pertama.'
      },
      belalang: {
        trend: 'down',
        percentageText: '-95% (Kelaparan Massal)',
        explanation: 'Belalang kehilangan 100% sumber makanannya dan mengalami kematian massal.'
      },
      katak: {
        trend: 'down',
        percentageText: '-85% (Kritis)',
        explanation: 'Katak kehabisan mangsa serangga dan mati kelaparan atau terpaksa migrasi.'
      },
      ular: {
        trend: 'down',
        percentageText: '-70% (Anjlok Drastis)',
        explanation: 'Populasi katak yang lenyap menyebabkan ular kehilangan mangsa utamanya.'
      },
      elang: {
        trend: 'down',
        percentageText: '-60% (Terancam Punah)',
        explanation: 'Elang tidak menemukan ular lagi di padang rumput dan terpaksa meninggalkan sarang.'
      }
    },
    ecologicalRule: 'Prinsip Bottom-Up Control: Produsen adalah penopang seluruh tingkat trofik di atasnya. Kehilangan produsen memicu kepunahan bertingkat.',
    recommendation: 'Lindungi kelestarian vegetasi dan lahan hijau sebagai fondasi penyangga seluruh rantai kehidupan.'
  },
  {
    id: 'belalang',
    label: 'Hilangkan Belalang',
    icon: '🦗',
    question: 'Apa yang terjadi jika belalang dibasmi secara berlebihan menggunakan insektisida kimiawi?',
    summary: 'Ketidakseimbangan ganda: Ledakan rumput dan krisis makanan bagi karnivora.',
    effects: {
      rumput: {
        trend: 'up',
        percentageText: '+80% (Overgrowth / Liar)',
        explanation: 'Rumput tumbuh lebat tak terkendali karena tidak ada lagi herbivora yang memakannya.'
      },
      belalang: {
        trend: 'extinct',
        percentageText: '0% (Musnah)',
        explanation: 'Populasi tereliminasi oleh racun insektisida.'
      },
      katak: {
        trend: 'down',
        percentageText: '-80% (Kekurangan Pangan)',
        explanation: 'Katak kehilangan makanan favoritnya dan jumlahnya merosot tajam.'
      },
      ular: {
        trend: 'down',
        percentageText: '-50% (Menurun)',
        explanation: 'Penurunan populasi katak berdampak langsung pada kelangsungan hidup ular.'
      },
      elang: {
        trend: 'down',
        percentageText: '-30% (Terganggu)',
        explanation: 'Pasokan ular berkurang, membatasi keberhasilan perkembangbiakan elang.'
      }
    },
    ecologicalRule: 'Konsumen primer bertindak sebagai jembatan transfer biomassa antara dunia tumbuhan dan dunia hewan.',
    recommendation: 'Hindari penggunaan pestisida kimia berlebih; gunakan pengendalian hama terpadu berbasis musuh alami.'
  },
  {
    id: 'katak',
    label: 'Hilangkan Katak',
    icon: '🐸',
    question: 'Apa yang terjadi jika katak sawah habis diburu secara liar untuk konsumsi komersial?',
    summary: 'Ledakan hama serangga belalang dan kelaparan bagi predator ular.',
    effects: {
      rumput: {
        trend: 'down',
        percentageText: '-70% (Tergundul Habis)',
        explanation: 'Miliaran belalang melahap seluruh dedaunan rumput hingga padang menjadi gundul.'
      },
      belalang: {
        trend: 'up',
        percentageText: '+250% (Ledakan Hama Serangga)',
        explanation: 'Tanpa predator alami katak, telur belalang menetas bebas tanpa pembatas.'
      },
      katak: {
        trend: 'extinct',
        percentageText: '0% (Musnah)',
        explanation: 'Populasi amfibi habis akibat perburuan liar dan kerusakan habitat rawa.'
      },
      ular: {
        trend: 'down',
        percentageText: '-75% (Kritis)',
        explanation: 'Ular kehilangan sumber protein utama yang biasa didapat di tepi parit.'
      },
      elang: {
        trend: 'down',
        percentageText: '-45% (Terganggu)',
        explanation: 'Ular langka di alam liar menyebabkan anak elang kekurangan suplai nutrisi.'
      }
    },
    ecologicalRule: 'Karnivora sekunder berfungsi sebagai rem biologis yang menahan ledakan populasi serangga herbivora.',
    recommendation: 'Jaga kelestarian habitat amfibi dan hentikan eksploitasi satwa amfibi secara berlebihan.'
  },
  {
    id: 'ular',
    label: 'Hilangkan Ular',
    icon: '🐍',
    question: 'Apa yang terjadi jika ular dibasmi karena rasa takut manusia yang berlebihan?',
    summary: 'Ledakan katak dan tikus, serta hilangnya mangsa favorit burung elang.',
    effects: {
      rumput: {
        trend: 'stable',
        percentageText: '+10% (Stabil Berfluktuasi)',
        explanation: 'Rumput mengalami sedikit fluktuasi namun tetap dapat beregenerasi.'
      },
      belalang: {
        trend: 'down',
        percentageText: '-60% (Banyak Dimangsa)',
        explanation: 'Populasi katak yang melonjak memangsa habis belalang dengan sangat agresif.'
      },
      katak: {
        trend: 'up',
        percentageText: '+180% (Melonjak Tinggi)',
        explanation: 'Katak berkembang biak pesat tanpa ada ular yang memangsanya.'
      },
      ular: {
        trend: 'extinct',
        percentageText: '0% (Musnah)',
        explanation: 'Dieliminasi akibat perburuan dan konflik dengan pemukiman manusia.'
      },
      elang: {
        trend: 'down',
        percentageText: '-65% (Krisis Makanan)',
        explanation: 'Elang kehilangan mangsa bernutrisi tinggi dan kesulitan membesarkan anaknya.'
      }
    },
    ecologicalRule: 'Predator tingkat menengah (mesopredator) mengendalikan mangsa bawah sekaligus memberi makan pemangsa puncak.',
    recommendation: 'Edukasi masyarakat bahwa ular bukan hama melainkan penjaga keseimbangan ekosistem dan pengendali tikus alami.'
  },
  {
    id: 'elang',
    label: 'Hilangkan Elang',
    icon: '🦅',
    question: 'Apa yang terjadi jika predator puncak (Elang Jawa) punah akibat perburuan liar dan perusakan hutan?',
    summary: 'Pelepasan predator bawah (Mesopredator Release) yang mengacaukan rantai.',
    effects: {
      rumput: {
        trend: 'up',
        percentageText: '+40% (Meningkat)',
        explanation: 'Populasi belalang yang sedikit membuat rumput tumbuh subur.'
      },
      belalang: {
        trend: 'down',
        percentageText: '-45% (Berkurang)',
        explanation: 'Populasi katak yang tidak terkontrol terus memakan belalang.'
      },
      katak: {
        trend: 'down',
        percentageText: '-50% (Menurun Cepat)',
        explanation: 'Ular yang terlampau banyak memangsa habis katak sampai langka.'
      },
      ular: {
        trend: 'up',
        percentageText: '+220% (Ledakan Populasi Ular)',
        explanation: 'Tanpa elang sebagai pemangsa puncak, ular berkembang biak tanpa ancaman.'
      },
      elang: {
        trend: 'extinct',
        percentageText: '0% (Punah)',
        explanation: 'Hilang selamanya dari bentang ekosistem.'
      }
    },
    ecologicalRule: 'Top-Down Control: Predator puncak menjaga kepadatan dan perilaku karnivora di bawahnya agar ekosistem harmonis.',
    recommendation: 'Lindungi habitat hutan dataran tinggi dan tegakkan hukum perlindungan burung pemangsa yang dilindungi undang-undang.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Organisme yang berperan sebagai produsen primer dalam rantai makanan ekosistem padang rumput adalah...',
    options: ['Katak sawah', 'Belalang padang', 'Rumput hijau', 'Elang Jawa'],
    correctIndex: 2,
    explanation: 'Rumput hijau adalah produsen (autotrof) karena mampu membuat makanannya sendiri melalui fotosintesis menggunakan energi matahari.',
    trophicContext: 'Tingkat Trofik 1 (Produsen Autotrof)'
  },
  {
    id: 2,
    question: 'Dari manakah sumber energi utama yang menggerakkan seluruh aliran energi dalam ekosistem berasal?',
    options: ['Panas magma bumi', 'Cahaya radiasi matahari', 'Air hujan di kolam', 'Bangkai yang membusuk'],
    correctIndex: 1,
    explanation: 'Matahari adalah sumber energi primer bagi kehidupan di bumi. Radiasi fotonnya diserap oleh klorofil tumbuhan untuk sintesis energi kimiawi.',
    trophicContext: 'Energi Awal Ekosistem'
  },
  {
    id: 3,
    question: 'Berapakah perkiraan persentase energi yang dapat ditransfer dari satu tingkat trofik ke tingkat trofik berikutnya (Hukum Efisiensi Lindeman)?',
    options: ['Sekitar 10%', 'Sekitar 50%', 'Sekitar 90%', 'Tepat 100% tanpa ada yang hilang'],
    correctIndex: 0,
    explanation: 'Hukum Lindeman (Hukum 10%) menyatakan bahwa rata-rata hanya 10% energi yang berhasil disimpan sebagai biomassa pada tingkat berikutnya, sedangkan 90% hilang sebagai panas respirasi dan ekskresi.',
    trophicContext: 'Efisiensi Aliran Energi Trofik'
  },
  {
    id: 4,
    question: 'Belalang yang memakan daun rumput menempati kedudukan dalam rantai makanan sebagai...',
    options: ['Produsen sekunder', 'Konsumen Tingkat I (Herbivora)', 'Konsumen Tingkat II (Karnivora)', 'Pengurai / Dekomposer'],
    correctIndex: 1,
    explanation: 'Organisme pemakan tumbuhan (herbivora) selalu menduduki posisi sebagai Konsumen Tingkat I pada tingkat trofik kedua.',
    trophicContext: 'Tingkat Trofik 2 (Konsumen Primer)'
  },
  {
    id: 5,
    question: 'Jika katak sawah memakan belalang padang, maka katak tersebut berperan sebagai...',
    options: ['Konsumen Tingkat I', 'Konsumen Tingkat II (Karnivora)', 'Produsen', 'Detritivor'],
    correctIndex: 1,
    explanation: 'Katak memakan konsumen primer (belalang), sehingga katak bertindak sebagai Konsumen Tingkat II (karnivora primer) pada tingkat trofik 3.',
    trophicContext: 'Tingkat Trofik 3 (Konsumen Sekunder)'
  },
  {
    id: 6,
    question: 'Apa peran krusial jamur dan bakteri (dekomposer) dalam kelangsungan sebuah ekosistem?',
    options: [
      'Menghasilkan oksigen melalui fotosintesis malam',
      'Mengurai materi organik jasad mati menjadi unsur hara tanah yang dapat diserap kembali oleh tumbuhan',
      'Memangsa hewan liar yang masih hidup',
      'Mengurangi jumlah energi matahari yang sampai ke bumi'
    ],
    correctIndex: 1,
    explanation: 'Pengurai merombak senyawa organik kompleks dari bangkai dan kotoran menjadi mineral anorganik sederhana penyubur tanah, sehingga siklus materi terus berputar.',
    trophicContext: 'Daur Biogeokimia & Dekomposer'
  },
  {
    id: 7,
    question: 'Berdasarkan piramida energi, mengapa jumlah predator puncak seperti Elang Jawa jauh lebih sedikit dibandingkan jumlah belalang atau rumput?',
    options: [
      'Karena elang tidak suka bertelur',
      'Karena energi yang tersedia di puncak rantai makanan sangat sedikit akibat kehilangan energi di setiap tingkat trofik',
      'Karena elang sering dimangsa oleh serangga kecil',
      'Karena rumput membutuhkan lebih banyak ruang terbang'
    ],
    correctIndex: 1,
    explanation: 'Akibat hukum 10%, energi menyusut drastis di setiap tingkatan. Pada tingkat puncak trofik, energi yang tersisa sangat minim, sehingga hanya mampu mendukung sedikit populasi predator puncak.',
    trophicContext: 'Piramida Energi Ekologis'
  },
  {
    id: 8,
    question: 'Dalam eksperimen ekosistem, jika populasi katak musnah akibat perburuan liar, dampak langsung yang akan terjadi pada populasi belalang adalah...',
    options: [
      'Populasi belalang akan punah seketika',
      'Populasi belalang akan melonjak drastis karena pemangsa alaminya hilang',
      'Belalang akan berubah menjadi pemakan daging',
      'Belalang tidak terpengaruh sama sekali'
    ],
    correctIndex: 1,
    explanation: 'Hilangnya predator pengontrol (katak) melepaskan tekanan pemangsaan pada belalang, mengakibatkan ledakan populasi hama belalang (population outbreak).',
    trophicContext: 'Dinamika Keseimbangan Populasi'
  },
  {
    id: 9,
    question: 'Urutan rantai makanan yang benar dan logis di padang rumput adalah...',
    options: [
      'Matahari → Belalang → Rumput → Katak → Elang',
      'Rumput → Elang → Ular → Katak → Belalang',
      'Matahari → Rumput → Belalang → Katak → Ular → Elang',
      'Katak → Belalang → Rumput → Ular → Jamur'
    ],
    correctIndex: 2,
    explanation: 'Aliran energi bermula dari Matahari diserap Rumput (produsen) → dimakan Belalang (konsumen I) → dimakan Katak (konsumen II) → dimakan Ular (konsumen III) → dimakan Elang (predator puncak).',
    trophicContext: 'Urutan Rantai Makanan'
  },
  {
    id: 10,
    question: 'Perbedaan mendasar antara "Aliran Energi" dan "Siklus Materi" dalam ekosistem adalah...',
    options: [
      'Energi dapat didaur ulang selamanya, sedangkan materi hilang sebagai panas',
      'Aliran energi bersifat satu arah (linear) dan habis terdisipasi sebagai panas, sedangkan materi berputar dalam siklus tertutup tak terbatas',
      'Energi hanya dibutuhkan oleh produsen, sedangkan materi hanya untuk predator',
      'Keduanya sama persis dan tidak memiliki perbedaan'
    ],
    correctIndex: 1,
    explanation: 'Energi mengalir satu arah dari matahari hingga habis terdisipasi ke alam semesta, sedangkan materi (atom karbon, nitrogen, fosfor) tidak pernah musnah dan terus didaur ulang oleh pengurai.',
    trophicContext: 'Termodinamika Ekosistem'
  }
];

export const MATERI_TOPICS = [
  {
    id: 'materi-1',
    number: '01',
    title: 'Pengertian Rantai Makanan',
    subtitle: 'Konsep Dasar & Dinamika Makan-Dimakan',
    icon: '🔗',
    badge: 'KONSEP DASAR',
    summary: 'Rantai makanan adalah jalur perpindahan materi dan energi melalui proses makan dan dimakan antarorganisme hidup dalam urutan tertentu.',
    points: [
      'Setiap makhluk hidup membutuhkan energi untuk tumbuh, bergerak, bereproduksi, dan memperbaiki sel tubuh.',
      'Energi tidak dapat diciptakan atau dimusnahkan, tetapi hanya berpindah bentuk dari energi radiasi matahari menjadi energi kimia dalam biomassa makanan.',
      'Rantai makanan yang saling berhubungan dan bercabang di alam nyata membentuk jaring-jaring makanan (Food Web) yang lebih kompleks dan stabil.'
    ],
    highlight: 'Rantai makanan menunjukkan siapa memakan siapa, sekaligus bagaimana energi kehidupan mengalir di bumi.'
  },
  {
    id: 'materi-2',
    number: '02',
    title: 'Produsen Primer (Autotrof)',
    subtitle: 'Penyedia Makanan & Fondasi Kehidupan',
    icon: '🌱',
    badge: 'TINGKAT TROFIK I',
    summary: 'Organisme yang mampu memproduksi makanannya sendiri dari senyawa anorganik sederhana menggunakan energi cahaya matahari.',
    points: [
      'Tumbuhan hijau, rumput, lumut, dan fitoplankton adalah contoh produsen primer di bumi.',
      'Melalui proses fotosintesis dengan rumus: 6CO₂ + 6H₂O + Cahaya → C₆H₁₂O₆ (Glukosa) + 6O₂, tumbuhan menghasilkan bahan bakar biologis.',
      'Produsen menempati dasar piramida biomassa dengan total berat biomassa dan kalori terbesar di antara seluruh anggota ekosistem.'
    ],
    highlight: 'Tanpa produsen hijau, tidak ada energi kimia yang dapat dimanfaatkan oleh hewan dan manusia di muka bumi.'
  },
  {
    id: 'materi-3',
    number: '03',
    title: 'Konsumen (Heterotrof)',
    subtitle: 'Tingkatan Konsumen I, II, III & Predator Puncak',
    icon: '🦗',
    badge: 'TINGKAT TROFIK II - V',
    summary: 'Organisme yang tidak dapat membuat makanan sendiri dan harus mengonsumsi makhluk hidup lain untuk memperoleh energi.',
    points: [
      'Konsumen I (Herbivora): Hewan pemakan produsen secara langsung (contoh: belalang, kelinci, rusa, sapi).',
      'Konsumen II (Karnivora Kecil): Hewan pemakan herbivora (contoh: katak, burung pemakan serangga, kadal).',
      'Konsumen III (Karnivora Menengah): Hewan pemakan karnivora kecil (contoh: ular rumput, musang).',
      'Predator Puncak (Apex Predator): Konsumen tertinggi yang tidak memiliki predator alami di ekosistemnya (contoh: Elang Jawa, harimau, singa).'
    ],
    highlight: 'Semakin tinggi tingkatan konsumen, semakin sedikit energi kalori yang dapat mereka serap dari tingkat sebelumnya.'
  },
  {
    id: 'materi-4',
    number: '04',
    title: 'Pengurai (Dekomposer & Detritivor)',
    subtitle: 'Pahlawan Tak Terlihat Pendaur Ulang Nutrisi',
    icon: '🍄',
    badge: 'DAUR MATERI',
    summary: 'Organisme pengurai yang memecah sisa-sisa jasad mati, kotoran, dan daun gugur menjadi unsur hara tanah.',
    points: [
      'Jamur (Fungi) dan bakteri pembusuk mengeluarkan enzim ekstraseluler untuk memecah sel-sel bangkai menjadi molekul mineral sederhana.',
      'Unsur hara seperti Nitrogen (N), Fosfor (P), dan Kalium (K) dikembalikan ke dalam partikel tanah.',
      'Akar tumbuhan menyerap kembali unsur hara tersebut bersama air, sehingga siklus kehidupan terus berlanjut tanpa pernah kehabisan materi.'
    ],
    highlight: 'Pengurai memastikan permukaan bumi tidak tertimbun bangkai dan menjaga kesuburan tanah secara abadi.'
  },
  {
    id: 'materi-5',
    number: '05',
    title: 'Tingkat Trofik & Hukum 10% Lindeman',
    subtitle: 'Hukum Termodinamika & Piramida Energi',
    icon: '📊',
    badge: 'HUKUM 10% ENERGI',
    summary: 'Posisi suatu organisme dalam piramida makanan dan efisiensi transfer energi yang menurun drastis di setiap jenjang.',
    points: [
      'Hukum 10% Lindeman: Dari 100% energi yang dikonsumsi, hanya sekitar 10% yang disimpan menjadi daging/biomassa baru bagi pemangsa berikutnya.',
      'Ke mana perginya 90% energi sisanya? Hilang sebagai panas metabolisme tubuh, energi gerak respirasi, dan bahan yang tidak tercerna (feses/urin).',
      'Inilah sebabnya mengapa rantai makanan di darat jarang memiliki lebih dari 4 atau 5 tingkatan trofik, karena energi di tingkat puncak sudah terlalu sedikit.'
    ],
    highlight: 'Produsen (10.000 kkal) → Konsumen I (1.000 kkal) → Konsumen II (100 kkal) → Konsumen III (10 kkal) → Predator Puncak (1 kkal).'
  }
];
