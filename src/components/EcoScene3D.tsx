/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrganismId, OrganismItem, TimeOfDay, WeatherCondition, CameraPreset } from '../types';
import { ORGANISMS, FOOD_CHAIN_STEPS } from '../data/ecoData';
import { ecoAudio } from '../utils/ecoAudio';

interface EcoScene3DProps {
  timeOfDay: TimeOfDay;
  weather: WeatherCondition;
  selectedOrganism: OrganismItem | null;
  onSelectOrganism: (org: OrganismItem | null) => void;
  hoveredOrganism: OrganismItem | null;
  setHoveredOrganism: (org: OrganismItem | null) => void;
  cameraPreset: CameraPreset;
  activeSimulationStep: number | null; // 1 to 7
  removedOrganisms: OrganismId[];
  showEnergyFlow: boolean;
  showTrophicArrows: boolean;
  onToast: (msg: string) => void;
}

export const EcoScene3D: React.FC<EcoScene3DProps> = ({
  timeOfDay,
  weather,
  selectedOrganism,
  onSelectOrganism,
  hoveredOrganism,
  setHoveredOrganism,
  cameraPreset,
  activeSimulationStep,
  removedOrganisms,
  showEnergyFlow,
  showTrophicArrows,
  onToast
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(35);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // References to animated 3D meshes
  const organismMeshesRef = useRef<Map<OrganismId, THREE.Group>>(new Map());
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const moonMeshRef = useRef<THREE.Group | null>(null);
  const cloudsGroupRef = useRef<THREE.Group | null>(null);
  const rainPointsRef = useRef<THREE.Points | null>(null);
  const energyParticlesRef = useRef<THREE.Points | null>(null);
  const energyCurvePointsRef = useRef<Float32Array | null>(null);
  const riverMeshRef = useRef<THREE.Mesh | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  // Camera Target Interpolation
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 12, 28));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
  const isTransitioningCameraRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(timeOfDay === 'day' ? 0x86efac : 0x050c18);
    scene.fog = new THREE.FogExp2(timeOfDay === 'day' ? 0xbbf7d0 : 0x081326, 0.014);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.2,
      1200
    );
    camera.position.set(0, 12, 28);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04; // Don't look under ground
    controls.minDistance = 3.5;
    controls.maxDistance = 65;
    controls.target.set(0, 2, 0);
    controlsRef.current = controls;

    // 5. Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x166534, 0.85);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    dirLight.position.set(18, 35, 14);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 120;
    dirLight.shadow.camera.left = -28;
    dirLight.shadow.camera.right = 28;
    dirLight.shadow.camera.top = 28;
    dirLight.shadow.camera.bottom = -28;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Ambient light fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // 6. Build Rich Terrestrial Ecosystem (Padang Rumput & Sungai)
    buildTerrain(scene);
    buildFloraAndRocks(scene);
    buildCelestialObjects(scene);
    buildClouds(scene);
    buildRainSystem(scene);
    buildEnergyParticles(scene);
    buildOrganisms(scene);

    // 7. Raycasting for Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveGroups: THREE.Object3D[] = [];
      organismMeshesRef.current.forEach((grp) => {
        if (grp.visible) interactiveGroups.push(grp);
      });

      const intersects = raycaster.intersectObjects(interactiveGroups, true);
      if (intersects.length > 0) {
        let rootGroup: THREE.Object3D | null = intersects[0].object;
        while (rootGroup && !rootGroup.userData?.organismId && rootGroup.parent) {
          rootGroup = rootGroup.parent;
        }

        const orgId = rootGroup?.userData?.organismId as OrganismId | undefined;
        if (orgId) {
          const org = ORGANISMS.find((o) => o.id === orgId);
          if (org) {
            setHoveredOrganism(org);
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top - 15 });
            container.style.cursor = 'pointer';
            return;
          }
        }
      }
      setHoveredOrganism(null);
      setTooltipPos(null);
      container.style.cursor = 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactiveGroups: THREE.Object3D[] = [];
      organismMeshesRef.current.forEach((grp) => {
        if (grp.visible) interactiveGroups.push(grp);
      });

      const intersects = raycaster.intersectObjects(interactiveGroups, true);
      if (intersects.length > 0) {
        let rootGroup: THREE.Object3D | null = intersects[0].object;
        while (rootGroup && !rootGroup.userData?.organismId && rootGroup.parent) {
          rootGroup = rootGroup.parent;
        }

        const orgId = rootGroup?.userData?.organismId as OrganismId | undefined;
        if (orgId) {
          const org = ORGANISMS.find((o) => o.id === orgId);
          if (org) {
            onSelectOrganism(org);
            ecoAudio.playClick();
            if (org.id === 'katak') ecoAudio.playFrogJump();
            else if (org.id === 'elang') ecoAudio.playEagleSwoop();
            else if (org.id === 'sun') ecoAudio.playEnergyPulse();
          }
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // 8. Animation Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Camera smooth lerp when transitioning
      if (isTransitioningCameraRef.current) {
        camera.position.lerp(targetCamPosRef.current, delta * 3.2);
        controls.target.lerp(targetLookAtRef.current, delta * 3.2);
        controls.update();

        if (
          camera.position.distanceTo(targetCamPosRef.current) < 0.25 &&
          controls.target.distanceTo(targetLookAtRef.current) < 0.2
        ) {
          isTransitioningCameraRef.current = false;
        }
      } else {
        controls.update();
      }

      // Procedural Animations
      // Clouds drift
      if (cloudsGroupRef.current) {
        cloudsGroupRef.current.position.x = ((elapsed * 0.45) % 80) - 40;
      }

      // Sun pulsing glow
      if (sunMeshRef.current) {
        sunMeshRef.current.rotation.y = elapsed * 0.12;
        const scaleVal = 2.2 + Math.sin(elapsed * 2) * 0.08;
        sunMeshRef.current.scale.set(scaleVal, scaleVal, scaleVal);
      }

      // River surface shimmer
      if (riverMeshRef.current) {
        const mat = riverMeshRef.current.material as THREE.MeshStandardMaterial;
        mat.roughness = 0.12 + Math.sin(elapsed * 1.5) * 0.05;
      }

      // Rain particles falling
      if (rainPointsRef.current && rainPointsRef.current.visible) {
        const posAttr = rainPointsRef.current.geometry.attributes.position;
        const arr = posAttr.array as Float32Array;
        for (let i = 1; i < arr.length; i += 3) {
          arr[i] -= 32 * delta;
          if (arr[i] < 0.1) arr[i] = 30 + Math.random() * 5;
        }
        posAttr.needsUpdate = true;
      }

      // Energy particles stream
      updateEnergyParticles(elapsed);

      // Living Organisms Subtle Movement
      animateOrganisms(elapsed);

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      setLoadingProgress(100);
      setIsLoading(false);
    }, 450);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync Day / Night Lighting & Sky
  useEffect(() => {
    const scene = sceneRef.current;
    const dirLight = dirLightRef.current;
    const hemiLight = hemiLightRef.current;
    if (!scene || !dirLight || !hemiLight) return;

    if (timeOfDay === 'day') {
      scene.background = new THREE.Color(weather === 'cloudy' ? 0x94a3b8 : 0x7dd3fc);
      scene.fog = new THREE.FogExp2(weather === 'cloudy' ? 0xcbd5e1 : 0xbae6fd, 0.015);
      dirLight.color.setHex(0xfffbeb);
      dirLight.intensity = weather === 'rain' ? 0.6 : weather === 'cloudy' ? 0.9 : 1.5;
      hemiLight.color.setHex(0xffffff);
      hemiLight.groundColor.setHex(0x166534);
      hemiLight.intensity = 0.85;

      if (sunMeshRef.current) sunMeshRef.current.visible = true;
      if (moonMeshRef.current) moonMeshRef.current.visible = false;
    } else {
      scene.background = new THREE.Color(0x030712);
      scene.fog = new THREE.FogExp2(0x060f1e, 0.02);
      dirLight.color.setHex(0x60a5fa);
      dirLight.intensity = 0.45;
      hemiLight.color.setHex(0x1e293b);
      hemiLight.groundColor.setHex(0x0f172a);
      hemiLight.intensity = 0.35;

      if (sunMeshRef.current) sunMeshRef.current.visible = false;
      if (moonMeshRef.current) moonMeshRef.current.visible = true;
    }
  }, [timeOfDay, weather]);

  // Sync Weather (Rain)
  useEffect(() => {
    if (rainPointsRef.current) {
      rainPointsRef.current.visible = weather === 'rain';
    }
  }, [weather]);

  // Sync Removed Organisms (Eksperimen Ekosistem)
  useEffect(() => {
    organismMeshesRef.current.forEach((grp, id) => {
      const isRemoved = removedOrganisms.includes(id);
      grp.visible = !isRemoved;
    });
  }, [removedOrganisms]);

  // Sync Camera Presets & Focus Mode
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (selectedOrganism) {
      const [ox, oy, oz] = selectedOrganism.position;
      targetLookAtRef.current.set(ox, oy + 0.6, oz);
      targetCamPosRef.current.set(ox + 3.2, oy + 2.5, oz + 4.8);
      isTransitioningCameraRef.current = true;
      return;
    }

    if (cameraPreset === 'overview') {
      targetLookAtRef.current.set(0, 2, 0);
      targetCamPosRef.current.set(0, 13, 28);
      isTransitioningCameraRef.current = true;
    } else if (cameraPreset === 'producer') {
      targetLookAtRef.current.set(-4.5, 1.2, 3.5);
      targetCamPosRef.current.set(-2.5, 3.8, 8.5);
      isTransitioningCameraRef.current = true;
    } else if (cameraPreset === 'consumer') {
      targetLookAtRef.current.set(-0.5, 1.0, 1.0);
      targetCamPosRef.current.set(1.5, 4.2, 5.5);
      isTransitioningCameraRef.current = true;
    } else if (cameraPreset === 'predator') {
      targetLookAtRef.current.set(2.2, 5.5, 1.0);
      targetCamPosRef.current.set(4.5, 12.0, 8.5);
      isTransitioningCameraRef.current = true;
    } else if (cameraPreset === 'decomposer') {
      targetLookAtRef.current.set(-5.8, 0.8, -2.5);
      targetCamPosRef.current.set(-3.5, 3.2, 1.5);
      isTransitioningCameraRef.current = true;
    } else if (cameraPreset === 'top_down') {
      targetLookAtRef.current.set(0, 0, 0);
      targetCamPosRef.current.set(0.1, 38, 0.1);
      isTransitioningCameraRef.current = true;
    }
  }, [cameraPreset, selectedOrganism]);

  // Sync Food Chain Step Simulation Camera
  useEffect(() => {
    if (activeSimulationStep !== null) {
      const stepData = FOOD_CHAIN_STEPS.find((s) => s.step === activeSimulationStep);
      if (stepData) {
        const [cx, cy, cz] = stepData.cameraPosition;
        const [tx, ty, tz] = stepData.cameraTarget;
        targetCamPosRef.current.set(cx, cy, cz);
        targetLookAtRef.current.set(tx, ty, tz);
        isTransitioningCameraRef.current = true;
        ecoAudio.playEnergyPulse();
      }
    }
  }, [activeSimulationStep]);

  // ============================================================
  // PROCEDURAL BUILDERS (HIGH FIDELITY NATURE ENVIRONMENT)
  // ============================================================
  const buildTerrain = (scene: THREE.Scene) => {
    // 1. Rolling Green Grassland Floor
    const terrainGeo = new THREE.PlaneGeometry(64, 64, 72, 72);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Gentle rolling knolls and river carving
      let y = Math.sin(x * 0.12) * Math.cos(z * 0.12) * 1.2 + Math.sin(x * 0.28) * 0.4;

      // Carve winding river channel from back to front
      const riverCenterX = Math.sin(z * 0.16) * 5.0;
      const distToRiver = Math.abs(x - riverCenterX);
      if (distToRiver < 4.0) {
        y -= Math.cos((distToRiver / 4.0) * (Math.PI / 2)) * 1.6;
      }

      pos.setY(i, y);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.88,
      metalness: 0.05,
      flatShading: true
    });

    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    terrain.name = 'Grassland_Terrain';
    scene.add(terrain);

    // 2. Winding River Water
    const riverGeo = new THREE.PlaneGeometry(8, 64, 24, 48);
    riverGeo.rotateX(-Math.PI / 2);
    const rPos = riverGeo.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      const z = rPos.getZ(i);
      const xOffset = Math.sin(z * 0.16) * 5.0;
      rPos.setX(i, rPos.getX(i) * 0.65 + xOffset);
      rPos.setY(i, -0.65);
    }
    riverGeo.computeVertexNormals();

    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.65,
      transparent: true,
      opacity: 0.85
    });

    const river = new THREE.Mesh(riverGeo, riverMat);
    river.name = 'Winding_River';
    riverMeshRef.current = river;
    scene.add(river);

    // 3. Small Pond for the Frog
    const pondGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.5, 32);
    const pondMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      roughness: 0.18,
      metalness: 0.75,
      transparent: true,
      opacity: 0.88
    });
    const pond = new THREE.Mesh(pondGeo, pondMat);
    pond.position.set(1.5, -0.28, 0.8);
    scene.add(pond);

    // Pond Lily Pads
    for (let p = 0; p < 4; p++) {
      const lilyGeo = new THREE.CircleGeometry(0.55 + p * 0.08, 16);
      const lilyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
      const lily = new THREE.Mesh(lilyGeo, lilyMat);
      lily.rotation.x = -Math.PI / 2;
      const angle = (p / 4) * Math.PI * 2;
      lily.position.set(1.5 + Math.cos(angle) * 1.8, 0.01, 0.8 + Math.sin(angle) * 1.8);
      scene.add(lily);
    }
  };

  const buildFloraAndRocks = (scene: THREE.Scene) => {
    // 1. Stylized Low-Poly Forest Trees
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const leafMat1 = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7, flatShading: true });
    const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7, flatShading: true });

    const treePositions = [
      [-16, 0, -12],
      [-12, 0, -18],
      [14, 0, -14],
      [18, 0, -8],
      [16, 0, 8],
      [-18, 0, 6],
      [-14, 0, 14],
      [12, 0, 18],
      [-6, 0, -20],
      [8, 0, -22]
    ];

    treePositions.forEach((pos, idx) => {
      const treeGroup = new THREE.Group();
      const trunkH = 3.5 + (idx % 3) * 0.8;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, trunkH, 8), trunkMat);
      trunk.position.y = trunkH / 2;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      treeGroup.add(trunk);

      // 3 Cone Foliage Layers
      for (let layer = 0; layer < 3; layer++) {
        const radius = 2.4 - layer * 0.5;
        const coneH = 2.8 - layer * 0.4;
        const foliage = new THREE.Mesh(
          new THREE.ConeGeometry(radius, coneH, 7),
          idx % 2 === 0 ? leafMat1 : leafMat2
        );
        foliage.position.y = trunkH - 0.4 + layer * 1.6;
        foliage.castShadow = true;
        treeGroup.add(foliage);
      }

      treeGroup.position.set(pos[0], pos[1], pos[2]);
      const s = 0.85 + (idx % 4) * 0.15;
      treeGroup.scale.set(s, s, s);
      scene.add(treeGroup);
    });

    // 2. Large Perch Rock for Eagle
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9, flatShading: true });
    const bluffGeo = new THREE.DodecahedronGeometry(3.5, 1);
    const perchRock = new THREE.Mesh(bluffGeo, rockMat);
    perchRock.position.set(1.5, 4.5, 2.5);
    perchRock.scale.set(1.4, 2.2, 1.4);
    perchRock.castShadow = true;
    perchRock.receiveShadow = true;
    scene.add(perchRock);

    // Riverbank & Field Pebbles
    const pebbleCoords = [
      [0.2, 0.3, 0.4],
      [2.8, 0.2, 1.2],
      [-0.8, 0.3, 2.2],
      [3.2, 0.2, -1.2],
      [-4.0, 0.3, 2.8]
    ];
    pebbleCoords.forEach((c) => {
      const pebble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), rockMat);
      pebble.position.set(c[0], c[1], c[2]);
      pebble.scale.set(1.1, 0.7, 0.9);
      pebble.castShadow = true;
      scene.add(pebble);
    });
  };

  const buildCelestialObjects = (scene: THREE.Scene) => {
    // 1. Glowing Sun
    const sunGeo = new THREE.SphereGeometry(2.4, 24, 24);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(0, 24, -20);
    sun.userData = { organismId: 'sun' };
    scene.add(sun);
    sunMeshRef.current = sun;

    // Sun corona glow ring
    const sunGlow = new THREE.Mesh(
      new THREE.RingGeometry(2.4, 4.2, 32),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
    );
    sun.add(sunGlow);

    // 2. Night Moon
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-14, 24, -18);
    const moonGeo = new THREE.SphereGeometry(2.0, 24, 24);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0x93c5fd,
      emissiveIntensity: 0.6,
      roughness: 0.7
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moonGroup.add(moon);
    moonGroup.visible = false;
    scene.add(moonGroup);
    moonMeshRef.current = moonGroup;

    // 3. Stars Field (Night Mode)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 160;
      starPos[i + 1] = 18 + Math.random() * 60;
      starPos[i + 2] = (Math.random() - 0.5) * 160;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.85, transparent: true, opacity: 0.85 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
  };

  const buildClouds = (scene: THREE.Scene) => {
    const clouds = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: true });

    const clusterOffsets = [
      [-22, 22, -10],
      [8, 24, -16],
      [24, 21, 6],
      [-14, 23, 14]
    ];

    clusterOffsets.forEach((pos) => {
      const cluster = new THREE.Group();
      cluster.position.set(pos[0], pos[1], pos[2]);
      for (let p = 0; p < 5; p++) {
        const puff = new THREE.Mesh(new THREE.DodecahedronGeometry(1.8 + Math.random() * 0.8, 1), cloudMat);
        puff.position.set((p - 2) * 1.4, Math.random() * 0.6, (Math.random() - 0.5) * 1.8);
        cluster.add(puff);
      }
      clouds.add(cluster);
    });

    scene.add(clouds);
    cloudsGroupRef.current = clouds;
  };

  const buildRainSystem = (scene: THREE.Scene) => {
    const count = 1400;
    const rainGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 55;
      positions[i + 1] = Math.random() * 32;
      positions[i + 2] = (Math.random() - 0.5) * 55;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const rainMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.35,
      transparent: true,
      opacity: 0.75
    });

    const rain = new THREE.Points(rainGeo, rainMat);
    rain.visible = false;
    scene.add(rain);
    rainPointsRef.current = rain;
  };

  const buildEnergyParticles = (scene: THREE.Scene) => {
    const pCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xfacc15,
      size: 0.55,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pGeo, pMat);
    particles.visible = false;
    scene.add(particles);
    energyParticlesRef.current = particles;
  };

  // Build the 6 Living Ecosystem Organisms (Procedural High-Fidelity with GLB fallback)
  const buildOrganisms = (scene: THREE.Scene) => {
    const gltfLoader = new GLTFLoader();

    // 1. RUMPUT (PRODUSEN)
    const grassGroup = new THREE.Group();
    grassGroup.name = 'Organism_Rumput';
    grassGroup.userData = { organismId: 'rumput' };
    grassGroup.position.set(-4.5, 0.2, 3.5);

    // Rich Patch of Swaying Grass Blades + Flowers
    const bladeMat1 = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.65, side: THREE.DoubleSide });
    const bladeMat2 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.65, side: THREE.DoubleSide });

    for (let b = 0; b < 45; b++) {
      const bladeH = 0.9 + Math.random() * 0.7;
      const bladeW = 0.12 + Math.random() * 0.08;
      const blade = new THREE.Mesh(new THREE.ConeGeometry(bladeW, bladeH, 4), b % 2 === 0 ? bladeMat1 : bladeMat2);
      blade.position.set((Math.random() - 0.5) * 2.8, bladeH / 2, (Math.random() - 0.5) * 2.8);
      blade.rotation.x = (Math.random() - 0.5) * 0.35;
      blade.rotation.z = (Math.random() - 0.5) * 0.35;
      blade.castShadow = true;
      grassGroup.add(blade);
    }

    // Yellow wildflowers in grass
    const flowerMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6 });
    for (let f = 0; f < 6; f++) {
      const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 0), flowerMat);
      flower.position.set((Math.random() - 0.5) * 2.2, 0.8 + Math.random() * 0.4, (Math.random() - 0.5) * 2.2);
      grassGroup.add(flower);
    }
    scene.add(grassGroup);
    organismMeshesRef.current.set('rumput', grassGroup);

    // 2. BELALANG (KONSUMEN I)
    const hopperGroup = new THREE.Group();
    hopperGroup.name = 'Organism_Belalang';
    hopperGroup.userData = { organismId: 'belalang' };
    hopperGroup.position.set(-2.2, 0.65, 1.2);

    const hopperMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.5, metalness: 0.1 });
    const hopperEyeMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.2 });

    // Abdomen & Thorax
    const thorax = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.55, 6, 12), hopperMat);
    thorax.rotation.z = Math.PI / 2.8;
    thorax.castShadow = true;
    hopperGroup.add(thorax);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), hopperMat);
    head.position.set(0.35, 0.18, 0);
    hopperGroup.add(head);

    // Eyes
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), hopperEyeMat);
    eyeL.position.set(0.42, 0.26, 0.12);
    const eyeR = eyeL.clone();
    eyeR.position.set(0.42, 0.26, -0.12);
    hopperGroup.add(eyeL);
    hopperGroup.add(eyeR);

    // Jumping Legs (Rear)
    const legMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.6 });
    const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.85), legMat);
    legL.position.set(-0.25, 0.28, 0.24);
    legL.rotation.z = -Math.PI / 3;
    legL.rotation.x = Math.PI / 6;
    hopperGroup.add(legL);

    const legR = legL.clone();
    legR.position.set(-0.25, 0.28, -0.24);
    legR.rotation.x = -Math.PI / 6;
    hopperGroup.add(legR);

    // Antennae
    const antL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5), legMat);
    antL.position.set(0.55, 0.42, 0.06);
    antL.rotation.z = -Math.PI / 4;
    hopperGroup.add(antL);
    const antR = antL.clone();
    antR.position.set(0.55, 0.42, -0.06);
    hopperGroup.add(antR);

    hopperGroup.scale.set(0.9, 0.9, 0.9);
    scene.add(hopperGroup);
    organismMeshesRef.current.set('belalang', hopperGroup);

    // 3. KATAK (KONSUMEN II)
    const frogGroup = new THREE.Group();
    frogGroup.name = 'Organism_Katak';
    frogGroup.userData = { organismId: 'katak' };
    frogGroup.position.set(1.2, 0.45, 0.8);

    const frogMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.45 });
    const frogBellyMat = new THREE.MeshStandardMaterial({ color: 0xd9f99d, roughness: 0.7 });

    // Frog Body
    const frogBody = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), frogMat);
    frogBody.scale.set(1.0, 0.72, 1.25);
    frogBody.castShadow = true;
    frogGroup.add(frogBody);

    // Underbelly
    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 12), frogBellyMat);
    belly.scale.set(0.9, 0.5, 1.1);
    belly.position.set(0, -0.15, 0.1);
    frogGroup.add(belly);

    // Bulging Eyes
    const frogEyeL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), frogMat);
    frogEyeL.position.set(0.24, 0.32, 0.4);
    const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), hopperEyeMat);
    pupilL.position.set(0.26, 0.35, 0.48);
    frogGroup.add(frogEyeL);
    frogGroup.add(pupilL);

    const frogEyeR = frogEyeL.clone();
    frogEyeR.position.set(-0.24, 0.32, 0.4);
    const pupilR = pupilL.clone();
    pupilR.position.set(-0.26, 0.35, 0.48);
    frogGroup.add(frogEyeR);
    frogGroup.add(pupilR);

    // Webbed Legs
    const frogLegL = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), frogMat);
    frogLegL.scale.set(0.45, 0.45, 1.1);
    frogLegL.position.set(0.48, -0.05, -0.32);
    frogGroup.add(frogLegL);

    const frogLegR = frogLegL.clone();
    frogLegR.position.set(-0.48, -0.05, -0.32);
    frogGroup.add(frogLegR);

    scene.add(frogGroup);
    organismMeshesRef.current.set('katak', frogGroup);

    // 4. ULAR (KONSUMEN III)
    const snakeGroup = new THREE.Group();
    snakeGroup.name = 'Organism_Ular';
    snakeGroup.userData = { organismId: 'ular' };
    snakeGroup.position.set(3.8, 0.35, -0.6);

    // S-curve Snake Body (Tube Geometry)
    const snakeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4, 0.12, 0.4),
      new THREE.Vector3(-0.8, 0.15, -0.5),
      new THREE.Vector3(0.0, 0.18, 0.6),
      new THREE.Vector3(0.8, 0.22, -0.3),
      new THREE.Vector3(1.3, 0.45, 0.2),
      new THREE.Vector3(1.5, 0.65, 0.4) // Raised Head
    ]);

    const snakeGeo = new THREE.TubeGeometry(snakeCurve, 42, 0.15, 10, false);
    const snakeMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.55,
      metalness: 0.15
    });
    const snakeBody = new THREE.Mesh(snakeGeo, snakeMat);
    snakeBody.castShadow = true;
    snakeGroup.add(snakeBody);

    // Snake Head
    const snakeHead = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 8), snakeMat);
    snakeHead.position.set(1.5, 0.65, 0.4);
    snakeHead.rotation.x = Math.PI / 2.2;
    snakeHead.rotation.z = -Math.PI / 4;
    snakeGroup.add(snakeHead);

    // Flicking Red Tongue
    const tongueMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.28), tongueMat);
    tongue.position.set(1.68, 0.66, 0.55);
    snakeGroup.add(tongue);

    scene.add(snakeGroup);
    organismMeshesRef.current.set('ular', snakeGroup);

    // 5. ELANG (PREDATOR PUNCAK)
    const eagleGroup = new THREE.Group();
    eagleGroup.name = 'Organism_Elang';
    eagleGroup.userData = { organismId: 'elang' };
    eagleGroup.position.set(1.5, 7.2, 2.5); // Perched atop bluff

    const eagleMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.8 });
    const eagleHeadMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.7 });
    const beakMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });

    // Eagle Body
    const eagleBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.48, 1.1, 8, 16), eagleMat);
    eagleBody.rotation.z = Math.PI / 6;
    eagleBody.castShadow = true;
    eagleGroup.add(eagleBody);

    // Golden-brown Crest / Head
    const eagleHead = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 12), eagleHeadMat);
    eagleHead.position.set(0.42, 0.85, 0);
    eagleGroup.add(eagleHead);

    // Hooked Beak
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.38, 6), beakMat);
    beak.position.set(0.78, 0.82, 0);
    beak.rotation.z = -Math.PI / 2.2;
    eagleGroup.add(beak);

    // Wings (Spread slightly)
    const wingL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.8), eagleMat);
    wingL.position.set(-0.4, 0.45, 0.9);
    wingL.rotation.y = -Math.PI / 8;
    wingL.rotation.x = Math.PI / 10;
    eagleGroup.add(wingL);

    const wingR = wingL.clone();
    wingR.position.set(-0.4, 0.45, -0.9);
    wingR.rotation.y = Math.PI / 8;
    wingR.rotation.x = -Math.PI / 10;
    eagleGroup.add(wingR);

    // Talons
    const talonL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4), beakMat);
    talonL.position.set(0.1, -0.7, 0.2);
    eagleGroup.add(talonL);
    const talonR = talonL.clone();
    talonR.position.set(0.1, -0.7, -0.2);
    eagleGroup.add(talonR);

    scene.add(eagleGroup);
    organismMeshesRef.current.set('elang', eagleGroup);

    // 6. JAMUR DEKOMPOSER
    const mushroomGroup = new THREE.Group();
    mushroomGroup.name = 'Organism_Jamur';
    mushroomGroup.userData = { organismId: 'jamur' };
    mushroomGroup.position.set(-5.8, 0.35, -2.5);

    // Rotting Tree Log
    const logMat = new THREE.MeshStandardMaterial({ color: 0x3f2008, roughness: 0.95 });
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 3.2, 8), logMat);
    log.rotation.z = Math.PI / 2.2;
    log.rotation.y = Math.PI / 6;
    log.castShadow = true;
    mushroomGroup.add(log);

    // Cluster of Mushrooms sprouting from log
    const shroomCapMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.5 });
    const shroomStemMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.8 });

    for (let m = 0; m < 7; m++) {
      const stemH = 0.4 + (m % 3) * 0.15;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, stemH, 6), shroomStemMat);
      stem.position.set((m - 3) * 0.35, stemH / 2 + 0.25, (Math.random() - 0.5) * 0.6);
      mushroomGroup.add(stem);

      const capR = 0.22 + (m % 3) * 0.08;
      const cap = new THREE.Mesh(new THREE.ConeGeometry(capR, 0.22, 12), shroomCapMat);
      cap.position.set(stem.position.x, stem.position.y + stemH / 2 + 0.08, stem.position.z);
      mushroomGroup.add(cap);
    }

    scene.add(mushroomGroup);
    organismMeshesRef.current.set('jamur', mushroomGroup);

    // Try graceful optional GLB loader for user-provided models
    const tryLoadGLB = (modelPath: string, targetId: OrganismId) => {
      gltfLoader.load(
        modelPath,
        (gltf) => {
          const loadedScene = gltf.scene;
          loadedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          const targetGrp = organismMeshesRef.current.get(targetId);
          if (targetGrp) {
            targetGrp.clear();
            targetGrp.add(loadedScene);
            onToast(`Model 3D ${targetId}.glb berhasil dimuat!`);
          }
        },
        undefined,
        () => {
          // Graceful fallback to procedural model without throwing
        }
      );
    };

    tryLoadGLB('/models/grass.glb', 'rumput');
    tryLoadGLB('/models/grasshopper.glb', 'belalang');
    tryLoadGLB('/models/frog.glb', 'katak');
    tryLoadGLB('/models/snake.glb', 'ular');
    tryLoadGLB('/models/eagle.glb', 'elang');
    tryLoadGLB('/models/mushroom.glb', 'jamur');
  };

  // Animate Organism Idle Behaviors
  const animateOrganisms = (elapsed: number) => {
    // 1. Rumput sway
    const grass = organismMeshesRef.current.get('rumput');
    if (grass && grass.visible) {
      grass.rotation.z = Math.sin(elapsed * 2.2) * 0.04;
    }

    // 2. Belalang hop
    const belalang = organismMeshesRef.current.get('belalang');
    if (belalang && belalang.visible) {
      belalang.position.y = 0.65 + Math.abs(Math.sin(elapsed * 3.5)) * 0.25;
      belalang.rotation.y = Math.sin(elapsed * 0.8) * 0.15;
    }

    // 3. Katak breathing throat puff
    const katak = organismMeshesRef.current.get('katak');
    if (katak && katak.visible) {
      const breath = 1.0 + Math.sin(elapsed * 4.0) * 0.05;
      katak.scale.set(breath, breath, 1.0);
    }

    // 4. Ular head oscillation
    const ular = organismMeshesRef.current.get('ular');
    if (ular && ular.visible) {
      ular.rotation.y = Math.sin(elapsed * 1.8) * 0.1;
    }

    // 5. Elang majestic wing & head turn
    const elang = organismMeshesRef.current.get('elang');
    if (elang && elang.visible) {
      elang.position.y = 7.2 + Math.sin(elapsed * 2.0) * 0.12;
      elang.rotation.y = Math.sin(elapsed * 0.5) * 0.25;
    }

    // 6. Jamur spore glow
    const jamur = organismMeshesRef.current.get('jamur');
    if (jamur && jamur.visible) {
      jamur.scale.setScalar(1.0 + Math.sin(elapsed * 2.5) * 0.02);
    }
  };

  // Update Glowing Energy Transfer Particles
  const updateEnergyParticles = (elapsed: number) => {
    const pMesh = energyParticlesRef.current;
    if (!pMesh) return;

    if (!showEnergyFlow && activeSimulationStep === null) {
      pMesh.visible = false;
      return;
    }

    pMesh.visible = true;
    const posAttr = pMesh.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    // Determine source and target organisms
    let srcOrg = ORGANISMS[0]; // Sun
    let tgtOrg = ORGANISMS[1]; // Rumput

    if (activeSimulationStep !== null) {
      const step = FOOD_CHAIN_STEPS.find((s) => s.step === activeSimulationStep);
      if (step) {
        srcOrg = ORGANISMS.find((o) => o.id === step.sourceId) || srcOrg;
        tgtOrg = ORGANISMS.find((o) => o.id === step.targetId) || tgtOrg;
      }
    } else {
      // Loop through chain over time
      const cycleIdx = Math.floor(elapsed * 0.4) % (ORGANISMS.length - 1);
      srcOrg = ORGANISMS[cycleIdx];
      tgtOrg = ORGANISMS[cycleIdx + 1];
    }

    const p0 = new THREE.Vector3(...srcOrg.position);
    const p2 = new THREE.Vector3(...tgtOrg.position);
    const p1 = new THREE.Vector3(
      (p0.x + p2.x) / 2,
      Math.max(p0.y, p2.y) + 3.5,
      (p0.z + p2.z) / 2
    );

    const curve = new THREE.QuadraticBezierCurve3(p0, p1, p2);
    const count = arr.length / 3;

    for (let i = 0; i < count; i++) {
      const t = ((i / count) + (elapsed * 0.65)) % 1.0;
      const point = curve.getPoint(t);
      arr[i * 3 + 0] = point.x + (Math.sin(elapsed * 8 + i) * 0.25);
      arr[i * 3 + 1] = point.y + (Math.cos(elapsed * 8 + i) * 0.25);
      arr[i * 3 + 2] = point.z + (Math.sin(elapsed * 6 + i) * 0.25);
    }

    posAttr.needsUpdate = true;
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden" ref={containerRef}>
      {/* Loading Screen Overlay (Section X) */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md text-white transition-opacity duration-500">
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-emerald-500/30 flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full mx-4">
            <span className="text-4xl animate-bounce">🌱</span>
            <div className="text-center space-y-1">
              <h3 className="font-black text-lg text-emerald-400 tracking-wide font-mono">
                MEMUAT EKOSISTEM 3D...
              </h3>
              <p className="text-xs text-slate-300">
                Menyiapkan padang rumput, rantai makanan, dan partikel energi
              </p>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-emerald-500 to-lime-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              {loadingProgress}% • THREE.JS WEBGL PBR
            </span>
          </div>
        </div>
      )}

      {/* Floating Hover Tooltip (Section H) */}
      {hoveredOrganism && tooltipPos && (
        <div
          className="absolute z-40 pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-75"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-500/50 shadow-2xl flex items-center gap-2.5 text-xs animate-in zoom-in-95">
            <span className="text-xl">{hoveredOrganism.icon}</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-xs">{hoveredOrganism.name}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Trofik {hoveredOrganism.trophicLevel}
                </span>
              </div>
              <span className="text-[10px] text-slate-300">{hoveredOrganism.role}</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Navigation 3D Hints Bar */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 shadow-xl">
        <span className="text-emerald-400 font-bold">🖱️ Kontrol 3D:</span>
        <span className="text-slate-400">Putar: Drag • Zoom: Scroll • Pilih: Klik Organisme</span>
      </div>
    </div>
  );
};
