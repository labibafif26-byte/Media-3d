/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { VolcanoState, MarkerItem, ParticleSettings } from '../types';
import { VOLCANO_MARKERS } from '../data/volcanoData';
import { Download, Sparkles, Check, X, Info, RotateCcw, AlertCircle } from 'lucide-react';

// Standard Volcanic Emitter & Object Coordinate Constants
export const VOLCANO_POSITION: [number, number, number] = [0, 0, 0];
export const CRATER_POSITION: [number, number, number] = [0, 15.5, 0];
export const SMOKE_EMITTER_POSITION: [number, number, number] = [0, 15.6, 0];
export const LAVA_START_POSITION: [number, number, number] = [0, 15.3, 0];
export const ASH_EMITTER_POSITION: [number, number, number] = [0, 16.0, 0];

interface VolcanoSceneProps {
  volcanoState: VolcanoState;
  isCutaway: boolean;
  selectedMarkerId: string | null;
  onSelectMarker: (marker: MarkerItem) => void;
  cameraPreset: 'default' | 'crater' | 'cutaway' | 'wildlife' | 'seismograph' | 'flank' | 'signs_overview' | string;
  particleSettings: ParticleSettings;
  onToast: (message: string) => void;
  showHotspots?: boolean;
  isCalderaFormed?: boolean;
  activeHighlightPosition?: [number, number, number] | null;
}

interface DeerInstance {
  group: THREE.Group;
  legs: THREE.Mesh[];
  head: THREE.Group;
  tail: THREE.Mesh;
  initialPos: THREE.Vector3;
  fleeTarget: THREE.Vector3;
  wanderTarget: THREE.Vector3;
  currentVelocity: THREE.Vector3;
  speed: number;
  idleTimer: number;
  isGrazing: boolean;
}

interface BirdInstance {
  group: THREE.Group;
  leftWing: THREE.Mesh;
  rightWing: THREE.Mesh;
  orbitRadius: number;
  orbitHeight: number;
  orbitSpeed: number;
  angle: number;
  currentVelocity: THREE.Vector3;
  fleeDirection: THREE.Vector3;
}

interface VolcanicBomb {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  active: boolean;
  initialPos: THREE.Vector3;
}

interface TreeInstance {
  group: THREE.Group;
  phase: number;
  baseZRotation: number;
}


