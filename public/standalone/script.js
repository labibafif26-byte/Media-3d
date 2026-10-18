/**
 * ============================================================================
 * SIMULASI 3D GUNUNG BERAPI DAN TANDA-TANDA AKTIVITAS VULKANIK
 * File: script.js
 * Engine: Three.js (WebGL) + Procedural Volcanic Synthesis + Web Audio API
 * ============================================================================
 */

// Global Three.js & Simulation State
let scene, camera, renderer, controls;
let clock = new THREE.Clock();
let volcanoGroup, cutawayGroup, fullMountainGroup;
let smokeParticles, ashParticles, fireSparks;
let lavaMesh, magmaChamberMesh;
let animals = [];
let birds = [];
let trees = [];
let directionalLight, pointLightCrater, ambientLight;

// Simulation State: "NORMAL" | "WARNING" | "ERUPTION"
let volcanoState = "NORMAL";
let isCutawayMode = false;
let eruptionTimer = 0;
let isEruptingSequence = false;
let audioEnabled = false;

// Audio Context & Nodes
let audioCtx = null;
let windNoiseNode = null;
let tremorOscNode = null;
let rumbleGainNode = null;

// Raycasting & 3D Markers
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let markers = [
  { id: 'crater', name: 'Kawah (Crater)', pos: new THREE.Vector3(0, 14.5, 0), desc: 'Bagian terbuka di puncak gunung tempat keluarnya gas, abu, batuan piroklastik, dan lelehan lava saat terjadi erupsi.' },
  { id: 'vent', name: 'Saluran Magma (Vent/Conduit)', pos: new THREE.Vector3(0, 7, 0.5), desc: 'Pipa atau saluran utama yang menghubungkan dapur magma di kedalaman bumi menuju kawah permukaan.' },
  { id: 'chamber', name: 'Kamar Magma (Magma Chamber)', pos: new THREE.Vector3(0, -1, 0), desc: 'Kantong batuan cair bersuhu tinggi (700°C - 1300°C) di bawah kerak bumi yang mengumpulkan tekanan vulkanik.' },
  { id: 'lava', name: 'Aliran Lava (Lava Flow)', pos: new THREE.Vector3(3.5, 8.5, 3.5), desc: 'Magma pijar yang meleleh keluar ke lereng gunung. Aliran ini dapat membakar vegetasi dan membentuk lapisan batuan baru.' },
  { id: 'strata', name: 'Lapisan Batuan (Strata)', pos: new THREE.Vector3(-4.5, 5, 0), desc: 'Stratovolcano tersusun dari perselingan lapisan lava beku purba, tefra, dan endapan abu vulkanik selama ribuan tahun.' },
  { id: 'quake', name: 'Gempa Vulkanik (Seismic Station)', pos: new THREE.Vector3(-9, 1.2, 7), desc: 'Stasiun seismik memantau getaran tremor harmonik akibat pergerakan dan rekahan batuan oleh magma cair.' },
  { id: 'temp', name: 'Peningkatan Suhu (Thermal Sensor)', pos: new THREE.Vector3(2.5, 12, 1.5), desc: 'Kenaikan suhu tanah dan fumarol terjadi karena magma bergerak mendekati permukaan, memanaskan batuan sekitar.' },
  { id: 'water', name: 'Mata Air / Sungai Vulkanik', pos: new THREE.Vector3(8.5, 0.5, -6), desc: 'Perubahan suhu, keasaman (pH turun), kekeruhan, dan bau belerang pada mata air merupakan indikator penting.' },
  { id: 'animals', name: 'Habitat Satwa Liar', pos: new THREE.Vector3(-8, 1, -8), desc: 'Rusa dan burung mendeteksi getaran infra-suara dan kenaikan gas belerang sebelum erupsi, memicu respon melarikan diri.' }
];

// Educational Data for Indicators
const INDICATOR_DATA = {
  gempa: {
    title: 'GEMPA VULKANIK',
    tag: 'SEISMIK',
    desc: 'Peningkatan aktivitas gempa vulkanik dapat menjadi salah satu parameter yang dipantau untuk mengetahui perubahan aktivitas di dalam gunung api. Magma yang mendesak ke atas memecahkan batuan kerak, menciptakan tremor harmonik kontinu.',
    callout: 'Status Seismik: Amplitude Tremor meningkat tajam (Simulasi Data Sensor RSAM).'
  },
  suhu: {
    title: 'PENINGKATAN SUHU',
    tag: 'TERMAL',
    desc: 'Perubahan atau peningkatan suhu di area tertentu dapat berkaitan dengan perubahan aktivitas panas bumi dan menjadi salah satu parameter yang dipantau. Citra inframerah termal mendeteksi anomali panas di area kubah lava dan solfatara.',
    callout: 'Sensor Kawah: 485°C (Kondisi normal: ~65°C - 85°C).'
  },
  gas: {
    title: 'PERUBAHAN GAS VULKANIK',
    tag: 'GEOKIMIA',
    desc: 'Perubahan jumlah atau komposisi gas vulkanik (seperti peningkatan konsentrasi Sulfur Dioksida SO₂, Karbon Dioksida CO₂, dan Hidrogen Sulfida H₂S) merupakan tanda desakan magma segar mendekati permukaan.',
    callout: 'Fluks Gas SO₂: 1.850 ton/hari (Normal: < 150 ton/hari).'
  },
  air: {
    title: 'PERUBAHAN AIR & MATA AIR',
    tag: 'HIDROLOGI',
    desc: 'Perubahan suhu, warna, bau, atau kandungan keasaman air di kawasan vulkanik dapat diamati dan dipantau. Danau kawah dan mata air lereng sering mengalami kenaikan suhu drastis dan penurunan pH menjadi sangat asam.',
    callout: 'Mata Air Lereng: Suhu naik ke 54°C, pH menjadi 3.2 (Asam Kuat).'
  },
  hewan: {
    title: 'PERUBAHAN PERILAKU HEWAN',
    tag: 'BIOLOGI',
    desc: 'Satwa liar seperti rusa, kera, dan burung memiliki sensitivitas tinggi terhadap getaran frekuensi rendah (infrasonik) dan gas mikro-belerang. Hewan akan gelisah, berhenti mencari makan, dan bermigrasi turun menjauhi lereng puncak.',
    callout: 'Respon Fauna: Kawanan rusa berlari ke lembah luar, burung terbang menjauh.'
  },
  deformasi: {
    title: 'DEFORMASI TUBUH GUNUNG',
    tag: 'GEODESI',
    desc: 'Pengukuran menggunakan tiltmeter dan GPS geodetik mendeteksi pembengkakan (inflasi) lereng gunung api akibat penumpukan volume magma dan akumulasi gas bertekanan tinggi di dalam pipa kepundan.',
    callout: 'Tiltmeter Station A: Inflasi +42 mikroradian ke arah puncak.'
  },
  lava: {
    title: 'PENINGKATAN AKTIVITAS LAVA',
    tag: 'VULKANOLOGI',
    desc: 'Kubah lava mulai tumbuh di kawah, magma cair pijar mulai meluber melampaui bibir kawah dan mengalir menuruni alur lembah, memicu guguran lava pijar dan awan panas guguran.',
    callout: 'Laju Ekstrusi Lava: 2.8 m³/detik, pijar oranye terang.'
  }
};

