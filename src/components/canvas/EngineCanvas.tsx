'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface EngineCanvasProps {
  navMode: 'journey' | 'atlas';
  scrollProgress: number;
  activeProject: string;
  atlasPan: { x: number; y: number; zoom: number };
}

export const EngineCanvas: React.FC<EngineCanvasProps> = ({
  scrollProgress,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // ── SCENE & ISOMETRIC CAMERA ─────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0d10);
    scene.fog = new THREE.FogExp2(0x0c0d10, 0.03);

    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    camera.position.set(11.5, 9.8, 12.5);
    camera.lookAt(0, -0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── LUXURY STUDIO ENVMAP GENERATION (For ultra-glossy clearcoat reflections)
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();

    const createStudioEnvMap = () => {
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0x111317);

      // Bright softbox overhead panel
      const softboxGeo = new THREE.PlaneGeometry(16, 16);
      const softboxMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const softbox = new THREE.Mesh(softboxGeo, softboxMat);
      softbox.position.set(0, 10, 0);
      softbox.rotation.x = Math.PI / 2;
      envScene.add(softbox);

      // Warm side strip
      const strip1 = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 20),
        new THREE.MeshBasicMaterial({ color: 0xff9944 })
      );
      strip1.position.set(12, 4, 6);
      strip1.rotation.y = -Math.PI / 3;
      envScene.add(strip1);

      // Cool rim strip
      const strip2 = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 20),
        new THREE.MeshBasicMaterial({ color: 0x44aaff })
      );
      strip2.position.set(-12, 4, -6);
      strip2.rotation.y = Math.PI / 3;
      envScene.add(strip2);

      const renderTarget = pmremGen.fromScene(envScene, 0.04);
      envScene.clear();
      return renderTarget.texture;
    };

    const envTexture = createStudioEnvMap();
    scene.environment = envTexture;

    // ── LIGHTING SETUP ───────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(10, 16, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0002;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x70b0ff, 2.5);
    rimLight.position.set(-12, 8, -10);
    scene.add(rimLight);

    const warmAccent = new THREE.DirectionalLight(0xff8844, 2.0);
    warmAccent.position.set(6, -2, -10);
    scene.add(warmAccent);

    // ── BEVELED TILES VIA SMOOTH GEOMETRY ────────────────────────────────────
    const SLICES_PER_TRACK = 44;
    const SLICE_WIDTH = 0.92;
    const SLICE_HEIGHT = 0.38;
    const SLICE_LENGTH = 0.12;
    const SPACING = 0.16;
    const TRACK_SPACING = 1.18;
    const TOTAL_SLICES = SLICES_PER_TRACK * 4;

    const tileGeo = new THREE.BoxGeometry(SLICE_WIDTH, SLICE_HEIGHT, SLICE_LENGTH, 2, 2, 2);

    // ── ULTRA GLOSSY LACQUER MATERIALS (MeshPhysicalMaterial) ────────────────
    const trackColors = [
      new THREE.Color(0x3273b5), // Brilliant Cobalt / Cerulean Blue
      new THREE.Color(0xdda236), // Liquid Rich Gold
      new THREE.Color(0xd44d6a), // Vibrant Candy Rose
      new THREE.Color(0x2ea86b), // Luminous Emerald Jade
    ];

    const trackOffsets = [0.0, 1.57, 3.14, 4.71];

    const glossyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
      envMapIntensity: 2.2,
    });

    // GPU INSTANCED MESH (1 Single Draw Call for all 176 Tiles at 120 FPS!) ──
    const instancedTiles = new THREE.InstancedMesh(tileGeo, glossyMaterial, TOTAL_SLICES);
    instancedTiles.castShadow = true;
    instancedTiles.receiveShadow = true;
    instancedTiles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Assign vibrant per-instance colors
    const dummyColor = new THREE.Color();
    for (let tIdx = 0; tIdx < 4; tIdx++) {
      for (let sIdx = 0; sIdx < SLICES_PER_TRACK; sIdx++) {
        const instanceId = tIdx * SLICES_PER_TRACK + sIdx;
        dummyColor.copy(trackColors[tIdx]);
        instancedTiles.setColorAt(instanceId, dummyColor);
      }
    }
    if (instancedTiles.instanceColor) {
      instancedTiles.instanceColor.needsUpdate = true;
    }

    const motionRoot = new THREE.Group();
    motionRoot.rotation.y = Math.PI * 0.25;
    motionRoot.add(instancedTiles);
    scene.add(motionRoot);

    // ── HIGH-GLOSS QUADRANT SPHERES (Porcelain / Enamel Checkered) ────────────
    const makePorcelainQuadrantTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      // Deep High-Gloss Piano Black
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(0, 0, 1024, 1024);

      // Pure Pearl White Quadrants
      ctx.fillStyle = '#faf6ed';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillRect(512, 512, 512, 512);

      // Gold Inset Seam Lines
      ctx.strokeStyle = '#c69838';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(512, 0); ctx.lineTo(512, 1024);
      ctx.moveTo(0, 512); ctx.lineTo(1024, 512);
      ctx.stroke();

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };

    const ballMat = new THREE.MeshPhysicalMaterial({
      map: makePorcelainQuadrantTexture(),
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 2.5,
    });

    const sphereGeo = new THREE.SphereGeometry(0.38, 48, 48);
    const sphereMeshes: THREE.Mesh[] = [];

    for (let tIdx = 0; tIdx < 4; tIdx++) {
      const sphere = new THREE.Mesh(sphereGeo, ballMat);
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      motionRoot.add(sphere);
      sphereMeshes.push(sphere);
    }

    // ── FLOOR CONTACT SHADOW & REFLECTION PLANE ──────────────────────────────
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d10,
      roughness: 0.6,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.4;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // ── ULTRA-SMOOTH MOUSE ORBIT CONTROLS ────────────────────────────────────
    let targetCamAngleX = 0;
    let targetCamAngleY = 0;
    let currentCamAngleX = 0;
    let currentCamAngleY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    const baseCamRadius = 17.5;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        targetCamAngleX += deltaX * 0.005;
        targetCamAngleY += deltaY * 0.0035;
        targetCamAngleY = Math.max(-0.5, Math.min(0.5, targetCamAngleY));
        prevMouseX = clientX;
        prevMouseY = clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // ── MATRIX TRANSFORMS (OPTIMIZED 120 FPS RENDER LOOP) ───────────────────
    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyRot = new THREE.Euler();
    const dummyScale = new THREE.Vector3(1, 1, 1);
    const dummyQuat = new THREE.Quaternion();

    let animationId: number;
    const clock = new THREE.Clock();

    const TRACK_TOTAL_LENGTH = SLICES_PER_TRACK * SPACING;
    const waveFreq = 0.24;
    const waveSpeed = 3.6;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera Damping
      currentCamAngleX += (targetCamAngleX - currentCamAngleX) * 0.06;
      currentCamAngleY += (targetCamAngleY - currentCamAngleY) * 0.06;

      const camAngleBase = Math.PI * 0.28 + currentCamAngleX;
      const camElev = 9.8 + currentCamAngleY * 4.5;
      const camRad = baseCamRadius + (scrollProgress || 0) * 4.0;

      camera.position.x = Math.sin(camAngleBase) * camRad;
      camera.position.z = Math.cos(camAngleBase) * camRad;
      camera.position.y = camElev;
      camera.lookAt(0, -0.2, 0);

      // Key light micro-shimmer
      keyLight.position.x = 10 + Math.sin(elapsed * 0.6) * 1.5;

      // ── BATCH UPDATE INSTANCED MATRICES (ZERO CPU JANK) ───────────────────
      for (let tIdx = 0; tIdx < 4; tIdx++) {
        const trackX = (tIdx - 1.5) * TRACK_SPACING;
        const trackOffset = trackOffsets[tIdx];

        for (let sIdx = 0; sIdx < SLICES_PER_TRACK; sIdx++) {
          const instanceId = tIdx * SLICES_PER_TRACK + sIdx;
          const zPos = (sIdx - SLICES_PER_TRACK * 0.5) * SPACING;

          const phase = elapsed * waveSpeed - sIdx * waveFreq + trackOffset;
          const wave = Math.sin(phase);
          const waveCos = Math.cos(phase);

          dummyPos.set(trackX, Math.abs(wave) * 0.28, zPos);
          dummyRot.set(waveCos * 0.18, 0, wave * (Math.PI * 0.5));
          dummyQuat.setFromEuler(dummyRot);

          dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
          instancedTiles.setMatrixAt(instanceId, dummyMatrix);
        }

        // ── ROLLING BALL PHYSICS PER TRACK ──────────────────────────────────
        const ball = sphereMeshes[tIdx];
        const ballProgress = ((elapsed * 0.5 + trackOffset * 0.25) % 1.0);
        const ballZ = (ballProgress - 0.5) * (TRACK_TOTAL_LENGTH * 0.85);

        const sliceIndexEst = (ballZ / SPACING) + SLICES_PER_TRACK * 0.5;
        const ballPhase = elapsed * waveSpeed - sliceIndexEst * waveFreq + trackOffset;
        const ballWave = Math.sin(ballPhase);
        const ballY = 0.52 + Math.abs(ballWave) * 0.28;

        ball.position.set(trackX, ballY, ballZ);
        ball.rotation.x += 0.09;
        ball.rotation.z = ballWave * 0.25;
      }

      instancedTiles.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      pmremGen.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollProgress]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing z-0"
    />
  );
};