export const VolcanoScene: React.FC<VolcanoSceneProps> = ({
  volcanoState,
  isCutaway,
  selectedMarkerId,
  onSelectMarker,
  cameraPreset,
  particleSettings,
  onToast,
  showHotspots = true,
  isCalderaFormed = false,
  activeHighlightPosition = null
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Group references
  const fullMountainGroupRef = useRef<THREE.Group | null>(null);
  const calderaMountainGroupRef = useRef<THREE.Group | null>(null);
  const cutawayGroupRef = useRef<THREE.Group | null>(null);
  const customGLBGroupRef = useRef<THREE.Group | null>(null);
  const highlightBeaconRef = useRef<THREE.Group | null>(null);
  const lavaMeshRef = useRef<THREE.Mesh | null>(null);
  const lavaStreamsRef = useRef<THREE.Mesh[]>([]);
  const lavaLakeRef = useRef<THREE.Mesh | null>(null);
  const magmaChamberRef = useRef<THREE.Mesh | null>(null);
  const craterLightRef = useRef<THREE.PointLight | null>(null);
  const lavaFlowLightRef = useRef<THREE.PointLight | null>(null);
  const riverWaterRef = useRef<THREE.Mesh | null>(null);
  const flankVentRef = useRef<THREE.Mesh | null>(null);
  const flankLavaRef = useRef<THREE.Mesh | null>(null);

  // Particle systems
  const smokePointsRef = useRef<THREE.Points | null>(null);
  const ashPointsRef = useRef<THREE.Points | null>(null);
  const embersPointsRef = useRef<THREE.Points | null>(null);
  const lavaParticlesRef = useRef<THREE.Points | null>(null);
  const volcanicBombsRef = useRef<VolcanicBomb[]>([]);

  // Dynamic particle data arrays
  const lavaStreamDataRef = useRef<{
    t: Float32Array;
    speed: Float32Array;
    curveIdx: Int8Array;
    drift: Float32Array;
  } | null>(null);

  const ashDataRef = useRef<{
    velocities: Float32Array;
    turbulences: Float32Array;
    lifetimes: Float32Array;
  } | null>(null);

  // Fauna & Flora
  const deerListRef = useRef<DeerInstance[]>([]);
  const birdsListRef = useRef<BirdInstance[]>([]);
  const treesListRef = useRef<TreeInstance[]>([]);

  // State refs for renderLoop
  const stateRef = useRef(volcanoState);
  stateRef.current = volcanoState;
  const particleSettingsRef = useRef(particleSettings);
  particleSettingsRef.current = particleSettings;

  // 2D Marker projection positions & loading state
  const [markerScreenCoords, setMarkerScreenCoords] = useState<{ [key: string]: { x: number; y: number; visible: boolean } }>({});
  const [isPreparing, setIsPreparing] = useState<boolean>(true);
  const [modelLoadingError, setModelLoadingError] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedSuccess, setExportedSuccess] = useState<boolean>(false);

  // Frame counter for throttled marker updates
  const frameCountRef = useRef(0);

  // 3 Natural Lava Stream Curves carved down mountain flutes
  const lavaCurves = useRef<THREE.CatmullRomCurve3[]>([
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.5, 14.2, 0.4),
      new THREE.Vector3(1.8, 12.8, 1.8),
      new THREE.Vector3(3.2, 10.2, 3.4),
      new THREE.Vector3(5.1, 7.2, 5.2),
      new THREE.Vector3(7.4, 4.1, 7.6),
      new THREE.Vector3(10.2, 1.2, 10.8),
      new THREE.Vector3(13.0, 0.35, 13.5)
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, 14.1, -0.3),
      new THREE.Vector3(-1.9, 12.4, -1.2),
      new THREE.Vector3(-3.8, 9.6, -1.8),
      new THREE.Vector3(-6.2, 6.4, -1.2),
      new THREE.Vector3(-9.0, 3.2, 0.2),
      new THREE.Vector3(-12.4, 0.4, 1.8)
    ]),
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, 14.2, 0.5),
      new THREE.Vector3(-2.2, 12.2, 2.2),
      new THREE.Vector3(-4.2, 9.4, 4.2),
      new THREE.Vector3(-6.8, 6.2, 6.5),
      new THREE.Vector3(-9.6, 3.0, 8.8),
      new THREE.Vector3(-12.8, 0.38, 11.5)
    ])
  ]).current;

  // Helper: Procedural Noise Texture for Realistic PBR Rock Roughness & Bump
  const createNoiseTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const imgData = ctx.createImageData(256, 256);
    const data = imgData.data;

    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const i = (y * 256 + x) * 4;
        const n1 = Math.sin(x * 0.08) * Math.cos(y * 0.08);
        const n2 = Math.sin(x * 0.2 + y * 0.15) * 0.5;
        const n3 = (Math.random() - 0.5) * 0.4;
        const val = Math.floor(Math.min(255, Math.max(0, (n1 + n2 + n3 + 1.2) * 100)));
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  };

  // Helper: Circular radial gradient texture for soft billboard particles
  const createRadialTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(255,255,255,0.85)');
    grad.addColorStop(0.65, 'rgba(255,255,255,0.25)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Helper: Procedural Molten Lava Texture with glowing cracks and basalt crust
  const createLavaTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1c0702';
    ctx.fillRect(0, 0, 256, 256);

    ctx.lineWidth = 6;
    ctx.strokeStyle = '#ff3300';
    ctx.filter = 'blur(4px)';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      ctx.moveTo(Math.random() * 256, 0);
      ctx.bezierCurveTo(
        Math.random() * 256, 80,
        Math.random() * 256, 160,
        Math.random() * 256, 256
      );
    }
    ctx.stroke();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffcc00';
    ctx.filter = 'none';
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 4);
    return tex;
  };

  // Helper: Procedural Geological Strata Cross-Section Texture for X-Ray Penampang Melintang
  const createStrataTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base background: earthy deep crust bedrock
    ctx.fillStyle = '#292524';
    ctx.fillRect(0, 0, 512, 512);

    // Draw stratified geological layers (selang-seling batuan andesit, abu tefra, and lapili)
    const layers = [
      { y: 0, h: 45, color: '#1c1917' }, // Basaltic Summit & Ash
      { y: 45, h: 40, color: '#78350f' }, // Oxidized Lava Layer
      { y: 85, h: 55, color: '#b45309' }, // Pyroclastic Tuff Ash
      { y: 140, h: 45, color: '#44403c' }, // Andesite Solidified Flow
      { y: 185, h: 60, color: '#d97706' }, // Pumice & Tephra Fall
      { y: 245, h: 50, color: '#57534e' }, // Breccia & Ancient Basalt
      { y: 295, h: 65, color: '#9a3412' }, // Consolidated Magma Crust
      { y: 360, h: 60, color: '#713f12' }, // Sedimentary Bedrock
      { y: 420, h: 92, color: '#18181b' }  // Deep Lithosphere Basement
    ];

    layers.forEach(l => {
      ctx.fillStyle = l.color;
      ctx.fillRect(0, l.y, 512, l.h);

      // Add noise grain & horizontal geological striations
      ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
      for (let i = 0; i < 18; i++) {
        const ry = l.y + Math.random() * l.h;
        ctx.fillRect(0, ry, 512, 1.2 + Math.random() * 2);
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      for (let i = 0; i < 18; i++) {
        const ry = l.y + Math.random() * l.h;
        ctx.fillRect(0, ry, 512, 1.2 + Math.random() * 2);
      }
    });

    // Add vertical thermal glow near conduit axis (x=0)
    const thermalGrad = ctx.createLinearGradient(0, 0, 140, 0);
    thermalGrad.addColorStop(0, 'rgba(255, 69, 0, 0.7)');
    thermalGrad.addColorStop(0.35, 'rgba(255, 120, 0, 0.25)');
    thermalGrad.addColorStop(1, 'rgba(255, 120, 0, 0)');
    ctx.fillStyle = thermalGrad;
    ctx.fillRect(0, 0, 140, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  };

  // Export Scene as GLB / glTF 2.0
  const handleExportGLB = () => {
    if (!sceneRef.current) return;
    setIsExporting(true);

    const exporter = new GLTFExporter();
    exporter.parse(
      sceneRef.current,
      (gltf) => {
        const output = gltf instanceof ArrayBuffer ? gltf : JSON.stringify(gltf, null, 2);
        const blob = new Blob([output], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'volcano_tropical_environment.glb';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsExporting(false);
        setExportedSuccess(true);
        onToast('Model GLB 3D berhasil diekspor dan diunduh!');
        setTimeout(() => setExportedSuccess(false), 4000);
      },
      (error) => {
        console.error('GLTFExporter error:', error);
        setIsExporting(false);
        onToast('Gagal mengekspor GLB: ' + error);
      },
      { binary: true }
    );
  };

  // Try Loading Custom GLB models (volcano.glb or gunung-api.glb)
  const tryLoadCustomGLB = (scene: THREE.Scene) => {
    const loader = new GLTFLoader();
    const candidatePaths = ['/models/volcano.glb', '/models/gunung-api.glb'];
    let attempted = 0;

    const tryNext = () => {
      if (attempted >= candidatePaths.length) {
        // Fallback procedural mountain stays active seamlessly
        setModelLoadingError(false);
        setIsPreparing(false);
        return;
      }

      const path = candidatePaths[attempted];
      attempted++;

      loader.load(
        path,
        (gltf) => {
          if (fullMountainGroupRef.current) {
            fullMountainGroupRef.current.visible = false;
          }
          const model = gltf.scene;
          model.name = 'Volcano_Main_Imported';

          // Auto-calculate bounding box and normalize scale & origin
          const bbox = new THREE.Box3().setFromObject(model);
          const size = bbox.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const desiredScale = 28 / maxDim;
            model.scale.setScalar(desiredScale);
          }

          // Recalculate center after scaling and align to world origin
          bbox.setFromObject(model);
          const center = bbox.getCenter(new THREE.Vector3());
          model.position.x -= center.x;
          model.position.z -= center.z;
          model.position.y -= bbox.min.y; // Align base of volcano to ground level y = 0

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          customGLBGroupRef.current = model;
          scene.add(model);
          onToast(`Model 3D ${path.split('/').pop()} berhasil dimuat!`);
          setIsPreparing(false);
          setModelLoadingError(false);
        },
        undefined,
        () => {
          tryNext();
        }
      );
    };

    tryNext();
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene: Realistic Tropical Sky with Atmospheric Fog
    const scene = new THREE.Scene();
    scene.name = 'Tropical_Volcano_World';
    scene.background = new THREE.Color(0x60a5fa);
    scene.fog = new THREE.FogExp2(0x93c5fd, 0.0055);
    sceneRef.current = scene;

    // 2. Wide-Angle Cinematic Camera
    const camera = new THREE.PerspectiveCamera(46, container.clientWidth / container.clientHeight, 0.5, 1200);
    camera.position.set(-14, 13, 34);
    cameraRef.current = camera;

    // 3. Renderer with ACES Filmic Tone Mapping and Soft PCF Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls with Natural Damping and Ground Polar Limits (Section 6)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going underground
    controls.minDistance = 6;
    controls.maxDistance = 110;
    controls.target.set(0, 6.0, 0);
    controlsRef.current = controls;

    // 5. Physically-Based Lighting Setup (Section 5)
    const sunLight = new THREE.DirectionalLight(0xfff3db, 2.6);
    sunLight.name = 'SunLight_GoldenHour';
    sunLight.position.set(-36, 42, 24);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 180;
    sunLight.shadow.camera.left = -40;
    sunLight.shadow.camera.right = 40;
    sunLight.shadow.camera.top = 40;
    sunLight.shadow.camera.bottom = -40;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x15803d, 1.1);
    hemiLight.name = 'Sky_Atmospheric_Light';
    scene.add(hemiLight);

    const softAmbient = new THREE.AmbientLight(0xfff8ee, 0.7);
    scene.add(softAmbient);

    const craterPointLight = new THREE.PointLight(0xff4500, 4.2, 50, 1.2);
    craterPointLight.name = 'Light_Crater_Glow';
    craterPointLight.position.set(0, 14.8, 0);
    scene.add(craterPointLight);
    craterLightRef.current = craterPointLight;

    const lavaFlowLight = new THREE.PointLight(0xff6600, 2.5, 34, 1.4);
    lavaFlowLight.name = 'Light_Lava_Stream';
    lavaFlowLight.position.set(6.0, 5.0, 6.5);
    scene.add(lavaFlowLight);
    lavaFlowLightRef.current = lavaFlowLight;

    // 6. Base Ocean & Island Terrain (Tropical Coast)
    const oceanGeo = new THREE.CylinderGeometry(52, 56, 2.0, 64);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.12,
      metalness: 0.85,
      transparent: true,
      opacity: 0.94
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.name = 'Ocean_Surrounding';
    ocean.position.y = -1.5;
    scene.add(ocean);

    const islandGeo = new THREE.CylinderGeometry(30, 33, 2.2, 64);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x15803d,
      roughness: 0.85,
      metalness: 0.05
    });
    const island = new THREE.Mesh(islandGeo, islandMat);
    island.name = 'Island_Landmass';
    island.position.y = -0.6;
    island.receiveShadow = true;
    scene.add(island);

    const beachGeo = new THREE.RingGeometry(27.5, 31.0, 48);
    const beachMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.92,
      side: THREE.DoubleSide
    });
    const beach = new THREE.Mesh(beachGeo, beachMat);
    beach.name = 'Beach_GoldenFringe';
    beach.rotation.x = -Math.PI / 2;
    beach.position.y = 0.32;
    beach.receiveShadow = true;
    scene.add(beach);

    // 7. Sky Clouds & Cumulus Layers
    const cloudsGroup = new THREE.Group();
    cloudsGroup.name = 'Clouds_Layer';
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      flatShading: true
    });
    const cloudClusters = [
      { x: -26, y: 26, z: -18, s: 3.5 },
      { x: -21, y: 27, z: -17, s: 4.2 },
      { x: -16, y: 25, z: -19, s: 3.0 },
      { x: 26, y: 28, z: -12, s: 4.0 },
      { x: 31, y: 29, z: -10, s: 4.6 },
      { x: 22, y: 27, z: -15, s: 3.2 }
    ];
    cloudClusters.forEach((c, idx) => {
      const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(c.s, 1), cloudMat);
      puff.name = `Cloud_Puff_${idx}`;
      puff.position.set(c.x, c.y, c.z);
      cloudsGroup.add(puff);
    });
    scene.add(cloudsGroup);

    // 8. Detailed Foreground & Flowing River
    buildForegroundAndRiver(scene);

    // 9. Procedural Stratovolcano
    buildProceduralStratovolcano(scene);

    // 10. Multi-Layer Particle Systems
    buildParticleSystems(scene);

    // 11. Tropical Jungle Forest
    buildTropicalForest(scene);

    // 12. 3D Wildlife Fauna
    buildWildlife(scene);

    // 13. Load custom GLB if present
    tryLoadCustomGLB(scene);

    // 14. Raycaster for Interactive 3D Educational Object Inspection (Section 12)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (event: MouseEvent) => {
      if (!container || !cameraRef.current) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let target: THREE.Object3D | null = intersects[0].object;
        while (target && target.parent && target.parent !== scene && !target.name) {
          target = target.parent;
        }

        const objName = target?.name || intersects[0].object.name;
        if (objName) {
          // Sinkronisasi langsung ke Marker resmi agar hanya ada 1 popup terpadu yang konsisten
          let matchedMarker: MarkerItem | undefined;
          if (objName.includes('Volcano_Crater') || objName.includes('Crater') || objName.includes('Lava_Main') || objName.includes('Smoke')) {
            matchedMarker = VOLCANO_MARKERS.find(m => m.id === 'kawah');
          } else if (objName.includes('Conduit') || objName.includes('Vent')) {
            matchedMarker = VOLCANO_MARKERS.find(m => m.id === 'vent');
          } else if (objName.includes('Chamber') || objName.includes('Magma')) {
            matchedMarker = VOLCANO_MARKERS.find(m => m.id === 'chamber');
          } else if (objName.includes('Lava')) {
            matchedMarker = VOLCANO_MARKERS.find(m => m.id === 'lava');
          } else if (objName.includes('Station') || objName.includes('Monitoring')) {
            matchedMarker = VOLCANO_MARKERS.find(m => m.id === 'gempa');
          } else if (objName.includes('Deer') || objName.includes('Animal') || objName.includes('Bird')) {
            matchedMarker = VOLCANO_MARKERS.find(m => m.id === 'hewan');
          } else if (objName.includes('River') || objName.includes('Water')) {
            matchedMarker = VOLCANO_MARKERS.find(m => m.id === 'sungai');
          } else if (objName.includes('Tree') || objName.includes('Forest')) {
            matchedMarker = VOLCANO_MARKERS.find(m => m.id === 'hutan');
          } else if (objName.includes('Volcano') || objName.includes('Mountain') || objName.includes('Strata')) {
            matchedMarker = VOLCANO_MARKERS.find(m => m.id === 'strata');
          }

          if (matchedMarker && onSelectMarker) {
            onSelectMarker(matchedMarker);
          }
        }
      }
    };

    container.addEventListener('click', handleCanvasClick);

    // 14b. Highlight Target Beacon Group (Glow Ring & Pin Indicator)
    const highlightBeacon = new THREE.Group();
    highlightBeacon.name = 'Highlight_Beacon';
    highlightBeacon.visible = false;

    const beaconRingGeo = new THREE.RingGeometry(0.6, 1.4, 32);
    const beaconRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const beaconRing = new THREE.Mesh(beaconRingGeo, beaconRingMat);
    beaconRing.rotation.x = -Math.PI / 2;
    beaconRing.position.y = 0.05;
    highlightBeacon.add(beaconRing);

    // Floating downward-pointing 3D marker cone directly over target
    const beaconPointerGeo = new THREE.ConeGeometry(0.4, 1.1, 16);
    beaconPointerGeo.rotateX(Math.PI); // Points downward at target
    const beaconPointerMat = new THREE.MeshBasicMaterial({
      color: 0xffd600,
      transparent: true,
      opacity: 0.95
    });
    const beaconPointer = new THREE.Mesh(beaconPointerGeo, beaconPointerMat);
    beaconPointer.position.y = 1.35;
    highlightBeacon.add(beaconPointer);

    const beaconSphereGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const beaconSphereMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0.95
    });
    const beaconSphere = new THREE.Mesh(beaconSphereGeo, beaconSphereMat);
    beaconSphere.position.y = 2.05;
    highlightBeacon.add(beaconSphere);

    scene.add(highlightBeacon);
    highlightBeaconRef.current = highlightBeacon;

    // 15. Real-Time Render Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();
      const currentVolcanoState = stateRef.current;
      const currentParticleSettings = particleSettingsRef.current;

      const isErupting = currentVolcanoState === 'ERUPTION' || currentVolcanoState === 'ERUPSI';
      const isSiaga = currentVolcanoState === 'SIAGA';
      const isWaspada = currentVolcanoState === 'WASPADA' || currentVolcanoState === 'WARNING';
      const isNormal = !isErupting && !isSiaga && !isWaspada;

      controls.update();

      // Camera Shake bertingkat realistis sesuai tahapan aktivitas
      if (cameraRef.current) {
        if (isErupting) {
          // Tahap 4: Erupsi dahsyat mengguncang kamera
          cameraRef.current.position.x += (Math.random() - 0.5) * 0.045;
          cameraRef.current.position.y += (Math.random() - 0.5) * 0.045;
        } else if (isSiaga) {
          // Tahap 3: Menjelang erupsi, getaran visual perlahan terus-menerus
          cameraRef.current.position.x += (Math.random() - 0.5) * 0.016;
          cameraRef.current.position.y += (Math.random() - 0.5) * 0.016;
        } else if (isWaspada) {
          // Tahap 2: Peningkatan aktivitas, getaran mikro halus
          cameraRef.current.position.y += Math.sin(time * 14) * 0.005;
        }
        // Tahap 1 (Normal): Tanpa getaran
      }

      // Slow cloud drift across the sky
      cloudsGroup.position.x = Math.sin(time * 0.04) * 3;

      // Highlight Beacon Pulse Animation
      if (highlightBeaconRef.current && highlightBeaconRef.current.visible) {
        highlightBeaconRef.current.rotation.y = time * 2.2;
        const bPulse = 1.0 + Math.sin(time * 5.0) * 0.2;
        highlightBeaconRef.current.scale.set(bPulse, bPulse, bPulse);
      }

      // ==========================================
      // A. FLOWING RIVER ANIMATION
      // ==========================================
      if (riverWaterRef.current) {
        const geo = riverWaterRef.current.geometry as THREE.BufferGeometry;
        const pos = geo.attributes.position;
        if (pos) {
          const arr = pos.array as Float32Array;
          for (let i = 0; i < pos.count; i++) {
            const x = arr[i * 3 + 0];
            const z = arr[i * 3 + 2];
            const wave = Math.sin(x * 1.4 + time * 3.2) * 0.05 + Math.cos(z * 1.8 + time * 2.5) * 0.04;
            arr[i * 3 + 1] = 0.42 + wave;
          }
          pos.needsUpdate = true;
        }
      }

      // ==========================================
      // B. VEGETATION WIND SWAY
      // ==========================================
      const windIntensity = isErupting ? 0.15 : (isSiaga ? 0.095 : (isWaspada ? 0.055 : 0.025));
      treesListRef.current.forEach(t => {
        t.group.rotation.z = t.baseZRotation + Math.sin(time * 2.4 + t.phase) * windIntensity;
      });

      // ==========================================
      // C. DEER WILDLIFE BEHAVIOR & ANIMATION
      // ==========================================
      deerListRef.current.forEach((deer, idx) => {
        if (isNormal) {
          // Tahap 1 Normal: Santai merumput di padang rumput lereng barat daya
          const distToHome = deer.initialPos.distanceTo(deer.group.position);

          // Jika baru kembali dari erupsi/siaga, berjalan kembali ke padang rumput
          if (distToHome > 3.2) {
            const toHome = deer.initialPos.clone().sub(deer.group.position);
            toHome.y = 0;
            const walkSpeed = 1.6;
            const targetVel = toHome.normalize().multiplyScalar(walkSpeed);
            deer.currentVelocity.lerp(targetVel, delta * 2.5);
            deer.group.position.addScaledVector(deer.currentVelocity, delta);

            const lookTarget = deer.group.position.clone().add(deer.currentVelocity);
            deer.group.lookAt(lookTarget.x, deer.group.position.y, lookTarget.z);

            const walkSwing = Math.sin(time * 7 + idx) * 0.45;
            deer.legs[0].rotation.x = walkSwing;
            deer.legs[1].rotation.x = -walkSwing;
            deer.legs[2].rotation.x = -walkSwing;
            deer.legs[3].rotation.x = walkSwing;
            deer.head.rotation.x = 0.1;
          } else {
            // Rutinitas merumput dan berkelana santai di area aman
            deer.idleTimer -= delta;
            if (deer.idleTimer <= 0) {
              deer.isGrazing = !deer.isGrazing;
              if (deer.isGrazing) {
                deer.idleTimer = 3.5 + Math.random() * 4.0;
              } else {
                const angle = Math.random() * Math.PI * 2;
                const dist = 0.8 + Math.random() * 2.0;
                deer.wanderTarget.set(
                  deer.initialPos.x + Math.cos(angle) * dist,
                  0.35,
                  deer.initialPos.z + Math.sin(angle) * dist
                );
                deer.idleTimer = 4.0 + Math.random() * 3.5;
              }
            }

            if (deer.isGrazing) {
              deer.head.rotation.x = THREE.MathUtils.lerp(deer.head.rotation.x, 0.55, delta * 3);
              deer.head.rotation.y = Math.sin(time * 2 + idx) * 0.1;
              deer.currentVelocity.set(0, 0, 0);
              deer.legs.forEach(l => { l.rotation.x = THREE.MathUtils.lerp(l.rotation.x, 0, delta * 4); });
            } else {
              const toWander = deer.wanderTarget.clone().sub(deer.group.position);
              toWander.y = 0;
              const dist = toWander.length();

              const targetVel = dist > 0.3 ? toWander.normalize().multiplyScalar(0.7) : new THREE.Vector3(0, 0, 0);
              deer.currentVelocity.lerp(targetVel, delta * 2.5);
              deer.group.position.addScaledVector(deer.currentVelocity, delta);

              if (deer.currentVelocity.length() > 0.05) {
                const lookTarget = deer.group.position.clone().add(deer.currentVelocity);
                deer.group.lookAt(lookTarget.x, deer.group.position.y, lookTarget.z);
                const legSwing = Math.sin(time * 6 + idx) * 0.35;
                deer.legs[0].rotation.x = legSwing;
                deer.legs[1].rotation.x = -legSwing;
                deer.legs[2].rotation.x = -legSwing;
                deer.legs[3].rotation.x = legSwing;
              } else {
                deer.legs.forEach(l => { l.rotation.x = THREE.MathUtils.lerp(l.rotation.x, 0, delta * 4); });
              }
              deer.head.rotation.x = THREE.MathUtils.lerp(deer.head.rotation.x, 0, delta * 3);
            }
          }
          deer.tail.rotation.x = Math.sin(time * 5 + idx) * 0.2;

        } else if (isWaspada) {
          // Tahap 2 Aktivitas Meningkat: Berhenti makan, kepala tegak menatap puncak kawah, ekor berkedut
          deer.currentVelocity.lerp(new THREE.Vector3(0, 0, 0), delta * 4);
          deer.group.position.addScaledVector(deer.currentVelocity, delta);
          deer.legs.forEach(l => { l.rotation.x = THREE.MathUtils.lerp(l.rotation.x, 0, delta * 5); });
          
          // Satwa memandang cemas ke arah puncak gunung api (0, 14.8, 0)
          deer.group.lookAt(0, deer.group.position.y, 0);
          deer.head.rotation.x = -0.38 + Math.sin(time * 6 + idx) * 0.12;
          deer.tail.rotation.x = 0.45 + Math.sin(time * 12 + idx) * 0.25;

        } else if (isSiaga) {
          // Tahap 3 Aktivitas Tinggi: Bergerak menjauh bersama kawanan menuju tempat aman di tepi hutan
          const toFlee = deer.fleeTarget.clone().sub(deer.group.position);
          toFlee.y = 0;
          const dist = toFlee.length();

          if (dist > 1.0) {
            const trotSpeed = 3.8 + idx * 0.4;
            const targetVel = toFlee.normalize().multiplyScalar(trotSpeed);
            deer.currentVelocity.lerp(targetVel, delta * 3.5);
            deer.group.position.addScaledVector(deer.currentVelocity, delta);

            const lookTarget = deer.group.position.clone().add(deer.currentVelocity);
            deer.group.lookAt(lookTarget.x, deer.group.position.y, lookTarget.z);

            const trotSwing = Math.sin(time * 14 + idx) * 0.65;
            deer.legs[0].rotation.x = trotSwing;
            deer.legs[1].rotation.x = -trotSwing;
            deer.legs[2].rotation.x = -trotSwing;
            deer.legs[3].rotation.x = trotSwing;
            deer.head.rotation.x = 0.05;
          } else {
            deer.currentVelocity.set(0, 0, 0);
            deer.legs.forEach(l => { l.rotation.x = THREE.MathUtils.lerp(l.rotation.x, 0, delta * 5); });
            deer.group.lookAt(0, deer.group.position.y, 0);
            deer.head.rotation.x = -0.35 + Math.sin(time * 6 + idx) * 0.1;
          }

        } else if (isErupting) {
          // Tahap 4 Erupsi: Berlari cepat ke naungan hutan terlindung di batas aman daratan
          const toFlee = deer.fleeTarget.clone().sub(deer.group.position);
          toFlee.y = 0;
          const dist = toFlee.length();

          if (dist > 0.6) {
            const sprintSpeed = 6.8 + idx * 0.6;
            const targetVel = toFlee.normalize().multiplyScalar(sprintSpeed);
            deer.currentVelocity.lerp(targetVel, delta * 4.5);
            deer.group.position.addScaledVector(deer.currentVelocity, delta);

            const lookTarget = deer.group.position.clone().add(deer.currentVelocity);
            deer.group.lookAt(lookTarget.x, deer.group.position.y, lookTarget.z);

            const fastSwing = Math.sin(time * 22 + idx) * 0.85;
            deer.legs[0].rotation.x = fastSwing;
            deer.legs[1].rotation.x = -fastSwing;
            deer.legs[2].rotation.x = -fastSwing;
            deer.legs[3].rotation.x = fastSwing;
            deer.head.rotation.x = 0.12;
          } else {
            // Sudah tiba di naungan aman hutan: bergerombol mengamati letusan dari jarak aman
            deer.currentVelocity.set(0, 0, 0);
            deer.legs.forEach(l => { l.rotation.x = THREE.MathUtils.lerp(l.rotation.x, 0, delta * 5); });
            deer.group.lookAt(0, deer.group.position.y, 0);
            deer.head.rotation.x = -0.3 + Math.sin(time * 8 + idx) * 0.1;
            deer.tail.rotation.x = 0.5 + Math.sin(time * 16 + idx) * 0.2;
          }
        }

        // ============================================================
        // PEMBATAS ZONA DARATAN AMAN (MENCEGAH RUSA MASUK KE AIR, SUNGAI, ATAU LAUT)
        // ============================================================
        // 1. Batasi sektor daratan lereng barat daya (x: [-21.5, -11.5], z: [-3.5, 7.5])
        // Area ini murni padang rumput hijau pegunungan, jauh dari sungai (sungai di x > -3) dan jauh dari laut (pantai di radius > 27)
        deer.group.position.x = Math.max(-21.5, Math.min(-11.5, deer.group.position.x));
        deer.group.position.z = Math.max(-3.5, Math.min(7.5, deer.group.position.z));

        // 2. Batasi radius agar selalu berada di padang rumput lereng bawah yang aman
        const currentDist = Math.hypot(deer.group.position.x, deer.group.position.z);
        if (currentDist > 22.5) {
          const factor = 22.5 / currentDist;
          deer.group.position.x *= factor;
          deer.group.position.z *= factor;
        } else if (currentDist < 13.0) {
          const factor = 13.0 / currentDist;
          deer.group.position.x *= factor;
          deer.group.position.z *= factor;
        }

        // 3. Ketinggian selalu kokoh di permukaan tanah daratan
        deer.group.position.y = 0.35;
      });

      // ==========================================
      // D. BIRDS FLIGHT & REACTION
      // ==========================================
      birdsListRef.current.forEach((bird, idx) => {
        const flapRate = isErupting ? 28 : (isSiaga ? 22 : (isWaspada ? 16 : 10));
        const flap = Math.sin(time * flapRate + idx) * 0.65;
        bird.leftWing.rotation.z = flap;
        bird.rightWing.rotation.z = -flap;

        if (isNormal) {
          // Tahap 1: Melayang santai di orbit normal
          bird.angle += bird.orbitSpeed;
          const x = Math.cos(bird.angle) * bird.orbitRadius;
          const z = Math.sin(bird.angle) * bird.orbitRadius;
          const y = bird.orbitHeight + Math.sin(time * 2.2 + idx) * 0.8;

          bird.group.position.lerp(new THREE.Vector3(x, y, z), delta * 3);
          const nextAngle = bird.angle + 0.1;
          bird.group.lookAt(Math.cos(nextAngle) * bird.orbitRadius, y, Math.sin(nextAngle) * bird.orbitRadius);

        } else if (isWaspada) {
          // Tahap 2: Burung mulai meninggalkan area sekitar puncak gunung (orbit melebar & meninggi)
          bird.angle += bird.orbitSpeed * 1.6;
          const wideRadius = bird.orbitRadius * 1.35;
          const x = Math.cos(bird.angle) * wideRadius;
          const z = Math.sin(bird.angle) * wideRadius;
          const y = bird.orbitHeight + 3.5 + Math.sin(time * 3.0 + idx) * 1.0;

          bird.group.position.lerp(new THREE.Vector3(x, y, z), delta * 3);
          const nextAngle = bird.angle + 0.1;
          bird.group.lookAt(Math.cos(nextAngle) * wideRadius, y, Math.sin(nextAngle) * wideRadius);

        } else {
          // Tahap 3 & 4: Burung menjauh terbang tinggi ke luar area gunung
          const speedScalar = isErupting ? 17.0 : 11.0;
          const targetVel = bird.fleeDirection.clone().multiplyScalar(speedScalar);
          targetVel.y += isErupting ? 5.0 : 3.5;
          bird.currentVelocity.lerp(targetVel, delta * 2.5);
          bird.group.position.addScaledVector(bird.currentVelocity, delta);

          const lookTarget = bird.group.position.clone().add(bird.currentVelocity);
          bird.group.lookAt(lookTarget);
        }
      });

      // ==========================================
      // E. VOLCANIC BOMBS (BALLISTIC FLYING ROCKS)
      // ==========================================
      if (isErupting) {
        const gravity = 9.8;
        volcanicBombsRef.current.forEach(bomb => {
          if (!bomb.active) {
            if (Math.random() < 0.04) {
              bomb.active = true;
              bomb.mesh.position.copy(bomb.initialPos);
              const angle = Math.random() * Math.PI * 2;
              const launchSpeed = 12 + Math.random() * 10;
              bomb.velocity.set(
                Math.cos(angle) * (4 + Math.random() * 6),
                launchSpeed,
                Math.sin(angle) * (4 + Math.random() * 6)
              );
              bomb.mesh.visible = true;
            }
          } else {
            bomb.velocity.y -= gravity * delta;
            bomb.mesh.position.addScaledVector(bomb.velocity, delta);
            bomb.mesh.rotation.x += delta * 4;
            bomb.mesh.rotation.y += delta * 3;

            if (bomb.mesh.position.y < 0.4) {
              bomb.active = false;
              bomb.mesh.visible = false;
            }
          }
        });
      } else {
        volcanicBombsRef.current.forEach(bomb => {
          bomb.active = false;
          bomb.mesh.visible = false;
        });
      }

      // ==========================================
      // F. PARTICLE SYSTEMS (LAVA, SMOKE, ASH, EMBERS)
      // ==========================================
      if (lavaParticlesRef.current && lavaStreamDataRef.current) {
        const streamData = lavaStreamDataRef.current;
        const posAttr = lavaParticlesRef.current.geometry.attributes.position;
        const colorAttr = lavaParticlesRef.current.geometry.attributes.color;
        const positions = posAttr.array as Float32Array;
        const colors = colorAttr.array as Float32Array;
        const count = positions.length / 3;

        const lavaInt = currentParticleSettings.lavaIntensity;
        const baseSpeedMult = isErupting ? 0.42 : (isSiaga ? 0.14 : 0.0);
        const effectiveSpeed = baseSpeedMult * lavaInt;

        const colorCoreYellow = new THREE.Color(1.0, 0.95, 0.2);
        const colorMidOrange = new THREE.Color(1.0, 0.45, 0.02);
        const colorOuterRed = new THREE.Color(0.9, 0.12, 0.02);
        const colorCrust = new THREE.Color(0.28, 0.05, 0.02);

        if (isErupting || isSiaga) {
          for (let i = 0; i < count; i++) {
            streamData.t[i] += streamData.speed[i] * effectiveSpeed * delta * 2.0;
            if (streamData.t[i] > 1.0) streamData.t[i] = 0.0;

            const cIdx = streamData.curveIdx[i];
            const curve = lavaCurves[cIdx];
            const pt = curve.getPointAt(streamData.t[i]);

            const angle = streamData.drift[i] * 6.28;
            const streamWidth = 0.25 + streamData.t[i] * 0.45;
            positions[i * 3 + 0] = pt.x + Math.cos(angle) * streamWidth;
            positions[i * 3 + 1] = pt.y + Math.sin(time * 3 + i) * 0.03;
            positions[i * 3 + 2] = pt.z + Math.sin(angle) * streamWidth;

            let col: THREE.Color;
            if (streamData.t[i] < 0.25) {
              col = colorCoreYellow.clone().lerp(colorMidOrange, streamData.t[i] / 0.25);
            } else if (streamData.t[i] < 0.65) {
              col = colorMidOrange.clone().lerp(colorOuterRed, (streamData.t[i] - 0.25) / 0.4);
            } else {
              col = colorOuterRed.clone().lerp(colorCrust, (streamData.t[i] - 0.65) / 0.35);
            }

            colors[i * 3 + 0] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;
          }

          posAttr.needsUpdate = true;
          colorAttr.needsUpdate = true;
        }

        const lavaPartMat = lavaParticlesRef.current.material as THREE.PointsMaterial;
        const targetOpacity = (isErupting ? 0.95 : (isSiaga ? 0.5 : 0.0)) * Math.min(lavaInt, 1.5);
        lavaPartMat.opacity = targetOpacity;
        lavaPartMat.size = 0.8 * Math.max(0.6, lavaInt);
      }

      if (smokePointsRef.current) {
        const pos = smokePointsRef.current.geometry.attributes.position.array as Float32Array;
        const count = pos.length / 3;
        const riseSpeed = isErupting ? 0.42 : (isSiaga ? 0.26 : (isWaspada ? 0.12 : 0.04));

        for (let i = 0; i < count; i++) {
          pos[i * 3 + 1] += riseSpeed;

          const h = pos[i * 3 + 1];
          if (h > 24) {
            const spreadFactor = isErupting ? 0.18 : (isSiaga ? 0.08 : 0.03);
            pos[i * 3 + 0] += (Math.random() - 0.5) * spreadFactor;
            pos[i * 3 + 2] += (Math.random() - 0.5) * spreadFactor;
          } else {
            pos[i * 3 + 0] += Math.sin(time * 1.5 + i) * 0.03;
            pos[i * 3 + 2] += Math.cos(time * 1.5 + i) * 0.03;
          }

          const maxHeight = isErupting ? 46 : (isSiaga ? 36 : (isWaspada ? 28 : 22));
          if (pos[i * 3 + 1] > maxHeight) {
            pos[i * 3 + 1] = 14.8;
            pos[i * 3 + 0] = (Math.random() - 0.5) * (isErupting ? 2.5 : 1.4);
            pos[i * 3 + 2] = (Math.random() - 0.5) * (isErupting ? 2.5 : 1.4);
          }
        }
        smokePointsRef.current.geometry.attributes.position.needsUpdate = true;

        const smokeMat = smokePointsRef.current.material as THREE.PointsMaterial;
        if (isNormal) {
          smokeMat.opacity = 0.16;
          smokeMat.size = 3.2;
          smokeMat.color.setHex(0xf8fafc);
        } else if (isWaspada) {
          smokeMat.opacity = 0.58;
          smokeMat.size = 7.5;
          smokeMat.color.setHex(0x94a3b8);
        } else if (isSiaga) {
          smokeMat.opacity = 0.86;
          smokeMat.size = 13.0;
          smokeMat.color.setHex(0x475569);
        } else if (isErupting) {
          smokeMat.opacity = 0.98;
          smokeMat.size = 19.0;
          smokeMat.color.setHex(0x18181b);
        }
      }

      if (embersPointsRef.current) {
        const embersMat = embersPointsRef.current.material as THREE.PointsMaterial;
        if (isErupting || isSiaga) {
          embersMat.opacity = isErupting ? 0.95 : 0.35;
          const pos = embersPointsRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < pos.length / 3; i++) {
            pos[i * 3 + 1] += isErupting ? 0.55 : 0.25;
            pos[i * 3 + 0] += (Math.random() - 0.5) * (isErupting ? 0.6 : 0.3);
            pos[i * 3 + 2] += (Math.random() - 0.5) * (isErupting ? 0.6 : 0.3);
            const maxEmbersY = isErupting ? 36 : 22;
            if (pos[i * 3 + 1] > maxEmbersY) {
              pos[i * 3 + 1] = 14.8;
              pos[i * 3 + 0] = (Math.random() - 0.5) * 1.6;
              pos[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
            }
          }
          embersPointsRef.current.geometry.attributes.position.needsUpdate = true;
        } else {
          embersMat.opacity = 0.0;
        }
      }

      if (ashPointsRef.current && ashDataRef.current) {
        const ashData = ashDataRef.current;
        const posAttr = ashPointsRef.current.geometry.attributes.position;
        const positions = posAttr.array as Float32Array;
        const count = positions.length / 3;

        const ashSpreadMult = currentParticleSettings.ashSpread;
        const ashMat = ashPointsRef.current.material as THREE.PointsMaterial;
        const targetAshOpacity = isErupting ? 0.85 * ashSpreadMult : (isSiaga ? 0.45 * ashSpreadMult : 0.0);
        ashMat.opacity = THREE.MathUtils.lerp(ashMat.opacity, Math.min(targetAshOpacity, 0.9), delta * 3);

        if (ashMat.opacity > 0.02) {
          const fallSpeed = (isErupting ? 2.6 : 1.1) * ashSpreadMult;
          const driftSpeed = (isErupting ? 2.0 : 0.8) * ashSpreadMult;

          for (let i = 0; i < count; i++) {
            positions[i * 3 + 1] -= ashData.velocities[i] * fallSpeed * delta;
            positions[i * 3 + 0] += Math.sin(time * 0.8 + ashData.turbulences[i]) * 0.5 * delta + (driftSpeed * 0.6 * delta);
            positions[i * 3 + 2] += Math.cos(time * 0.7 + ashData.turbulences[i]) * 0.4 * delta + (driftSpeed * 0.3 * delta);

            if (positions[i * 3 + 1] < 0.1 || positions[i * 3 + 0] > 40 || positions[i * 3 + 2] > 40) {
              positions[i * 3 + 1] = 20 + Math.random() * 20;
              positions[i * 3 + 0] = (Math.random() - 0.5) * (20 + ashSpreadMult * 20);
              positions[i * 3 + 2] = (Math.random() - 0.5) * (20 + ashSpreadMult * 20);
            }
          }
          posAttr.needsUpdate = true;
        }
      }

      // ==========================================
      // G. DYNAMIC PBR ILLUMINATION & FLICKER
      // ==========================================
      if (lavaLakeRef.current && craterLightRef.current && lavaFlowLightRef.current) {
        const lakeMat = lavaLakeRef.current.material as THREE.MeshStandardMaterial;
        const lavaInt = currentParticleSettings.lavaIntensity;

        if (isNormal) {
          lakeMat.emissiveIntensity = 0.35 * lavaInt;
          craterLightRef.current.intensity = 0.8 * lavaInt;
          craterLightRef.current.color.setHex(0xff7700);
          lavaFlowLightRef.current.intensity = 0.0;
          lavaStreamsRef.current.forEach(m => { m.visible = false; });
        } else if (isWaspada) {
          lakeMat.emissiveIntensity = 1.8 * lavaInt;
          craterLightRef.current.intensity = 3.6 * lavaInt;
          craterLightRef.current.color.setHex(0xff7700);
          lavaFlowLightRef.current.intensity = 0.8 * lavaInt;
          lavaStreamsRef.current.forEach(m => { m.visible = false; });
        } else if (isSiaga) {
          lakeMat.emissiveIntensity = (3.8 + Math.sin(time * 5) * 0.8) * lavaInt;
          craterLightRef.current.intensity = (8.5 + Math.sin(time * 6) * 2.0) * lavaInt;
          craterLightRef.current.color.setHex(0xff4400);
          lavaFlowLightRef.current.intensity = 2.8 * lavaInt;
          lavaStreamsRef.current.forEach((m, idx) => {
            m.visible = idx === 0;
            (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.4;
          });
        } else if (isErupting) {
          lakeMat.emissiveIntensity = (5.5 + Math.sin(time * 9) * 1.5) * lavaInt;
          craterLightRef.current.intensity = (15.0 + Math.sin(time * 11) * 3.5) * lavaInt;
          craterLightRef.current.color.setHex(0xff2200);
          lavaFlowLightRef.current.intensity = 6.5 + Math.sin(time * 8) * 1.8;
          lavaStreamsRef.current.forEach(m => {
            m.visible = true;
            (m.material as THREE.MeshStandardMaterial).emissiveIntensity = 3.6;
          });
        }
      }

      if (magmaChamberRef.current) {
        const magmaMat = magmaChamberRef.current.material as THREE.MeshStandardMaterial;
        const pulseSpeed = isErupting ? 6.5 : (isSiaga ? 4.5 : (isWaspada ? 2.8 : 1.2));
        magmaMat.emissiveIntensity = (1.8 + Math.sin(time * pulseSpeed) * 0.6) * currentParticleSettings.lavaIntensity;
      }

      // Animate Flank Eruption Lava Stream & Fissure Vent (Erupsi Samping Lereng)
      if (flankLavaRef.current) {
        const flankMat = flankLavaRef.current.material as THREE.MeshStandardMaterial;
        if (isErupting) {
          flankLavaRef.current.visible = true;
          flankMat.emissiveIntensity = (3.4 + Math.sin(time * 8) * 1.2) * currentParticleSettings.lavaIntensity;
          flankMat.color.setHex(0xff3b00);
          flankMat.emissive.setHex(0xff5500);
        } else if (isSiaga) {
          flankLavaRef.current.visible = true;
          flankMat.emissiveIntensity = (1.5 + Math.sin(time * 4) * 0.4) * currentParticleSettings.lavaIntensity;
          flankMat.color.setHex(0xb45309);
          flankMat.emissive.setHex(0xd97706);
        } else {
          flankLavaRef.current.visible = false;
        }
      }
      if (flankVentRef.current) {
        const flankVentMat = flankVentRef.current.material as THREE.MeshStandardMaterial;
        flankVentMat.emissiveIntensity = isErupting ? (3.6 + Math.sin(time * 6) * 1.0) : (isSiaga ? 2.2 : (isWaspada ? 1.0 : 0.3));
      }

      if (frameCountRef.current++ % 2 === 0) {
        updateMarkerPositions();
      }
      renderer.render(scene, camera);
    };

    renderLoop();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const readyTimer = setTimeout(() => {
      setIsPreparing(false);
    }, 500);

    return () => {
      clearTimeout(readyTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleCanvasClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync Cutaway View & Mountain Morphology (Utuh vs Kaldera Pasca Erupsi)
  useEffect(() => {
    if (fullMountainGroupRef.current) {
      fullMountainGroupRef.current.visible = !isCutaway && !isCalderaFormed;
    }
    if (calderaMountainGroupRef.current) {
      calderaMountainGroupRef.current.visible = !isCutaway && isCalderaFormed;
    }
    if (cutawayGroupRef.current) {
      cutawayGroupRef.current.visible = isCutaway;
    }
    if (customGLBGroupRef.current) {
      customGLBGroupRef.current.visible = !isCutaway;
    }
  }, [isCutaway, isCalderaFormed]);

  // Sync Camera Presets & Dynamic Signs Target Views
  useEffect(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (cameraPreset === 'default' || cameraPreset === 'overview') {
      camera.position.set(-14, 13, 34);
      controls.target.set(0, 6.0, 0);
    } else if (cameraPreset === 'crater') {
      camera.position.set(0, 20, 14);
      controls.target.set(0, 14.8, 0);
    } else if (cameraPreset === 'cutaway') {
      camera.position.set(18, 10, 22);
      controls.target.set(0, 5.5, 0);
    } else if (cameraPreset === 'wildlife') {
      camera.position.set(-19, 3.8, 6.0);
      controls.target.set(-14.5, 1.2, 0.5);
    } else if (cameraPreset === 'signs_overview') {
      camera.position.set(-12, 15, 26);
      controls.target.set(0, 7.5, 0);
    } else if (cameraPreset === 'seismograph') {
      camera.position.set(-22, 3.5, 15);
      controls.target.set(-17.0, 1.2, 11.0);
    } else if (cameraPreset === 'flank') {
      camera.position.set(-15, 8, 12);
      controls.target.set(-4.8, 5.2, 0);
    }
    controls.update();
  }, [cameraPreset]);

  // Sync Active 3D Highlight Beacon
  useEffect(() => {
    if (highlightBeaconRef.current) {
      if (activeHighlightPosition) {
        highlightBeaconRef.current.position.set(
          activeHighlightPosition[0],
          activeHighlightPosition[1],
          activeHighlightPosition[2]
        );
        highlightBeaconRef.current.visible = true;
      } else {
        highlightBeaconRef.current.visible = false;
      }
    }
  }, [activeHighlightPosition]);

  // Sync 2D billboard markers on 3D coordinates
  const updateMarkerPositions = () => {
    if (!cameraRef.current || !containerRef.current) return;
    const camera = cameraRef.current;
    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const coords: { [key: string]: { x: number; y: number; visible: boolean } } = {};
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    const toMarker = new THREE.Vector3();

    VOLCANO_MARKERS.forEach(m => {
      // Internal underground markers only visible during Cutaway X-Ray
      if (!isCutaway && (m.id === 'chamber' || m.id === 'vent')) {
        coords[m.id] = { x: 0, y: 0, visible: false };
        return;
      }

      const pos = new THREE.Vector3(...m.position);
      toMarker.copy(pos).sub(camera.position);

      // Pastikan objek berada di depan kamera (bukan di belakang bidang pandang)
      if (toMarker.dot(camDir) <= 0) {
        coords[m.id] = { x: 0, y: 0, visible: false };
        return;
      }

      const projected = pos.project(camera);

      if (projected.z < 1.0 && projected.z > -1.0) {
        coords[m.id] = {
          x: (projected.x * 0.5 + 0.5) * w,
          y: (-(projected.y * 0.5) + 0.5) * h,
          visible: true
        };
      } else {
        coords[m.id] = { x: 0, y: 0, visible: false };
      }
    });

    setMarkerScreenCoords(coords);
  };

  /**
   * 1. FOREGROUND TERRAIN & FLOWING RIVER
   */
  const buildForegroundAndRiver = (scene: THREE.Scene) => {
    const foregroundGroup = new THREE.Group();
    foregroundGroup.name = 'Foreground_Main';

    const bankGeo = new THREE.PlaneGeometry(38, 22, 24, 16);
    const bankPos = bankGeo.attributes.position;
    for (let i = 0; i < bankPos.count; i++) {
      const x = bankPos.getX(i);
      const y = bankPos.getY(i);
      const roll = Math.sin(x * 0.3) * 0.2 + Math.cos(y * 0.4) * 0.2;
      bankPos.setZ(i, roll);
    }
    bankGeo.computeVertexNormals();

    const bankMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.95,
      metalness: 0.05
    });
    const riverBank = new THREE.Mesh(bankGeo, bankMat);
    riverBank.name = 'RiverBank_Soil';
    riverBank.rotation.x = -Math.PI / 2;
    riverBank.position.set(6, 0.26, 12);
    riverBank.receiveShadow = true;
    foregroundGroup.add(riverBank);

    const riverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-10, 0.4, -14),
      new THREE.Vector3(-4, 0.4, -6),
      new THREE.Vector3(2, 0.4, 2),
      new THREE.Vector3(8, 0.4, 10),
      new THREE.Vector3(16, 0.4, 18),
      new THREE.Vector3(25, 0.4, 26)
    ]);

    const riverGeo = new THREE.PlaneGeometry(42, 6.5, 48, 12);
    riverGeo.rotateX(-Math.PI / 2);
    const rPos = riverGeo.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      const u = (rPos.getX(i) + 21) / 42;
      const pt = riverCurve.getPointAt(Math.min(1, Math.max(0, u)));
      const zOffset = rPos.getZ(i);
      rPos.setX(i, pt.x + zOffset * 0.35);
      rPos.setZ(i, pt.z + zOffset * 0.85);
      rPos.setY(i, pt.y);
    }
    riverGeo.computeVertexNormals();

    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.08,
      metalness: 0.88,
      transparent: true,
      opacity: 0.88
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.name = 'River_Main';
    river.position.y = 0.02;
    foregroundGroup.add(river);
    riverWaterRef.current = river;

    const foamMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      transparent: true,
      opacity: 0.65
    });
    const foamEdgeGeo = new THREE.RingGeometry(2.8, 3.2, 32);
    const foamEdge = new THREE.Mesh(foamEdgeGeo, foamMat);
    foamEdge.name = 'River_Foam';
    foamEdge.rotation.x = -Math.PI / 2;
    foamEdge.position.set(8, 0.44, 10);
    foregroundGroup.add(foamEdge);

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x292524,
      roughness: 0.85,
      metalness: 0.1
    });
    const riverRockLocations = [
      new THREE.Vector3(-2, 0.5, -4),
      new THREE.Vector3(3, 0.52, 3),
      new THREE.Vector3(7, 0.55, 9),
      new THREE.Vector3(12, 0.52, 14),
      new THREE.Vector3(15, 0.48, 17)
    ];
    riverRockLocations.forEach((loc, idx) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75 + Math.random() * 0.45, 1), rockMat);
      rock.name = `River_Rock_${idx + 1}`;
      rock.position.copy(loc);
      rock.castShadow = true;
      rock.receiveShadow = true;
      foregroundGroup.add(rock);
    });

    const fgRockLocations = [
      new THREE.Vector3(9, 0.7, 5),
      new THREE.Vector3(14, 0.85, 8),
      new THREE.Vector3(11, 0.65, 16),
      new THREE.Vector3(5, 0.75, 17),
      new THREE.Vector3(-5, 0.8, 15)
    ];
    fgRockLocations.forEach((loc, idx) => {
      const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(1.1 + Math.random() * 0.7, 1), rockMat);
      boulder.name = `Foreground_Boulder_${idx + 1}`;
      boulder.position.copy(loc);
      boulder.castShadow = true;
      boulder.receiveShadow = true;
      foregroundGroup.add(boulder);
    });

    scene.add(foregroundGroup);
  };

  /**
   * 2. PROCEDURAL STRATOVOLCANO
   */
  const buildProceduralStratovolcano = (scene: THREE.Scene) => {
    const volcanoGroup = new THREE.Group();
    volcanoGroup.name = 'Volcano_Group';
    scene.add(volcanoGroup);

    const noiseTex = createNoiseTexture();
    const lavaTex = createLavaTexture();

    const radialSegs = 64;
    const heightSegs = 32;
    const fullGeo = new THREE.CylinderGeometry(2.4, 18.0, 15.5, radialSegs, heightSegs, false);

    const posAttr = fullGeo.attributes.position;
    const colors = new Float32Array(posAttr.count * 3);

    const colorBasaltSummit = new THREE.Color(0x1c1917);
    const colorOxidizedRock = new THREE.Color(0x78350f);
    const colorMidSlopeRock = new THREE.Color(0x57534e);
    const colorAlpineScrub = new THREE.Color(0x4d7c0f);
    const colorLushGreen = new THREE.Color(0x15803d);

    for (let i = 0; i < posAttr.count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      const normY = (y + 7.75) / 15.5;
      const angle = Math.atan2(z, x);

      if (normY < 0.95 && normY > 0.05) {
        const ridge1 = Math.sin(angle * 7) * 0.95;
        const ridge2 = Math.cos(angle * 13) * 0.45;
        const fluteErosion = Math.pow(Math.abs(Math.sin(angle * 3.5)), 2.0) * -0.7;
        const microNoise = (Math.sin(normY * 18 + angle * 9)) * 0.3;

        const totalDisplacement = (ridge1 + ridge2 + fluteErosion + microNoise) * Math.sin(normY * Math.PI);
        const rCurrent = Math.sqrt(x * x + z * z);
        const rNew = Math.max(1.8, rCurrent + totalDisplacement);

        x = Math.cos(angle) * rNew;
        z = Math.sin(angle) * rNew;
        posAttr.setX(i, x);
        posAttr.setZ(i, z);
      }

      if (normY >= 0.95) {
        const rimVariation = Math.sin(angle * 5) * 0.4;
        y += rimVariation;
        posAttr.setY(i, y);
      }

      const vColor = new THREE.Color();
      if (normY < 0.32) {
        vColor.copy(colorLushGreen);
      } else if (normY < 0.55) {
        const factor = (normY - 0.32) / 0.23;
        vColor.copy(colorLushGreen).lerp(colorAlpineScrub, factor);
      } else if (normY < 0.78) {
        const factor = (normY - 0.55) / 0.23;
        vColor.copy(colorAlpineScrub).lerp(colorOxidizedRock, factor);
      } else if (normY < 0.92) {
        const factor = (normY - 0.78) / 0.14;
        vColor.copy(colorOxidizedRock).lerp(colorMidSlopeRock, factor);
      } else {
        vColor.copy(colorBasaltSummit);
      }

      colors[i * 3 + 0] = vColor.r;
      colors[i * 3 + 1] = vColor.g;
      colors[i * 3 + 2] = vColor.b;
    }

    fullGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    fullGeo.computeVertexNormals();

    const mountainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.88,
      metalness: 0.08,
      bumpMap: noiseTex,
      bumpScale: 0.22,
      flatShading: false
    });

    const fullMountain = new THREE.Mesh(fullGeo, mountainMat);
    fullMountain.name = 'Volcano_Main';
    fullMountain.position.y = 7.75;
    fullMountain.castShadow = true;
    fullMountain.receiveShadow = true;

    const fullGroup = new THREE.Group();
    fullGroup.name = 'Full_Mountain_Group';
    fullGroup.add(fullMountain);
    volcanoGroup.add(fullGroup);
    fullMountainGroupRef.current = fullGroup;

    // Crater Rim and Lake
    const craterLakeGeo = new THREE.CylinderGeometry(2.1, 1.2, 0.8, 32);
    const craterLakeMat = new THREE.MeshStandardMaterial({
      color: 0xff3b00,
      emissive: 0xff4500,
      emissiveIntensity: 2.8,
      roughness: 0.25,
      metalness: 0.1,
      map: lavaTex
    });
    const craterLake = new THREE.Mesh(craterLakeGeo, craterLakeMat);
    craterLake.name = 'Volcano_Crater';
    craterLake.position.set(0, 14.7, 0);
    volcanoGroup.add(craterLake);
    lavaLakeRef.current = craterLake;

    // Glowing Lava Surface (Lava_Main)
    const lavaMainGeo = new THREE.CircleGeometry(1.9, 32);
    const lavaMain = new THREE.Mesh(lavaMainGeo, craterLakeMat);
    lavaMain.name = 'Lava_Main';
    lavaMain.rotation.x = -Math.PI / 2;
    lavaMain.position.set(0, 15.08, 0);
    volcanoGroup.add(lavaMain);

    // 3 Natural Lava Streams
    const lavaStreamMeshes: THREE.Mesh[] = [];
    lavaCurves.forEach((curve, idx) => {
      const streamGeo = new THREE.TubeGeometry(curve, 48, 0.65 - idx * 0.1, 10, false);
      const streamMat = new THREE.MeshStandardMaterial({
        color: 0xff4500,
        emissive: 0xff5500,
        emissiveIntensity: 2.4,
        roughness: 0.35,
        metalness: 0.1,
        map: lavaTex
      });
      const streamMesh = new THREE.Mesh(streamGeo, streamMat);
      streamMesh.name = `Lava_Stream_0${idx + 1}`;
      streamMesh.castShadow = true;
      volcanoGroup.add(streamMesh);
      lavaStreamMeshes.push(streamMesh);
    });
    lavaStreamsRef.current = lavaStreamMeshes;
    lavaMeshRef.current = lavaStreamMeshes[0];

    // 4. Parasitic Flank Eruption Fissure & Lava Stream (Erupsi Samping Lereng)
    const flankVentGroup = new THREE.Group();
    flankVentGroup.name = 'Flank_Vent_Group';
    const flankConeGeo = new THREE.ConeGeometry(1.6, 2.2, 16);
    const flankCone = new THREE.Mesh(flankConeGeo, mountainMat);
    flankCone.position.set(5.8, 5.0, 5.2);
    flankCone.rotation.z = -0.32;
    flankCone.rotation.y = 0.4;
    flankCone.castShadow = true;
    flankCone.receiveShadow = true;
    flankVentGroup.add(flankCone);

    const flankCraterGeo = new THREE.CircleGeometry(0.75, 16);
    const flankCraterMat = new THREE.MeshStandardMaterial({
      color: 0xff3700,
      emissive: 0xff4500,
      emissiveIntensity: 1.5,
      map: lavaTex
    });
    const flankCrater = new THREE.Mesh(flankCraterGeo, flankCraterMat);
    flankCrater.position.set(5.95, 5.95, 5.35);
    flankCrater.rotation.x = -Math.PI / 2;
    flankVentGroup.add(flankCrater);
    volcanoGroup.add(flankVentGroup);
    flankVentRef.current = flankCrater;

    // Dedicated Flank Lava Stream issuing from flank fissure down the slope
    const flankCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(5.95, 5.85, 5.35),
      new THREE.Vector3(7.4, 4.2, 6.6),
      new THREE.Vector3(9.4, 2.4, 8.6),
      new THREE.Vector3(12.4, 0.42, 11.2)
    ]);
    const flankLavaGeo = new THREE.TubeGeometry(flankCurve, 32, 0.58, 10, false);
    const flankLavaMat = new THREE.MeshStandardMaterial({
      color: 0xff3b00,
      emissive: 0xff5500,
      emissiveIntensity: 2.2,
      roughness: 0.32,
      metalness: 0.1,
      map: lavaTex
    });
    const flankLavaMesh = new THREE.Mesh(flankLavaGeo, flankLavaMat);
    flankLavaMesh.name = 'Lava_Flank_Stream';
    flankLavaMesh.visible = false;
    volcanoGroup.add(flankLavaMesh);
    flankLavaRef.current = flankLavaMesh;

    // 5. Post-Eruption Collapsed Caldera Mountain (Bentuk Gunung Runtuh Pasca Letusan)
    const calderaGroup = new THREE.Group();
    calderaGroup.name = 'Caldera_Mountain_Group';
    calderaGroup.visible = false;

    const calderaGeo = new THREE.CylinderGeometry(5.4, 18.0, 11.0, radialSegs, heightSegs, false);
    const calderaPos = calderaGeo.attributes.position;
    const calderaColors = new Float32Array(calderaPos.count * 3);

    const colorScorchedBasalt = new THREE.Color(0x18181b);
    const colorAshGrey = new THREE.Color(0x3f3f46);
    const colorSulfurYellow = new THREE.Color(0x854d0e);

    for (let i = 0; i < calderaPos.count; i++) {
      let x = calderaPos.getX(i);
      let y = calderaPos.getY(i);
      let z = calderaPos.getZ(i);

      const normY = (y + 5.5) / 11.0;
      const angle = Math.atan2(z, x);

      if (normY < 0.92 && normY > 0.05) {
        const ridge1 = Math.sin(angle * 7) * 0.95;
        const ridge2 = Math.cos(angle * 13) * 0.45;
        const fluteErosion = Math.pow(Math.abs(Math.sin(angle * 3.5)), 2.0) * -0.7;
        const totalDisp = (ridge1 + ridge2 + fluteErosion) * Math.sin(normY * Math.PI);
        const rCurrent = Math.sqrt(x * x + z * z);
        const rNew = Math.max(2.6, rCurrent + totalDisp);
        x = Math.cos(angle) * rNew;
        z = Math.sin(angle) * rNew;
        calderaPos.setX(i, x);
        calderaPos.setZ(i, z);
      }

      if (normY >= 0.92) {
        // Jagged collapsed caldera rim
        const rimDrop = Math.sin(angle * 6) * 0.85 - 0.4;
        y += rimDrop;
        calderaPos.setY(i, y);
      }

      const vColor = new THREE.Color();
      if (normY < 0.3) {
        vColor.copy(colorAlpineScrub);
      } else if (normY < 0.6) {
        vColor.copy(colorAshGrey);
      } else if (normY < 0.88) {
        vColor.copy(colorScorchedBasalt).lerp(colorSulfurYellow, 0.2);
      } else {
        vColor.copy(colorScorchedBasalt);
      }

      calderaColors[i * 3 + 0] = vColor.r;
      calderaColors[i * 3 + 1] = vColor.g;
      calderaColors[i * 3 + 2] = vColor.b;
    }

    calderaGeo.setAttribute('color', new THREE.BufferAttribute(calderaColors, 3));
    calderaGeo.computeVertexNormals();

    const calderaMesh = new THREE.Mesh(calderaGeo, mountainMat);
    calderaMesh.name = 'Volcano_Caldera_Body';
    calderaMesh.position.y = 5.5;
    calderaMesh.castShadow = true;
    calderaMesh.receiveShadow = true;
    calderaGroup.add(calderaMesh);

    // Wide sunken caldera floor with cracked cooled basalt crust
    const calderaFloorGeo = new THREE.CylinderGeometry(5.0, 3.8, 0.7, 32);
    const calderaFloorMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.95,
      bumpMap: noiseTex,
      bumpScale: 0.28
    });
    const calderaFloor = new THREE.Mesh(calderaFloorGeo, calderaFloorMat);
    calderaFloor.name = 'Caldera_Floor_Basin';
    calderaFloor.position.set(0, 10.7, 0);
    calderaGroup.add(calderaFloor);

    volcanoGroup.add(calderaGroup);
    calderaMountainGroupRef.current = calderaGroup;

    // 6. Complete Sealed Cutaway Group (Penampang X-Ray Melintang Geologis)
    const cutawayGroup = new THREE.Group();
    cutawayGroup.name = 'Cutaway_Section';
    cutawayGroup.visible = false;

    // 270-degree cylinder from 90 deg to 360 deg (leaving open wedge 0 to 90 deg facing camera)
    const cutawayGeo = new THREE.CylinderGeometry(2.4, 18.0, 15.5, 48, heightSegs, false, Math.PI * 0.5, Math.PI * 1.5);
    const cutPos = cutawayGeo.attributes.position;
    const cutColors = new Float32Array(cutPos.count * 3);

    for (let i = 0; i < cutPos.count; i++) {
      let x = cutPos.getX(i);
      let y = cutPos.getY(i);
      let z = cutPos.getZ(i);

      const normY = (y + 7.75) / 15.5;
      const angle = Math.atan2(z, x);

      if (normY < 0.95 && normY > 0.05) {
        const ridge1 = Math.sin(angle * 7) * 0.95;
        const ridge2 = Math.cos(angle * 13) * 0.45;
        const fluteErosion = Math.pow(Math.abs(Math.sin(angle * 3.5)), 2.0) * -0.7;
        const microNoise = (Math.sin(normY * 18 + angle * 9)) * 0.3;
        const totalDisplacement = (ridge1 + ridge2 + fluteErosion + microNoise) * Math.sin(normY * Math.PI);
        const rCurrent = Math.sqrt(x * x + z * z);
        const rNew = Math.max(1.8, rCurrent + totalDisplacement);
        x = Math.cos(angle) * rNew;
        z = Math.sin(angle) * rNew;
        cutPos.setX(i, x);
        cutPos.setZ(i, z);
      }

      if (normY >= 0.95) {
        const rimVariation = Math.sin(angle * 5) * 0.4;
        y += rimVariation;
        cutPos.setY(i, y);
      }

      const vColor = new THREE.Color();
      if (normY < 0.35) vColor.copy(colorLushGreen);
      else if (normY < 0.65) vColor.copy(colorAlpineScrub).lerp(colorOxidizedRock, (normY - 0.35) / 0.3);
      else vColor.copy(colorOxidizedRock).lerp(colorBasaltSummit, (normY - 0.65) / 0.35);

      cutColors[i * 3 + 0] = vColor.r;
      cutColors[i * 3 + 1] = vColor.g;
      cutColors[i * 3 + 2] = vColor.b;
    }

    cutawayGeo.setAttribute('color', new THREE.BufferAttribute(cutColors, 3));
    cutawayGeo.computeVertexNormals();

    const cutawayMesh = new THREE.Mesh(cutawayGeo, mountainMat);
    cutawayMesh.name = 'Volcano_Cutaway_Mesh';
    cutawayMesh.position.y = 7.75;
    cutawayMesh.castShadow = true;
    cutawayMesh.receiveShadow = true;
    cutawayGroup.add(cutawayMesh);

    // Geological Cross-Section Strata Material (Double-Sided)
    const strataTexture = createStrataTexture();
    const strataWallMat = new THREE.MeshStandardMaterial({
      map: strataTexture,
      bumpMap: noiseTex,
      bumpScale: 0.16,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide
    });

    // Generate Seamless Vertical Cut Wall X (At plane z = 0, along +X axis)
    const wallSegments = 24;
    const wallXPositions: number[] = [];
    const wallXUvs: number[] = [];
    const wallXIndices: number[] = [];

    for (let i = 0; i <= wallSegments; i++) {
      const t = i / wallSegments;
      const yLocal = -7.75 + t * 15.5;
      const normY = t;
      const rBase = 18.0 - t * (18.0 - 2.4);
      const disp = (0.45 + Math.sin(normY * 18) * 0.3) * Math.sin(normY * Math.PI);
      const rOuter = Math.max(2.4, rBase + disp);

      // Inner vertex at conduit center axis
      wallXPositions.push(0, yLocal, 0);
      wallXUvs.push(0, 1 - t);

      // Outer vertex at mountain flank edge
      wallXPositions.push(rOuter, yLocal, 0);
      wallXUvs.push(1, 1 - t);

      if (i < wallSegments) {
        const base = i * 2;
        wallXIndices.push(base, base + 1, base + 2);
        wallXIndices.push(base + 1, base + 3, base + 2);
      }
    }

    const wallXGeo = new THREE.BufferGeometry();
    wallXGeo.setAttribute('position', new THREE.Float32BufferAttribute(wallXPositions, 3));
    wallXGeo.setAttribute('uv', new THREE.Float32BufferAttribute(wallXUvs, 2));
    wallXGeo.setIndex(wallXIndices);
    wallXGeo.computeVertexNormals();

    const wallXMesh = new THREE.Mesh(wallXGeo, strataWallMat);
    wallXMesh.name = 'Strata_Wall_X_Axis';
    wallXMesh.position.y = 7.75;
    wallXMesh.castShadow = true;
    wallXMesh.receiveShadow = true;
    cutawayGroup.add(wallXMesh);

    // Generate Seamless Vertical Cut Wall Z (At plane x = 0, along +Z axis)
    const wallZPositions: number[] = [];
    const wallZUvs: number[] = [];
    const wallZIndices: number[] = [];

    for (let i = 0; i <= wallSegments; i++) {
      const t = i / wallSegments;
      const yLocal = -7.75 + t * 15.5;
      const normY = t;
      const rBase = 18.0 - t * (18.0 - 2.4);
      const disp = (0.45 + Math.cos(normY * 18) * 0.3) * Math.sin(normY * Math.PI);
      const rOuter = Math.max(2.4, rBase + disp);

      // Inner vertex at conduit center axis
      wallZPositions.push(0, yLocal, 0);
      wallZUvs.push(0, 1 - t);

      // Outer vertex at mountain flank edge
      wallZPositions.push(0, yLocal, rOuter);
      wallZUvs.push(1, 1 - t);

      if (i < wallSegments) {
        const base = i * 2;
        wallZIndices.push(base, base + 2, base + 1);
        wallZIndices.push(base + 1, base + 2, base + 3);
      }
    }

    const wallZGeo = new THREE.BufferGeometry();
    wallZGeo.setAttribute('position', new THREE.Float32BufferAttribute(wallZPositions, 3));
    wallZGeo.setAttribute('uv', new THREE.Float32BufferAttribute(wallZUvs, 2));
    wallZGeo.setIndex(wallZIndices);
    wallZGeo.computeVertexNormals();

    const wallZMesh = new THREE.Mesh(wallZGeo, strataWallMat);
    wallZMesh.name = 'Strata_Wall_Z_Axis';
    wallZMesh.position.y = 7.75;
    wallZMesh.castShadow = true;
    wallZMesh.receiveShadow = true;
    cutawayGroup.add(wallZMesh);

    // Main Magma Conduit Pipe (Saluran Kepundan)
    const conduitGeo = new THREE.CylinderGeometry(1.2, 1.8, 17.5, 24);
    const magmaPBRMat = new THREE.MeshStandardMaterial({
      color: 0xff3b00,
      emissive: 0xff4500,
      emissiveIntensity: 2.8,
      roughness: 0.15,
      metalness: 0.05
    });
    const mainConduit = new THREE.Mesh(conduitGeo, magmaPBRMat);
    mainConduit.name = 'Conduit_Main';
    mainConduit.position.set(0, 7.2, 0);
    cutawayGroup.add(mainConduit);

    // Deep Magma Chamber (Dapur Magma Bawah Tanah)
    const chamberGeo = new THREE.SphereGeometry(4.4, 32, 32);
    const chamberMesh = new THREE.Mesh(chamberGeo, magmaPBRMat);
    chamberMesh.name = 'Magma_Chamber';
    chamberMesh.position.set(0, -1.2, 0);
    cutawayGroup.add(chamberMesh);
    magmaChamberRef.current = chamberMesh;

    // Parasitic Vent Branch (Pipa Cabang Menuju Lereng)
    const branchGeo = new THREE.CylinderGeometry(0.45, 0.65, 7.5, 16);
    const branchMesh = new THREE.Mesh(branchGeo, magmaPBRMat);
    branchMesh.name = 'Parasitic_Vent';
    branchMesh.position.set(3.2, 5.2, 0.4);
    branchMesh.rotation.z = -Math.PI / 3.4;
    cutawayGroup.add(branchMesh);

    volcanoGroup.add(cutawayGroup);
    cutawayGroupRef.current = cutawayGroup;
  };

  /**
   * 3. MULTI-LAYER PARTICLE SYSTEMS
   */
  const buildParticleSystems = (scene: THREE.Scene) => {
    const radialTexture = createRadialTexture();

    const lavaCount = 500;
    const lavaGeo = new THREE.BufferGeometry();
    const lavaPos = new Float32Array(lavaCount * 3);
    const lavaColors = new Float32Array(lavaCount * 3);

    const tArray = new Float32Array(lavaCount);
    const speedArray = new Float32Array(lavaCount);
    const curveIdxArray = new Int8Array(lavaCount);
    const driftArray = new Float32Array(lavaCount);

    for (let i = 0; i < lavaCount; i++) {
      tArray[i] = Math.random();
      speedArray[i] = 0.08 + Math.random() * 0.12;
      curveIdxArray[i] = Math.floor(Math.random() * 3);
      driftArray[i] = Math.random();

      const curve = lavaCurves[curveIdxArray[i]];
      const pt = curve.getPointAt(tArray[i]);
      lavaPos[i * 3 + 0] = pt.x;
      lavaPos[i * 3 + 1] = pt.y;
      lavaPos[i * 3 + 2] = pt.z;

      lavaColors[i * 3 + 0] = 1.0;
      lavaColors[i * 3 + 1] = 0.6;
      lavaColors[i * 3 + 2] = 0.1;
    }

    lavaGeo.setAttribute('position', new THREE.BufferAttribute(lavaPos, 3));
    lavaGeo.setAttribute('color', new THREE.BufferAttribute(lavaColors, 3));

    const lavaParticleMat = new THREE.PointsMaterial({
      size: 0.8,
      map: radialTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const lavaParticles = new THREE.Points(lavaGeo, lavaParticleMat);
    lavaParticles.name = 'Lava_Particles';
    scene.add(lavaParticles);
    lavaParticlesRef.current = lavaParticles;

    lavaStreamDataRef.current = {
      t: tArray,
      speed: speedArray,
      curveIdx: curveIdxArray,
      drift: driftArray
    };

    const smokeCount = 320;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePos = new Float32Array(smokeCount * 3);

    for (let i = 0; i < smokeCount; i++) {
      smokePos[i * 3 + 0] = (Math.random() - 0.5) * 2.0;
      smokePos[i * 3 + 1] = 14.8 + Math.random() * 14;
      smokePos[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));

    const smokeMat = new THREE.PointsMaterial({
      size: 5.5,
      map: radialTexture,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      color: 0xf8fafc
    });
    const smokePoints = new THREE.Points(smokeGeo, smokeMat);
    smokePoints.name = 'Smoke_Main';
    scene.add(smokePoints);
    smokePointsRef.current = smokePoints;

    const embersCount = 200;
    const embersGeo = new THREE.BufferGeometry();
    const embersPos = new Float32Array(embersCount * 3);
    for (let i = 0; i < embersCount; i++) {
      embersPos[i * 3 + 0] = 0;
      embersPos[i * 3 + 1] = 14.8;
      embersPos[i * 3 + 2] = 0;
    }
    embersGeo.setAttribute('position', new THREE.BufferAttribute(embersPos, 3));

    const embersMat = new THREE.PointsMaterial({
      size: 1.1,
      color: 0xffaa00,
      map: radialTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.0
    });
    const embersPoints = new THREE.Points(embersGeo, embersMat);
    embersPoints.name = 'Embers_Particles';
    scene.add(embersPoints);
    embersPointsRef.current = embersPoints;

    const ashCount = 750;
    const ashGeo = new THREE.BufferGeometry();
    const ashPos = new Float32Array(ashCount * 3);
    const ashVel = new Float32Array(ashCount);
    const ashTurb = new Float32Array(ashCount);
    const ashLife = new Float32Array(ashCount);

    for (let i = 0; i < ashCount; i++) {
      ashPos[i * 3 + 0] = (Math.random() - 0.5) * 60;
      ashPos[i * 3 + 1] = 5 + Math.random() * 32;
      ashPos[i * 3 + 2] = (Math.random() - 0.5) * 60;

      ashVel[i] = 0.7 + Math.random() * 1.5;
      ashTurb[i] = Math.random() * Math.PI * 2;
      ashLife[i] = Math.random();
    }

    ashGeo.setAttribute('position', new THREE.BufferAttribute(ashPos, 3));
    const ashMat = new THREE.PointsMaterial({
      size: 0.55,
      color: 0x475569,
      map: radialTexture,
      transparent: true,
      opacity: 0.0,
      depthWrite: false
    });
    const ashPoints = new THREE.Points(ashGeo, ashMat);
    ashPoints.name = 'Ash_Particles';
    scene.add(ashPoints);
    ashPointsRef.current = ashPoints;

    ashDataRef.current = {
      velocities: ashVel,
      turbulences: ashTurb,
      lifetimes: ashLife
    };

    const bombMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f1f,
      emissive: 0xff3b00,
      emissiveIntensity: 1.5,
      roughness: 0.8
    });
    const bombs: VolcanicBomb[] = [];
    const bombCount = 20;

    for (let i = 0; i < bombCount; i++) {
      const rockMesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.35, 1),
        bombMat
      );
      rockMesh.name = `Volcanic_Bomb_${i + 1}`;
      rockMesh.position.set(0, 14.8, 0);
      rockMesh.visible = false;
      rockMesh.castShadow = true;
      scene.add(rockMesh);

      bombs.push({
        mesh: rockMesh,
        velocity: new THREE.Vector3(),
        active: false,
        initialPos: new THREE.Vector3(0, 14.8, 0)
      });
    }
    volcanicBombsRef.current = bombs;
  };

  /**
   * 4. TROPICAL JUNGLE FOREST
   */
  const buildTropicalForest = (scene: THREE.Scene) => {
    const forestGroup = new THREE.Group();
    forestGroup.name = 'Forest_Main';

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const palmFrondMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75, side: THREE.DoubleSide });
    const jungleLeaf1 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.8, flatShading: true });
    const jungleLeaf2 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8, flatShading: true });
    const montaneLeaf = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.8, flatShading: true });

    const trees: TreeInstance[] = [];
    const treeCount = 65;

    for (let i = 0; i < treeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 16 + Math.random() * 14;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      if (x > -3 && x < 15 && z > 2 && z < 18) continue;
      if (x > -14 && x < -2 && z > -14 && z < 2) continue;

      const group = new THREE.Group();
      group.position.set(x, 0.3, z);
      const treeType = i % 3;

      if (treeType === 0) {
        group.name = `Tree_Palm_${i}`;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 2.8, 6), trunkMat);
        trunk.position.y = 1.4;
        trunk.rotation.z = (Math.random() - 0.5) * 0.15;
        trunk.castShadow = true;
        group.add(trunk);

        for (let f = 0; f < 8; f++) {
          const frondAngle = (f / 8) * Math.PI * 2;
          const frond = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.2, 4), palmFrondMat);
          frond.position.set(Math.cos(frondAngle) * 0.6, 2.7, Math.sin(frondAngle) * 0.6);
          frond.rotation.x = Math.sin(frondAngle) * 0.7 + Math.PI / 2;
          frond.rotation.z = Math.cos(frondAngle) * 0.7;
          frond.scale.set(1.0, 1.0, 0.15);
          frond.castShadow = true;
          group.add(frond);
        }

      } else if (treeType === 1) {
        group.name = `Tree_Broadleaf_${i}`;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 2.2, 6), trunkMat);
        trunk.position.y = 1.1;
        trunk.castShadow = true;
        group.add(trunk);

        const canopyPuffs = [
          { x: 0, y: 2.6, z: 0, s: 1.4 },
          { x: 0.6, y: 2.3, z: 0.4, s: 1.1 },
          { x: -0.6, y: 2.3, z: -0.3, s: 1.1 },
          { x: 0.3, y: 3.2, z: -0.3, s: 1.0 }
        ];
        canopyPuffs.forEach(p => {
          const puff = new THREE.Mesh(
            new THREE.DodecahedronGeometry(p.s, 1),
            Math.random() > 0.5 ? jungleLeaf1 : jungleLeaf2
          );
          puff.position.set(p.x, p.y, p.z);
          puff.castShadow = true;
          group.add(puff);
        });

      } else {
        group.name = `Tree_Fern_${i}`;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, 2.0, 6), trunkMat);
        trunk.position.y = 1.0;
        trunk.castShadow = true;
        group.add(trunk);

        for (let l = 0; l < 3; l++) {
          const tier = new THREE.Mesh(
            new THREE.ConeGeometry(1.5 - l * 0.35, 1.3, 6),
            montaneLeaf
          );
          tier.position.y = 1.8 + l * 0.75;
          tier.castShadow = true;
          group.add(tier);
        }
      }

      const scale = 0.75 + Math.random() * 0.55;
      group.scale.set(scale, scale, scale);
      forestGroup.add(group);
      trees.push({ group, phase: Math.random() * Math.PI * 2, baseZRotation: group.rotation.z });
    }

    const stationGroup = new THREE.Group();
    stationGroup.name = 'Monitoring_Station_PVMBG';
    stationGroup.position.set(-17, 0.3, 11);
    const boxBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 1.6), new THREE.MeshStandardMaterial({ color: 0xf1f5f9 }));
    boxBase.position.y = 0.45;
    boxBase.castShadow = true;
    stationGroup.add(boxBase);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8), new THREE.MeshStandardMaterial({ color: 0x64748b }));
    pole.position.y = 1.4;
    stationGroup.add(pole);
    const solarPanel = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.04, 0.65), new THREE.MeshStandardMaterial({ color: 0x1e40af }));
    solarPanel.position.set(0, 2.3, 0);
    solarPanel.rotation.x = -0.4;
    stationGroup.add(solarPanel);
    forestGroup.add(stationGroup);

    scene.add(forestGroup);
    treesListRef.current = trees;
  };

  /**
   * 5. 3D WILDLIFE FAUNA
   */
  const buildWildlife = (scene: THREE.Scene) => {
    const wildlifeGroup = new THREE.Group();
    wildlifeGroup.name = 'Wildlife_Fauna';

    const deerBodyMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
    const antlerMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.6 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.9 });
    const hoofMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, roughness: 0.9 });

    const deers: DeerInstance[] = [];

    for (let i = 0; i < 4; i++) {
      const group = new THREE.Group();
      group.name = `Animal_Deer_0${i + 1}`;

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.75, 1.45), deerBodyMat);
      body.position.y = 1.15;
      body.castShadow = true;
      group.add(body);

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.45, 0.65);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.48, 0.7), deerBodyMat);
      head.position.set(0, 0.22, 0.22);
      head.castShadow = true;
      headGroup.add(head);

      const antL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55), antlerMat);
      antL.position.set(-0.18, 0.55, 0.1);
      antL.rotation.z = -0.35;
      headGroup.add(antL);

      const antR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55), antlerMat);
      antR.position.set(0.18, 0.55, 0.1);
      antR.rotation.z = 0.35;
      headGroup.add(antR);

      group.add(headGroup);

      const legs: THREE.Mesh[] = [];
      const legPositions = [
        [-0.3, 0.48, 0.48],
        [0.3, 0.48, 0.48],
        [-0.3, 0.48, -0.48],
        [0.3, 0.48, -0.48]
      ];
      legPositions.forEach(p => {
        const legGroup = new THREE.Group();
        legGroup.position.set(p[0], 0.95, p[2]);

        const legUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.95), legMat);
        legUpper.position.y = -0.47;
        legUpper.castShadow = true;
        legGroup.add(legUpper);

        const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.15), hoofMat);
        hoof.position.y = -0.9;
        legGroup.add(hoof);

        group.add(legGroup);
        legs.push(legUpper);
      });

      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.35, 0.12), deerBodyMat);
      tail.position.set(0, 1.25, -0.75);
      tail.rotation.x = 0.4;
      group.add(tail);

      group.scale.set(0.88, 0.88, 0.88);

      // Dedicated lush dry meadow at southwest volcano foothills (Safe from lava, far from river and ocean)
      const deerHomeMeadows = [
        new THREE.Vector3(-14.0, 0.35, -1.8),
        new THREE.Vector3(-15.5, 0.35, -0.2),
        new THREE.Vector3(-13.6, 0.35, 1.2),
        new THREE.Vector3(-15.0, 0.35, 2.5)
      ];
      group.position.copy(deerHomeMeadows[i] || new THREE.Vector3(-14.5, 0.35, 0));

      // Forest sanctuary shelter on high dry ground (Near PVMBG outer forest grove, radius ~21.5, strictly on dry land)
      const fleeTarget = new THREE.Vector3(
        -21.2 + (i % 2) * 1.4,
        0.35,
        4.8 + Math.floor(i / 2) * 1.8
      );

      wildlifeGroup.add(group);
      deers.push({
        group,
        legs,
        head: headGroup,
        tail,
        initialPos: group.position.clone(),
        fleeTarget,
        wanderTarget: group.position.clone(),
        currentVelocity: new THREE.Vector3(0, 0, 0),
        speed: 1.0,
        idleTimer: 2.0 + Math.random() * 3,
        isGrazing: true
      });
    }
    deerListRef.current = deers;

    const birdMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const birds: BirdInstance[] = [];

    for (let i = 0; i < 6; i++) {
      const group = new THREE.Group();
      group.name = `Bird_0${i + 1}`;

      const body = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.85, 5), birdMat);
      body.rotation.x = Math.PI / 2;
      group.add(body);

      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.04, 0.32), birdMat);
      wingL.position.set(-0.38, 0, 0);
      group.add(wingL);

      const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.04, 0.32), birdMat);
      wingR.position.set(0.38, 0, 0);
      group.add(wingR);

      const orbitRadius = 14 + Math.random() * 8;
      const orbitHeight = 18 + Math.random() * 5;
      const orbitSpeed = 0.008 + Math.random() * 0.004;
      const angle = (i / 6) * Math.PI * 2;

      wildlifeGroup.add(group);
      birds.push({
        group,
        leftWing: wingL,
        rightWing: wingR,
        orbitRadius,
        orbitHeight,
        orbitSpeed,
        angle,
        currentVelocity: new THREE.Vector3(0, 0, 0),
        fleeDirection: new THREE.Vector3(Math.cos(angle), 0.55, Math.sin(angle)).normalize()
      });
    }
    birdsListRef.current = birds;

    scene.add(wildlifeGroup);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden" ref={containerRef}>
      
      {/* Loading Overlay (Section 17) */}
      {isPreparing && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs pointer-events-none transition-opacity duration-500">
          <div className="bg-slate-900/95 px-5 py-3.5 rounded-2xl shadow-2xl border border-orange-500/40 flex items-center gap-3 text-white text-xs animate-in zoom-in-95">
            <span className="text-2xl animate-bounce">🌋</span>
            <div className="flex flex-col">
              <span className="font-bold text-white text-sm">Memuat Model 3D...</span>
              <span className="text-[11px] text-slate-400">Menyiapkan Stratovolcano, Shaders &amp; Satwa Liar</span>
            </div>
          </div>
        </div>
      )}

      {/* Model Load Warning Banner if GLB absent with retry button */}
      {modelLoadingError && (
        <div className="absolute top-3 left-3 right-3 sm:left-auto sm:right-3 z-30 flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/50 backdrop-blur-md text-xs text-amber-300 shadow-xl">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px]">Model 3D kustom gagal dimuat. Menggunakan simulator prosedural PBR.</span>
          <button
            onClick={() => sceneRef.current && tryLoadCustomGLB(sceneRef.current)}
            className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[10px] cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Floating OrbitControls User Instruction Hint (Section 6) */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-md text-[11px] text-slate-400">
        <Sparkles className="w-3 h-3 text-orange-400" />
        <span>Drag untuk memutar • Scroll untuk zoom • Geser untuk memindahkan</span>
      </div>

      {/* Floating GLB Export Button */}
      <div className="absolute top-12 left-3 z-20 pointer-events-auto hidden sm:block">
        <button
          onClick={handleExportGLB}
          disabled={isExporting}
          title="Ekspor seluruh lingkungan 3D saat ini ke file GLB / glTF 2.0"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-orange-400 border border-orange-500/30 shadow-xl backdrop-blur-md text-xs font-semibold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <span className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              <span>Mengekspor GLB...</span>
            </>
          ) : exportedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">GLB Terunduh!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ekspor GLB (glTF 2.0)</span>
            </>
          )}
        </button>
      </div>

      {/* 3D Projected Clickable Educational Pins */}
      {showHotspots && VOLCANO_MARKERS.map(marker => {
        const screen = markerScreenCoords[marker.id];
        if (!screen || !screen.visible) return null;

        const isSelected = selectedMarkerId === marker.id;

        return (
          <button
            key={marker.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectMarker(marker);
            }}
            style={{
              left: `${screen.x}px`,
              top: `${screen.y}px`
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border shadow-lg transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-orange-600 text-white border-orange-400 scale-110 shadow-orange-600/40 ring-2 ring-white/80'
                : 'bg-slate-900/90 text-slate-200 border-slate-700/80 hover:bg-orange-600 hover:text-white hover:scale-105 shadow-md'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="whitespace-nowrap text-[11px]">{marker.name.split(' (')[0]}</span>
          </button>
        );
      })}


    </div>
  );
};