/**
 * ============================================================================
 * 1. INISIALISASI UTAMA
 * ============================================================================
 */
function init() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  initScene();
  initCamera();
  initRenderer();
  initLights();
  initControls();
  
  createEnvironment();
  createLava();
  createSmoke();
  createTrees();
  createAnimals();
  createUI();
  
  loadModels(); // Memuat model GLB jika ada di folder /models/

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('pointerdown', onPointerDown);

  // Jalankan render loop
  animate();
}

/**
 * ============================================================================
 * 2. INITIALIZE SCENE & ENVIRONMENT
 * ============================================================================
 */
function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1128);
  // Kabut atmosferik tipis
  scene.fog = new THREE.FogExp2(0x0a1128, 0.015);
}

function initCamera() {
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 1000);
  camera.position.set(0, 18, 38);
}

function initRenderer() {
  const container = document.getElementById('canvas-container');
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);
}

function initLights() {
  ambientLight = new THREE.AmbientLight(0x475569, 1.2);
  scene.add(ambientLight);

  // Directional Sun Light
  directionalLight = new THREE.DirectionalLight(0xfff7ed, 2.0);
  directionalLight.position.set(25, 40, 20);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 150;
  directionalLight.shadow.camera.left = -30;
  directionalLight.shadow.camera.right = 30;
  directionalLight.shadow.camera.top = 30;
  directionalLight.shadow.camera.bottom = -30;
  scene.add(directionalLight);

  // Cahaya Pijar Kawah (Lava Glow)
  pointLightCrater = new THREE.PointLight(0xff4500, 3.5, 45, 1.5);
  pointLightCrater.position.set(0, 14.5, 0);
  scene.add(pointLightCrater);

  // Hemisphere Light untuk keseimbangan langit & tanah
  const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 0.6);
  scene.add(hemiLight);
}

function initControls() {
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // Jangan tembus ke bawah tanah
    controls.minDistance = 10;
    controls.maxDistance = 80;
    controls.target.set(0, 6, 0);
  }
}

/**
 * ============================================================================
 * 3. CREATE ENVIRONMENT & VOLCANO MODEL (DENGAN CUTAWAY PENAMPANG LINTANG)
 * ============================================================================
 */
function createEnvironment() {
  // Ground Terrain (Tanah & Lembah)
  const groundGeo = new THREE.CylinderGeometry(28, 30, 2, 48);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a1e,
    roughness: 0.9,
    metalness: 0.1
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -1;
  ground.receiveShadow = true;
  scene.add(ground);

  // Sungai / Sumber Air di Lembah
  const riverCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(4, 0.05, -12),
    new THREE.Vector3(7, 0.05, -7),
    new THREE.Vector3(10, 0.05, 0),
    new THREE.Vector3(14, 0.05, 6),
    new THREE.Vector3(20, 0.05, 12)
  ]);
  const riverGeo = new THREE.TubeGeometry(riverCurve, 32, 1.6, 8, false);
  const riverMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85
  });
  const river = new THREE.Mesh(riverGeo, riverMat);
  river.scale.set(1, 0.2, 1);
  scene.add(river);

  // Mata Air Panas (Sumber Air Vulkanik)
  const springGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.2, 24);
  const springMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.2,
    metalness: 0.5,
    emissive: 0x0284c7,
    emissiveIntensity: 0.2
  });
  const hotSpring = new THREE.Mesh(springGeo, springMat);
  hotSpring.position.set(8.5, 0.08, -6);
  hotSpring.name = 'Mata Air Vulkanik';
  scene.add(hotSpring);

  // Bangun Gunung Utama (Procedural Stratovolcano dengan opsi Cutaway Penampang)
  createVolcanoStructure();

  // Awan di Langit
  createClouds();
}

/**
 * Membangun model gunung dengan 2 mode:
 * 1. Mode Luar Penuh (Cone luar gunung alami dengan alur lereng)
 * 2. Mode Penampang (Irisan 90-derajat memperlihatkan saluran magma, kamar magma, dan lapisan batuan)
 */
function createVolcanoStructure() {
  volcanoGroup = new THREE.Group();
  scene.add(volcanoGroup);

  // Material Gunung Luar
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x3f3f46,
    roughness: 0.85,
    metalness: 0.15,
    flatShading: true
  });

  // Badan Gunung Utama (Full Mountain: Cylinder terpancung dengan kawah di atas)
  const mountainGeo = new THREE.CylinderGeometry(2.8, 16, 14, 36, 6, false);
  // Bentuk deformasi lereng alami
  const posAttr = mountainGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    if (y < 6 && y > -6) {
      const angle = Math.atan2(z, x);
      const radiusNoise = Math.sin(angle * 7) * 0.5 + Math.cos(angle * 3) * 0.4;
      posAttr.setX(i, x + Math.cos(angle) * radiusNoise);
      posAttr.setZ(i, z + Math.sin(angle) * radiusNoise);
    }
  }
  mountainGeo.computeVertexNormals();

  fullMountainGroup = new THREE.Group();
  const fullMountainMesh = new THREE.Mesh(mountainGeo, rockMat);
  fullMountainMesh.position.y = 7;
  fullMountainMesh.castShadow = true;
  fullMountainMesh.receiveShadow = true;
  fullMountainGroup.add(fullMountainMesh);
  volcanoGroup.add(fullMountainGroup);

  // --------------------------------------------------------------------------
  // GRUP PENAMPANG (CUTAWAY) - AKTIF DI MODE PENAMPANG
  // --------------------------------------------------------------------------
  cutawayGroup = new THREE.Group();
  cutawayGroup.visible = false;

  // Irisan Gunung (270 Derajat dibuka sudut 90 derajat di depan)
  const cutawayMountainGeo = new THREE.CylinderGeometry(2.8, 16, 14, 32, 6, false, Math.PI * 0.25, Math.PI * 1.5);
  const cutawayMountainMesh = new THREE.Mesh(cutawayMountainGeo, rockMat);
  cutawayMountainMesh.position.y = 7;
  cutawayMountainMesh.castShadow = true;
  cutawayMountainMesh.receiveShadow = true;
  cutawayGroup.add(cutawayMountainMesh);

  // Lapisan-lapisan Geologis Internal (Dinding penampang)
  const wallMatSediment = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.9 });
  const wallMatAncientLava = new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.95 });
  const wallMatPyroclastic = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 });

  // Dinding Penampang 1 (Sisi Kiri Penampang)
  const leftWallGeo = new THREE.PlaneGeometry(15, 14);
  const leftWall = new THREE.Mesh(leftWallGeo, wallMatAncientLava);
  leftWall.position.set(-5, 7, 0);
  leftWall.rotation.y = Math.PI / 2;
  cutawayGroup.add(leftWall);

  // Dinding Penampang 2 (Sisi Kanan Penampang)
  const rightWallGeo = new THREE.PlaneGeometry(15, 14);
  const rightWall = new THREE.Mesh(rightWallGeo, wallMatPyroclastic);
  rightWall.position.set(0, 7, 5);
  cutawayGroup.add(rightWall);

  // Saluran Magma Utama (Vent/Conduit) - Tabung Pijar Menyala
  const conduitGeo = new THREE.CylinderGeometry(0.8, 1.2, 16, 16);
  const magmaGlowMat = new THREE.MeshStandardMaterial({
    color: 0xff3b00,
    emissive: 0xff4500,
    emissiveIntensity: 1.8,
    roughness: 0.3
  });
  const mainConduit = new THREE.Mesh(conduitGeo, magmaGlowMat);
  mainConduit.position.set(0, 6.5, 0);
  cutawayGroup.add(mainConduit);

  // Kamar Magma (Magma Chamber) - Bola Pijar di Kedalaman
  const chamberGeo = new THREE.SphereGeometry(3.5, 24, 24);
  magmaChamberMesh = new THREE.Mesh(chamberGeo, magmaGlowMat);
  magmaChamberMesh.position.set(0, -1, 0);
  cutawayGroup.add(magmaChamberMesh);

  // Saluran Samping (Parasitic Conduit)
  const branchGeo = new THREE.CylinderGeometry(0.3, 0.4, 6, 12);
  const branchConduit = new THREE.Mesh(branchGeo, magmaGlowMat);
  branchConduit.position.set(3, 4.5, 0);
  branchConduit.rotation.z = -Math.PI / 4;
  cutawayGroup.add(branchConduit);

  volcanoGroup.add(cutawayGroup);

  // Kawah Atas (Crater Rim & Lava Lake)
  const craterLavaGeo = new THREE.CylinderGeometry(2.2, 0.5, 1, 24);
  const craterLavaMat = new THREE.MeshStandardMaterial({
    color: 0xff2200,
    emissive: 0xff4500,
    emissiveIntensity: 2.0,
    roughness: 0.2
  });
  const craterLava = new THREE.Mesh(craterLavaGeo, craterLavaMat);
  craterLava.position.set(0, 13.8, 0);
  volcanoGroup.add(craterLava);
}

/**
 * Awan Prosedural
 */
function createClouds() {
  const cloudGroup = new THREE.Group();
  const cloudGeo = new THREE.DodecahedronGeometry(2.5, 1);
  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.65,
    roughness: 1.0
  });

  for (let i = 0; i < 7; i++) {
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    const angle = (i / 7) * Math.PI * 2;
    const dist = 22 + Math.random() * 8;
    cloud.position.set(Math.cos(angle) * dist, 20 + Math.random() * 4, Math.sin(angle) * dist);
    cloud.scale.set(1 + Math.random(), 0.6, 1 + Math.random());
    cloudGroup.add(cloud);
  }
  scene.add(cloudGroup);
}

/**
 * ============================================================================
 * 4. CREATE LAVA FLOW & EMISSIVE MESH
 * ============================================================================
 */
function createLava() {
  // Aliran Lava Mengalir Menuruni Lereng Depan
  const lavaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 13.8, 0),
    new THREE.Vector3(1.2, 12, 1.8),
    new THREE.Vector3(2.5, 9.5, 3.2),
    new THREE.Vector3(4.5, 6.5, 5.0),
    new THREE.Vector3(6.8, 3.2, 7.5),
    new THREE.Vector3(9.5, 0.3, 10.5)
  ]);

  const lavaGeo = new THREE.TubeGeometry(lavaCurve, 36, 0.65, 8, false);
  const lavaMat = new THREE.MeshStandardMaterial({
    color: 0xff3700,
    emissive: 0xff2200,
    emissiveIntensity: 1.4,
    roughness: 0.3,
    metalness: 0.1
  });

  lavaMesh = new THREE.Mesh(lavaGeo, lavaMat);
  lavaMesh.castShadow = true;
  volcanoGroup.add(lavaMesh);
}

/**
 * ============================================================================
 * 5. CREATE SMOKE, ASH PARTICLES, AND VOLCANIC BOMBS
 * ============================================================================
 */
function createSmoke() {
  // 1. Partikel Asap Kawah (Smoke Billows)
  const smokeCount = 140;
  const smokeGeo = new THREE.BufferGeometry();
  const smokePositions = new Float32Array(smokeCount * 3);
  const smokeScales = new Float32Array(smokeCount);

  for (let i = 0; i < smokeCount; i++) {
    smokePositions[i * 3 + 0] = (Math.random() - 0.5) * 1.5;
    smokePositions[i * 3 + 1] = 14.5 + Math.random() * 12;
    smokePositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    smokeScales[i] = 1 + Math.random() * 2;
  }

  smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));

  // Canvas texture untuk partikel asap bulat halus
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, 'rgba(230,230,230,0.8)');
  grad.addColorStop(0.5, 'rgba(180,180,180,0.4)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const smokeTex = new THREE.CanvasTexture(canvas);

  const smokeMat = new THREE.PointsMaterial({
    size: 4.5,
    map: smokeTex,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
    color: 0xd4d4d8
  });

  smokeParticles = new THREE.Points(smokeGeo, smokeMat);
  scene.add(smokeParticles);

  // 2. Partikel Hujan Abu Vulkanik (Ash Fallout)
  const ashCount = 280;
  const ashGeo = new THREE.BufferGeometry();
  const ashPositions = new Float32Array(ashCount * 3);
  for (let i = 0; i < ashCount; i++) {
    ashPositions[i * 3 + 0] = (Math.random() - 0.5) * 50;
    ashPositions[i * 3 + 1] = Math.random() * 30;
    ashPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }
  ashGeo.setAttribute('position', new THREE.BufferAttribute(ashPositions, 3));

  const ashMat = new THREE.PointsMaterial({
    size: 0.35,
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.0, // Tersembunyi saat normal
    depthWrite: false
  });
  ashParticles = new THREE.Points(ashGeo, ashMat);
  scene.add(ashParticles);

  // 3. Percikan Api / Bom Vulkanik (Ejecta Sparks)
  const fireCount = 70;
  const fireGeo = new THREE.BufferGeometry();
  const firePositions = new Float32Array(fireCount * 3);
  for (let i = 0; i < fireCount; i++) {
    firePositions[i * 3 + 0] = 0;
    firePositions[i * 3 + 1] = 14.5;
    firePositions[i * 3 + 2] = 0;
  }
  fireGeo.setAttribute('position', new THREE.BufferAttribute(firePositions, 3));
  const fireMat = new THREE.PointsMaterial({
    size: 0.8,
    color: 0xffaa00,
    transparent: true,
    opacity: 0.0
  });
  fireSparks = new THREE.Points(fireGeo, fireMat);
  scene.add(fireSparks);
}

/**
 * ============================================================================
 * 6. CREATE TREES & VEGETATION WITH WIND SWAY
 * ============================================================================
 */
function createTrees() {
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8, flatShading: true });
  const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8, flatShading: true });

  const treeCount = 45;
  for (let i = 0; i < treeCount; i++) {
    // Letakkan di kaki gunung radius 15 - 26 meter
    const angle = Math.random() * Math.PI * 2;
    const radius = 15 + Math.random() * 11;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    // Hindari area aliran lava
    if (x > 2 && x < 12 && z > 2 && z < 12) continue;

    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);

    // Batang
    const trunkGeo = new THREE.CylinderGeometry(0.18, 0.28, 1.8, 6);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.9;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // Daun Cemara Bertingkat
    const levels = 3;
    for (let l = 0; l < levels; l++) {
      const coneGeo = new THREE.ConeGeometry(1.4 - l * 0.3, 1.5, 6);
      const foliage = new THREE.Mesh(coneGeo, l % 2 === 0 ? foliageMat1 : foliageMat2);
      foliage.position.y = 1.8 + l * 0.8;
      foliage.castShadow = true;
      treeGroup.add(foliage);
    }

    const scale = 0.75 + Math.random() * 0.5;
    treeGroup.scale.set(scale, scale, scale);

    scene.add(treeGroup);
    trees.push({
      mesh: treeGroup,
      baseRotX: 0,
      phase: Math.random() * Math.PI * 2
    });
  }
}

/**
 * ============================================================================
 * 7. CREATE ANIMALS (RUSA, BURUNG, HEWAN KECIL)
 * ============================================================================
 */
function createAnimals() {
  // A. KAWANAN RUSA (DEER)
  const deerCount = 4;
  for (let i = 0; i < deerCount; i++) {
    const deer = createProceduralDeer();
    // Posisi awal di padang rumput lereng bawah
    const angle = -Math.PI * 0.4 + (i * 0.35);
    const dist = 14 + Math.random() * 4;
    deer.group.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
    
    // Titik pelarian (Flee Targets) berbeda-beda menjauhi gunung
    const fleeAngle = angle + (Math.random() - 0.5) * 0.5;
    const fleeDist = 38 + Math.random() * 8;
    const fleeTarget = new THREE.Vector3(Math.cos(fleeAngle) * fleeDist, 0, Math.sin(fleeAngle) * fleeDist);

    animals.push({
      type: 'deer',
      mesh: deer.group,
      legs: deer.legs,
      head: deer.head,
      initialPos: deer.group.position.clone(),
      fleeTarget: fleeTarget,
      wanderTarget: deer.group.position.clone(),
      speed: 0.02,
      state: 'NORMAL',
      idleTimer: Math.random() * 3
    });

    scene.add(deer.group);
  }

  // B. KAWANAN BURUNG (BIRDS)
  const birdCount = 6;
  for (let i = 0; i < birdCount; i++) {
    const bird = createProceduralBird();
    const orbitRadius = 12 + Math.random() * 8;
    const orbitHeight = 16 + Math.random() * 4;
    const orbitSpeed = 0.008 + Math.random() * 0.004;
    const orbitAngle = (i / birdCount) * Math.PI * 2;

    birds.push({
      mesh: bird.group,
      leftWing: bird.leftWing,
      rightWing: bird.rightWing,
      orbitRadius: orbitRadius,
      orbitHeight: orbitHeight,
      orbitSpeed: orbitSpeed,
      angle: orbitAngle,
      fleeDirection: new THREE.Vector3(Math.cos(orbitAngle), 0.6, Math.sin(orbitAngle)).normalize(),
      fleeSpeed: 0.18,
      state: 'NORMAL'
    });

    scene.add(bird.group);
  }

  // C. HEWAN KECIL (KELINCI / SMALL FAUNA)
  for (let i = 0; i < 3; i++) {
    const smallAnimal = createProceduralSmallAnimal();
    const angle = Math.PI * 0.6 + i * 0.4;
    const dist = 16 + Math.random() * 3;
    smallAnimal.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);

    const fleeTarget = new THREE.Vector3(Math.cos(angle) * 36, 0, Math.sin(angle) * 36);

    animals.push({
      type: 'small',
      mesh: smallAnimal,
      initialPos: smallAnimal.position.clone(),
      fleeTarget: fleeTarget,
      wanderTarget: smallAnimal.position.clone(),
      speed: 0.025,
      state: 'NORMAL',
      idleTimer: Math.random() * 2
    });

    scene.add(smallAnimal);
  }
}

/**
 * Model Prosedural Rusa (Low Poly dengan artikulasi kaki & kepala)
 */
function createProceduralDeer() {
  const deerGroup = new THREE.Group();
  const deerMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 });
  const antlerMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 });

  // Badan
  const bodyGeo = new THREE.BoxGeometry(0.8, 0.7, 1.4);
  const body = new THREE.Mesh(bodyGeo, deerMat);
  body.position.y = 1.1;
  body.castShadow = true;
  deerGroup.add(body);

  // Leher & Kepala
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.4, 0.6);

  const headGeo = new THREE.BoxGeometry(0.4, 0.45, 0.65);
  const head = new THREE.Mesh(headGeo, deerMat);
  head.position.set(0, 0.2, 0.2);
  head.castShadow = true;
  headGroup.add(head);

  // Tanduk Rusa
  const antlerLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5), antlerMat);
  antlerLeft.position.set(-0.18, 0.5, 0.1);
  antlerLeft.rotation.z = -0.3;
  headGroup.add(antlerLeft);

  const antlerRight = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5), antlerMat);
  antlerRight.position.set(0.18, 0.5, 0.1);
  antlerRight.rotation.z = 0.3;
  headGroup.add(antlerRight);

  deerGroup.add(headGroup);

  // 4 Kaki Berartikulasi
  const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.9);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.9 });
  const legs = [];

  const legPositions = [
    [-0.28, 0.45, 0.45],
    [0.28, 0.45, 0.45],
    [-0.28, 0.45, -0.45],
    [0.28, 0.45, -0.45]
  ];

  legPositions.forEach(pos => {
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(pos[0], pos[1], pos[2]);
    leg.castShadow = true;
    deerGroup.add(leg);
    legs.push(leg);
  });

  deerGroup.scale.set(0.85, 0.85, 0.85);

  return { group: deerGroup, legs: legs, head: headGroup };
}

/**
 * Model Prosedural Burung (dengan sayap berotasi kepak)
 */
function createProceduralBird() {
  const birdGroup = new THREE.Group();
  const featherMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });

  // Badan Burung
  const bodyGeo = new THREE.ConeGeometry(0.2, 0.8, 5);
  const body = new THREE.Mesh(bodyGeo, featherMat);
  body.rotation.x = Math.PI / 2;
  birdGroup.add(body);

  // Sayap Kiri
  const wingGeo = new THREE.BoxGeometry(0.7, 0.04, 0.3);
  const leftWing = new THREE.Mesh(wingGeo, featherMat);
  leftWing.position.set(-0.35, 0, 0);
  birdGroup.add(leftWing);

  // Sayap Kanan
  const rightWing = new THREE.Mesh(wingGeo, featherMat);
  rightWing.position.set(0.35, 0, 0);
  birdGroup.add(rightWing);

  return { group: birdGroup, leftWing: leftWing, rightWing: rightWing };
}

/**
 * Model Prosedural Hewan Kecil (Kelinci)
 */
function createProceduralSmallAnimal() {
  const smallGroup = new THREE.Group();
  const furMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.9 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), furMat);
  body.position.y = 0.25;
  body.scale.set(1, 0.8, 1.4);
  smallGroup.add(body);

  const earL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.06), furMat);
  earL.position.set(-0.1, 0.5, 0.2);
  smallGroup.add(earL);

  const earR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.06), furMat);
  earR.position.set(0.1, 0.5, 0.2);
  smallGroup.add(earR);

  return smallGroup;
}

/**
 * ============================================================================
 * 8. LOAD GLTF/GLB MODELS (DENGAN FALLBACK AMAN)
 * ============================================================================
 */
function loadModels() {
  // Cek apakah GLTFLoader tersedia di runtime
  if (typeof THREE.GLTFLoader === 'undefined') {
    console.info("Info: GLTFLoader siap digunakan saat pustaka dimuat atau file .glb dimasukkan ke folder /models/.");
    return;
  }

  const loader = new THREE.GLTFLoader();

  // 1. Coba muat model gunung kustom jika pengguna meletakkan gunung-api.glb
  loader.load(
    'models/gunung-api.glb',
    function (gltf) {
      console.log("Model gunung-api.glb berhasil dimuat!");
      // Gantikan visual gunung prosedural dengan model GLB
      if (volcanoGroup) {
        scene.remove(volcanoGroup);
      }
      volcanoGroup = gltf.scene;
      volcanoGroup.position.set(0, 0, 0);
      scene.add(volcanoGroup);
      showToast("Model kustom gunung-api.glb aktif!");
    },
    undefined,
    function (error) {
      // Fallback ramah jika file belum dimasukkan
      console.info("Catatan: File models/gunung-api.glb belum ada. Menggunakan generator 3D prosedural bawaan yang lengkap.");
    }
  );

  // 2. Coba muat model fauna jika ada
  loader.load('models/rusa.glb', function(gltf) {
    console.log("Model rusa.glb berhasil dimuat.");
  }, undefined, () => {});
}

/**
 * ============================================================================
 * 9. AUDIO SYNTHESIS & WEBAUDIO ENGINE
 * ============================================================================
 */
function initAudio() {
  if (audioCtx) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // 1. Synthesizer Angin Normal (Filtered Pink Noise)
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.05;
      b2 = 0.85 * b2 + white * 0.05;
      output[i] = (b0 + b1 + b2) * 0.15;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const windFilter = audioCtx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 350;

    const windGain = audioCtx.createGain();
    windGain.gain.value = 0.2;

    whiteNoise.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(audioCtx.destination);
    whiteNoise.start();

    // 2. Synthesizer Tremor Seismik / Gemuruh
    tremorOscNode = audioCtx.createOscillator();
    tremorOscNode.type = 'sawtooth';
    tremorOscNode.frequency.value = 45; // Sub-bass getaran bumi

    const tremorFilter = audioCtx.createBiquadFilter();
    tremorFilter.type = 'lowpass';
    tremorFilter.frequency.value = 80;

    rumbleGainNode = audioCtx.createGain();
    rumbleGainNode.gain.value = 0.0; // Nol saat normal

    tremorOscNode.connect(tremorFilter);
    tremorFilter.connect(rumbleGainNode);
    rumbleGainNode.connect(audioCtx.destination);
    tremorOscNode.start();

  } catch (e) {
    console.warn("AudioContext belum dapat dijalankan:", e);
  }
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const btn = document.getElementById('btn-sound');
  if (audioEnabled) {
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (btn) btn.innerHTML = '🔊 SOUND ON';
    showToast('Efek Suara Diaktifkan');
  } else {
    if (audioCtx) {
      audioCtx.suspend();
    }
    if (btn) btn.innerHTML = '🔇 SOUND OFF';
    showToast('Efek Suara Dimatikan');
  }
}

/**
 * ============================================================================
 * 10. ANIMASI LOOP & SIMULATION UPDATE
 * ============================================================================
 */
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const time = clock.getElapsedTime();

  // Update Controls
  if (controls) controls.update();

  // Animasi Komponen Scene
  updateAnimals(delta, time);
  updateBirds(delta, time);
  updateSmoke(delta, time);
  updateLava(delta, time);
  updateTrees(time);
  updateMarkersPosition();

  // Timeline Erupsi Bertahap jika dalam urutan sekuensial
  if (isEruptingSequence) {
    eruptionTimer += delta;
    updateEruptionSequence(eruptionTimer);
  }

  // Camera Shake saat gempa / erupsi
  if (volcanoState === 'WARNING') {
    camera.position.x += (Math.random() - 0.5) * 0.04;
    camera.position.y += (Math.random() - 0.5) * 0.04;
  } else if (volcanoState === 'ERUPTION') {
    const shakeIntensity = 0.14;
    camera.position.x += (Math.random() - 0.5) * shakeIntensity;
    camera.position.y += (Math.random() - 0.5) * shakeIntensity;
    camera.position.z += (Math.random() - 0.5) * shakeIntensity;
  }

  renderer.render(scene, camera);
}

/**
 * Update Pohon tertiup angin
 */
function updateTrees(time) {
  const windSway = volcanoState === 'ERUPTION' ? 0.08 : 0.03;
  for (let i = 0; i < trees.length; i++) {
    const t = trees[i];
    t.mesh.rotation.z = Math.sin(time * 2 + t.phase) * windSway;
  }
}

/**
 * Update Perilaku Hewan (Rusa & Hewan Kecil)
 * NORMAL: Berjalan perlahan, sesekali diam merumput.
 * WARNING: Berhenti, waspada, kepala mendongak.
 * ERUPTION: Berlari kencang menuju fleeTarget menjauhi gunung!
 */
function updateAnimals(delta, time) {
  for (let i = 0; i < animals.length; i++) {
    const a = animals[i];

    if (a.state === 'NORMAL') {
      a.idleTimer -= delta;
      if (a.idleTimer <= 0) {
        // Pilih target jalan acak di area aman
        const randomOffset = new THREE.Vector3((Math.random() - 0.5) * 3, 0, (Math.random() - 0.5) * 3);
        a.wanderTarget = a.initialPos.clone().add(randomOffset);
        a.idleTimer = 3 + Math.random() * 4;
      }

      // Gerak perlahan ke target
      const dist = a.mesh.position.distanceTo(a.wanderTarget);
      if (dist > 0.1) {
        const dir = a.wanderTarget.clone().sub(a.mesh.position).normalize();
        a.mesh.position.addScaledVector(dir, a.speed);
        a.mesh.lookAt(a.wanderTarget.x, a.mesh.position.y, a.wanderTarget.z);

        // Ayunan kaki saat berjalan
        if (a.legs) {
          const legAngle = Math.sin(time * 6 + i) * 0.4;
          a.legs[0].rotation.x = legAngle;
          a.legs[1].rotation.x = -legAngle;
          a.legs[2].rotation.x = -legAngle;
          a.legs[3].rotation.x = legAngle;
        }
      }
    } else if (a.state === 'WARNING') {
      // Satwa berhenti, kepala mendongak mencari sumber gemuruh getaran
      if (a.head) {
        a.head.rotation.x = -0.35 + Math.sin(time * 3) * 0.08;
      }
    } else if (a.state === 'FLEE') {
      // Satwa berlari kencang menuju fleeTarget menjauhi gunung
      const dist = a.mesh.position.distanceTo(a.fleeTarget);
      if (dist > 0.5) {
        const dir = a.fleeTarget.clone().sub(a.mesh.position).normalize();
        const runSpeed = a.type === 'deer' ? 0.12 : 0.09;
        a.mesh.position.addScaledVector(dir, runSpeed);
        a.mesh.lookAt(a.fleeTarget.x, a.mesh.position.y, a.fleeTarget.z);

        // Ayunan kaki lari cepat
        if (a.legs) {
          const runLegAngle = Math.sin(time * 18 + i) * 0.8;
          a.legs[0].rotation.x = runLegAngle;
          a.legs[1].rotation.x = -runLegAngle;
          a.legs[2].rotation.x = -runLegAngle;
          a.legs[3].rotation.x = runLegAngle;
        }
      }
    }
  }
}

/**
 * Update Burung
 * NORMAL: Melingkar santai di angkasa lembah
 * ERUPTION: Mengepak sayap cepat, naik tinggi, dan terbang menjauh meninggalkan scene
 */
function updateBirds(delta, time) {
  for (let i = 0; i < birds.length; i++) {
    const b = birds[i];

    // Kepakan Sayap
    const flapSpeed = b.state === 'FLEE' ? 24 : 10;
    const flapAngle = Math.sin(time * flapSpeed + i) * 0.6;
    if (b.leftWing && b.rightWing) {
      b.leftWing.rotation.z = flapAngle;
      b.rightWing.rotation.z = -flapAngle;
    }

    if (b.state === 'NORMAL') {
      b.angle += b.orbitSpeed;
      const x = Math.cos(b.angle) * b.orbitRadius;
      const z = Math.sin(b.angle) * b.orbitRadius;
      const y = b.orbitHeight + Math.sin(time * 2 + i) * 0.8;

      b.mesh.position.set(x, y, z);
      // Hadap ke arah gerak orbit
      const nextX = Math.cos(b.angle + 0.1) * b.orbitRadius;
      const nextZ = Math.sin(b.angle + 0.1) * b.orbitRadius;
      b.mesh.lookAt(nextX, y, nextZ);
    } else if (b.state === 'FLEE') {
      // Burung terbang tinggi dan melesat keluar scene
      b.mesh.position.addScaledVector(b.fleeDirection, b.fleeSpeed);
      b.mesh.position.y += 0.04;
      b.mesh.lookAt(
        b.mesh.position.x + b.fleeDirection.x,
        b.mesh.position.y + b.fleeDirection.y,
        b.mesh.position.z + b.fleeDirection.z
      );
    }
  }
}

/**
 * Update Asap & Partikel Abu
 */
function updateSmoke(delta, time) {
  if (!smokeParticles) return;

  const positions = smokeParticles.geometry.attributes.position.array;
  const count = positions.length / 3;

  const upwardSpeed = volcanoState === 'ERUPTION' ? 0.22 : (volcanoState === 'WARNING' ? 0.09 : 0.035);
  const spreadFactor = volcanoState === 'ERUPTION' ? 0.06 : 0.02;

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] += upwardSpeed;
    positions[i * 3 + 0] += Math.sin(time * 1.5 + i) * spreadFactor;
    positions[i * 3 + 2] += Math.cos(time * 1.5 + i) * spreadFactor;

    // Reset partikel jika mencapai ketinggian tertentu
    const maxHeight = volcanoState === 'ERUPTION' ? 38 : 22;
    if (positions[i * 3 + 1] > maxHeight) {
      positions[i * 3 + 1] = 14.5;
      positions[i * 3 + 0] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
    }
  }
  smokeParticles.geometry.attributes.position.needsUpdate = true;

  // Warna & Opasitas Asap
  if (volcanoState === 'NORMAL') {
    smokeParticles.material.opacity = 0.35;
    smokeParticles.material.color.setHex(0xd4d4d8);
    smokeParticles.material.size = 4.0;
  } else if (volcanoState === 'WARNING') {
    smokeParticles.material.opacity = 0.65;
    smokeParticles.material.color.setHex(0xa1a1aa);
    smokeParticles.material.size = 6.5;
  } else if (volcanoState === 'ERUPTION') {
    smokeParticles.material.opacity = 0.88;
    smokeParticles.material.color.setHex(0x52525b); // Abu tebal gelap
    smokeParticles.material.size = 11.0;
  }

  // Update Abu Vulkanik Turun (Ash Fallout)
  if (ashParticles) {
    if (volcanoState === 'ERUPTION') {
      ashParticles.material.opacity = 0.55;
      const ashPos = ashParticles.geometry.attributes.position.array;
      for (let j = 0; j < ashPos.length / 3; j++) {
        ashPos[j * 3 + 1] -= 0.08;
        if (ashPos[j * 3 + 1] < 0) {
          ashPos[j * 3 + 1] = 28;
        }
      }
      ashParticles.geometry.attributes.position.needsUpdate = true;
    } else {
      ashParticles.material.opacity = 0.0;
    }
  }

  // Update Percikan Api Kawah
  if (fireSparks) {
    if (volcanoState === 'ERUPTION') {
      fireSparks.material.opacity = 0.8;
      const firePos = fireSparks.geometry.attributes.position.array;
      for (let k = 0; k < firePos.length / 3; k++) {
        firePos[k * 3 + 1] += 0.35;
        firePos[k * 3 + 0] += (Math.random() - 0.5) * 0.4;
        firePos[k * 3 + 2] += (Math.random() - 0.5) * 0.4;
        if (firePos[k * 3 + 1] > 28) {
          firePos[k * 3 + 1] = 14.5;
          firePos[k * 3 + 0] = (Math.random() - 0.5) * 1.5;
          firePos[k * 3 + 2] = (Math.random() - 0.5) * 1.5;
        }
      }
      fireSparks.geometry.attributes.position.needsUpdate = true;
    } else {
      fireSparks.material.opacity = 0.0;
    }
  }
}

/**
 * Update Animasi Lava & Cahaya Pijar
 */
function updateLava(delta, time) {
  if (!lavaMesh) return;

  if (volcanoState === 'NORMAL') {
    lavaMesh.material.emissiveIntensity = 1.0 + Math.sin(time * 2) * 0.2;
    pointLightCrater.intensity = 2.5 + Math.sin(time * 2) * 0.5;
    if (magmaChamberMesh) magmaChamberMesh.material.emissiveIntensity = 1.2;
  } else if (volcanoState === 'WARNING') {
    lavaMesh.material.emissiveIntensity = 2.2 + Math.sin(time * 5) * 0.6;
    pointLightCrater.intensity = 5.0 + Math.sin(time * 5) * 1.5;
    if (magmaChamberMesh) magmaChamberMesh.material.emissiveIntensity = 2.0;
  } else if (volcanoState === 'ERUPTION') {
    // Berdenyut hebat
    lavaMesh.material.emissiveIntensity = 3.5 + Math.sin(time * 12) * 1.2;
    pointLightCrater.intensity = 8.0 + Math.sin(time * 10) * 3.0;
    if (magmaChamberMesh) magmaChamberMesh.material.emissiveIntensity = 3.5;
  }
}

/**
 * Sinkronisasi Posisi Penanda 3D ke Layar (HTML Billboard Marker Pins)
 */
function updateMarkersPosition() {
  const container = document.getElementById('canvas-container');
  if (!container) return;
  const width = container.clientWidth;
  const height = container.clientHeight;

  markers.forEach(m => {
    const el = document.getElementById(`pin-${m.id}`);
    if (!el) return;

    // Proyeksikan vektor 3D ke koordinat layar 2D
    const screenPos = m.pos.clone().project(camera);

    // Cek apakah berada di depan kamera (z < 1)
    if (screenPos.z < 1) {
      const x = (screenPos.x * 0.5 + 0.5) * width;
      const y = (-(screenPos.y * 0.5) + 0.5) * height;
      el.style.display = 'block';
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    } else {
      el.style.display = 'none';
    }
  });
}

/**
 * ============================================================================
 * 11. SEQUENCE ERUPSI & STATE MANAGEMENT
 * ============================================================================
 */
function setVolcanoState(newState) {
  volcanoState = newState;
  const statusText = document.getElementById('status-text');
  const statusBadge = document.getElementById('status-badge');

  // Perbarui UI Status
  if (statusBadge && statusText) {
    statusBadge.className = 'status-badge';
    if (newState === 'NORMAL') {
      statusText.innerText = 'AKTIVITAS NORMAL (LEVEL I)';
      if (rumbleGainNode) rumbleGainNode.gain.setTargetAtTime(0.0, audioCtx ? audioCtx.currentTime : 0, 0.5);
    } else if (newState === 'WARNING') {
      statusBadge.classList.add('warning');
      statusText.innerText = 'AKTIVITAS MENINGKAT (LEVEL II - III)';
      if (rumbleGainNode) rumbleGainNode.gain.setTargetAtTime(0.18, audioCtx ? audioCtx.currentTime : 0, 0.5);
    } else if (newState === 'ERUPTION') {
      statusBadge.classList.add('eruption');
      statusText.innerText = 'ERUPSI AKTIF (LEVEL IV AWAS)';
      if (rumbleGainNode) rumbleGainNode.gain.setTargetAtTime(0.45, audioCtx ? audioCtx.currentTime : 0, 0.5);
    }
  }

  // Update State Hewan
  animals.forEach(a => {
    if (newState === 'NORMAL') a.state = 'NORMAL';
    else if (newState === 'WARNING') a.state = 'WARNING';
    else if (newState === 'ERUPTION') a.state = 'FLEE';
  });

  // Update State Burung
  birds.forEach(b => {
    if (newState === 'NORMAL') b.state = 'NORMAL';
    else if (newState === 'WARNING') b.state = 'NORMAL';
    else if (newState === 'ERUPTION') b.state = 'FLEE';
  });

  // Update Active Button UI
  document.querySelectorAll('.btn-state').forEach(b => b.classList.remove('active'));
  if (newState === 'NORMAL') document.getElementById('btn-normal')?.classList.add('active');
  if (newState === 'WARNING') document.getElementById('btn-warning')?.classList.add('active');
  if (newState === 'ERUPTION') document.getElementById('btn-erupt')?.classList.add('active');
}

/**
 * Menjalankan sequence erupsi lengkap (Tahap 1 -> Tahap 2 -> Tahap 3)
 */
function startEruption() {
  isEruptingSequence = true;
  eruptionTimer = 0;
  showToast('Memulai Sequence Simulasi Erupsi Bertahap...');
  setVolcanoState('WARNING');
}

function updateEruptionSequence(elapsed) {
  const progressBar = document.getElementById('timeline-progress');
  const maxTime = 14;
  const progressPercent = Math.min((elapsed / maxTime) * 100, 100);
  if (progressBar) progressBar.style.width = `${progressPercent}%`;

  // Tahap 1: 0 - 4 detik (Aktivitas Awal / Gempa Tremor Rendah)
  if (elapsed < 4) {
    // Sinyal getaran ringan sudah dihandle
  }
  // Tahap 2: 4 - 8 detik (Aktivitas Meningkat Kuat)
  else if (elapsed < 8) {
    // Hewan waspada
  }
  // Tahap 3: 8 detik ke atas (Erupsi Penuh)
  else {
    if (volcanoState !== 'ERUPTION') {
      setVolcanoState('ERUPTION');
      showToast('ERUPSI PLINIAN DIMULAI: Kolom abu naik & Satwa mengungsi!');
    }
  }

  if (elapsed >= maxTime) {
    isEruptingSequence = false;
  }
}

/**
 * Reset Simulasi ke Kondisi Awal
 */
function resetSimulation() {
  isEruptingSequence = false;
  eruptionTimer = 0;
  const progressBar = document.getElementById('timeline-progress');
  if (progressBar) progressBar.style.width = '0%';

  setVolcanoState('NORMAL');

  // Kembalikan posisi hewan ke titik awal
  animals.forEach(a => {
    a.mesh.position.copy(a.initialPos);
    a.state = 'NORMAL';
  });

  // Kembalikan burung ke orbit normal
  birds.forEach((b, i) => {
    b.state = 'NORMAL';
    b.angle = (i / birds.length) * Math.PI * 2;
  });

  resetCamera();
  showToast('Simulasi berhasil di-reset ke kondisi normal.');
}

/**
 * Reset Kamera ke Sudut Default
 */
function resetCamera() {
  if (controls) {
    controls.target.set(0, 6, 0);
  }
  camera.position.set(0, 18, 38);
}

/**
 * Alihkan Mode Penampang (Cutaway)
 */
function toggleCutawayMode(enable) {
  isCutawayMode = enable;
  if (fullMountainGroup && cutawayGroup) {
    fullMountainGroup.visible = !isCutawayMode;
    cutawayGroup.visible = isCutawayMode;
  }

  const btnNormal = document.getElementById('mode-full');
  const btnCutaway = document.getElementById('mode-cutaway');
  if (btnNormal && btnCutaway) {
    if (isCutawayMode) {
      btnNormal.classList.remove('active');
      btnCutaway.classList.add('active');
      showToast('Mode Penampang Dalam Aktif: Memperlihatkan Kamar Magma & Saluran Pipa');
    } else {
      btnNormal.classList.add('active');
      btnCutaway.classList.remove('active');
      showToast('Mode Normal (Gunung Utuh) Aktif');
    }
  }
}

/**
 * ============================================================================
 * 12. RAYCASTER & INTERAKSI OBJEK
 * ============================================================================
 */
function onPointerDown(event) {
  // Hanya proses jika target adalah canvas
  if (event.target.tagName !== 'CANVAS') return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const hit = intersects[0].object;
    // Cek objek mana yang diklik
    if (hit === lavaMesh) {
      showIndicatorInfo('lava');
    } else if (hit === magmaChamberMesh) {
      showInfo('Kamar Magma (Magma Chamber)', 'Kantung batuan cair bersuhu lebih dari 1.000°C di kedalaman kerak bumi yang menjadi reservoir tekanan vulkanik.');
    }
  }
}

/**
 * ============================================================================
 * 13. PANEL INFORMASI EDUKASI & UI
 * ============================================================================
 */
function showInfo(title, desc, callout = null) {
  const panel = document.getElementById('info-panel');
  const titleEl = document.getElementById('info-title');
  const descEl = document.getElementById('info-desc');
  const calloutEl = document.getElementById('info-callout');

  if (panel && titleEl && descEl) {
    titleEl.innerText = title;
    descEl.innerText = desc;
    if (calloutEl) {
      if (callout) {
        calloutEl.innerHTML = `<span class="bold">Simulasi Parameter:</span> ${callout}`;
        calloutEl.style.display = 'block';
      } else {
        calloutEl.style.display = 'none';
      }
    }
    panel.style.display = 'block';
  }
}

function hideInfo() {
  const panel = document.getElementById('info-panel');
  if (panel) panel.style.display = 'none';
}

function showIndicatorInfo(key) {
  const data = INDICATOR_DATA[key];
  if (data) {
    showInfo(data.title, data.desc, data.callout);
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerText = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

/**
 * ============================================================================
 * 14. MEMBUAT ELEMEN UI & EVENT LISTENERS
 * ============================================================================
 */
function createUI() {
  // Bind Tombol Status
  document.getElementById('btn-normal')?.addEventListener('click', () => setVolcanoState('NORMAL'));
  document.getElementById('btn-warning')?.addEventListener('click', () => setVolcanoState('WARNING'));
  document.getElementById('btn-erupt')?.addEventListener('click', startEruption);
  document.getElementById('btn-reset')?.addEventListener('click', resetSimulation);
  document.getElementById('btn-reset-cam')?.addEventListener('click', resetCamera);
  document.getElementById('btn-sound')?.addEventListener('click', toggleAudio);

  // Bind Mode Penampang
  document.getElementById('mode-full')?.addEventListener('click', () => toggleCutawayMode(false));
  document.getElementById('mode-cutaway')?.addEventListener('click', () => toggleCutawayMode(true));

  // Bind 7 Indikator Aktivitas Vulkanik
  document.querySelectorAll('.indicator-item').forEach(item => {
    item.addEventListener('click', function() {
      const type = this.getAttribute('data-type');
      showIndicatorInfo(type);
    });
  });

  // Buat HTML Billboard Pins
  const overlay = document.getElementById('canvas-container');
  markers.forEach(m => {
    const pin = document.createElement('div');
    pin.id = `pin-${m.id}`;
    pin.className = 'marker-pin';
    pin.innerText = m.name;
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      showInfo(m.name, m.desc);
    });
    overlay.appendChild(pin);
  });

  // Inisialisasi visualizer seismograf mini
  initSeismographCanvas();
}

/**
 * Seismograf Sederhana (Canvas 2D)
 */
function initSeismographCanvas() {
  const canvas = document.getElementById('seismo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let offset = 0;

  function drawSeismo() {
    requestAnimationFrame(drawSeismo);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.2;
    ctx.beginPath();

    const midY = canvas.height / 2;
    const amp = volcanoState === 'ERUPTION' ? 24 : (volcanoState === 'WARNING' ? 12 : 2.5);

    for (let x = 0; x < canvas.width; x++) {
      const wave = Math.sin((x + offset) * 0.15) * Math.sin((x + offset) * 0.05) * amp;
      const noise = (Math.random() - 0.5) * (amp * 0.8);
      const y = midY + wave + noise;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    offset += volcanoState === 'ERUPTION' ? 6 : (volcanoState === 'WARNING' ? 3 : 1);
  }
  drawSeismo();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Jalankan saat DOM selesai dimuat
window.addEventListener('DOMContentLoaded', init);
