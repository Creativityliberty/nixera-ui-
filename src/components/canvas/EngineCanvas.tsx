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
  navMode,
  scrollProgress,
  activeProject,
  atlasPan,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // ── SCENE & ISOMETRIC CAMERA ─────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x18191c);
    scene.fog = new THREE.FogExp2(0x18191c, 0.025);

    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(34, aspect, 0.1, 100);
    // Authentic 3/4 isometric perspective matching Blender viewport
    camera.position.set(10.5, 9.2, 11.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── STUDIO LIGHTING ──────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 3.2);
    keyLight.position.set(12, 18, 14);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa0c0e0, 1.5);
    fillLight.position.set(-10, 8, -6);
    scene.add(fillLight);

    const topSoft = new THREE.DirectionalLight(0xffffff, 1.2);
    topSoft.position.set(0, 15, 0);
    scene.add(topSoft);

    // ── QUADRANT TEXTURE FOR SPHERES (Black & Cream Checkered Ball) ───────────
    const makeQuadrantTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      // 4 quadrants
      ctx.fillStyle = '#e8e4dc'; // Warm ivory cream
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillRect(256, 256, 256, 256);
      ctx.fillStyle = '#1a1b1e'; // Matte deep obsidian
      ctx.fillRect(256, 0, 256, 256);
      ctx.fillRect(0, 256, 256, 256);
      // Soft center seam line
      ctx.strokeStyle = '#3a3b3e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(256, 0); ctx.lineTo(256, 512);
      ctx.moveTo(0, 256); ctx.lineTo(512, 256);
      ctx.stroke();

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    };

    const ballTexture = makeQuadrantTexture();
    const ballMaterial = new THREE.MeshStandardMaterial({
      map: ballTexture,
      roughness: 0.25,
      metalness: 0.1,
    });

    // ── KINETIC COLOR PALETTE (From Blender Reference) ────────────────────────
    const trackConfigs = [
      { color: 0x4a7bb0, name: 'Cerulean Blue', offset: 0.0, speed: 2.4 },
      { color: 0xc89e48, name: 'Warm Ochre Gold', offset: 1.6, speed: 2.4 },
      { color: 0xb06575, name: 'Dusty Mauve Pink', offset: 3.2, speed: 2.4 },
      { color: 0x529e75, name: 'Mint Emerald Green', offset: 4.8, speed: 2.4 },
    ];

    const motionRoot = new THREE.Group();
    // Rotate assembly along diagonal track angle
    motionRoot.rotation.y = Math.PI * 0.25;
    scene.add(motionRoot);

    // ── PROCEDURAL SLICES & TILES SETUP ──────────────────────────────────────
    const SLICES_PER_TRACK = 38;
    const SLICE_WIDTH = 0.82;
    const SLICE_LENGTH = 0.14;
    const SLICE_HEIGHT = 0.42;
    const SPACING = 0.18;
    const TRACK_SPACING = 1.15;
    const TRACK_TOTAL_LENGTH = SLICES_PER_TRACK * SPACING;

    const sliceGeo = new THREE.BoxGeometry(SLICE_WIDTH, SLICE_HEIGHT, SLICE_LENGTH);

    interface SliceData {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      trackIndex: number;
      sliceIndex: number;
    }

    const allSlices: SliceData[] = [];
    const sphereMeshes: THREE.Mesh[] = [];

    // Build 4 Tracks
    trackConfigs.forEach((cfg, tIdx) => {
      const trackX = (tIdx - 1.5) * TRACK_SPACING;

      const trackMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.38,
        metalness: 0.08,
      });

      // Domino Tiles
      for (let sIdx = 0; sIdx < SLICES_PER_TRACK; sIdx++) {
        const sliceMesh = new THREE.Mesh(sliceGeo, trackMat);
        const zPos = (sIdx - SLICES_PER_TRACK * 0.5) * SPACING;

        sliceMesh.position.set(trackX, 0, zPos);
        sliceMesh.castShadow = true;
        sliceMesh.receiveShadow = true;

        motionRoot.add(sliceMesh);
        allSlices.push({
          mesh: sliceMesh,
          baseX: trackX,
          baseY: 0,
          baseZ: zPos,
          trackIndex: tIdx,
          sliceIndex: sIdx,
        });
      }

      // Rolling Checkered Ball for this Track
      const sphereGeo = new THREE.SphereGeometry(0.34, 32, 32);
      const sphereMesh = new THREE.Mesh(sphereGeo, ballMaterial);
      sphereMesh.castShadow = true;
      sphereMesh.receiveShadow = true;
      motionRoot.add(sphereMesh);
      sphereMeshes.push(sphereMesh);
    });

    // ── STUDIO SHADOW CATCHER FLOOR ──────────────────────────────────────────
    const floorGeo = new THREE.PlaneGeometry(50, 50);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.28 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // ── MOUSE INTERACTION & ORBIT TILT ───────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetCamAngleX = 0;
    let targetCamAngleY = 0;
    let currentCamAngleX = 0;
    let currentCamAngleY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let baseCamRadius = 16.5;

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

      mouseX = (clientX / window.innerWidth) * 2 - 1;
      mouseY = -(clientY / window.innerHeight) * 2 + 1;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        targetCamAngleX += deltaX * 0.006;
        targetCamAngleY += deltaY * 0.004;
        targetCamAngleY = Math.max(-0.6, Math.min(0.6, targetCamAngleY));
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

    // ── KINETIC WAVE RENDER LOOP ─────────────────────────────────────────────
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Update camera smooth damping
      currentCamAngleX += (targetCamAngleX - currentCamAngleX) * 0.05;
      currentCamAngleY += (targetCamAngleY - currentCamAngleY) * 0.05;

      const camAngleBase = Math.PI * 0.28 + currentCamAngleX;
      const camElev = 9.2 + currentCamAngleY * 4.0;
      const camRad = baseCamRadius + (scrollProgress || 0) * 4.0;

      camera.position.x = Math.sin(camAngleBase) * camRad;
      camera.position.z = Math.cos(camAngleBase) * camRad;
      camera.position.y = camElev;
      camera.lookAt(0, 0, 0);

      // ── UPDATE DOMINO WAVE ANIMATION ──────────────────────────────────────
      const waveFreq = 0.28;
      const waveSpeed = 3.2;

      allSlices.forEach((slice) => {
        const track = trackConfigs[slice.trackIndex];
        // Mathematical wave phase
        const phase = elapsed * waveSpeed - slice.sliceIndex * waveFreq + track.offset;
        const wave = Math.sin(phase);
        const waveCos = Math.cos(phase);

        // Continuous twisting angle along length
        slice.mesh.rotation.z = wave * (Math.PI * 0.45);
        slice.mesh.rotation.x = waveCos * 0.15;
        // Height displacement
        slice.mesh.position.y = slice.baseY + Math.abs(wave) * 0.22;
      });

      // ── UPDATE ROLLING CHECKERED SPHERES ─────────────────────────────────
      sphereMeshes.forEach((ball, tIdx) => {
        const track = trackConfigs[tIdx];
        const trackX = (tIdx - 1.5) * TRACK_SPACING;

        // Position sphere along the length of the track in periodic motion
        const ballLoop = (elapsed * 0.45 + track.offset * 0.25) % 1.0;
        const ballZ = (ballLoop - 0.5) * (TRACK_TOTAL_LENGTH * 0.8);

        // Find wave height at current sphere position
        const sliceIdxEst = ((ballZ / SPACING) + SLICES_PER_TRACK * 0.5);
        const phase = elapsed * waveSpeed - sliceIdxEst * waveFreq + track.offset;
        const wave = Math.sin(phase);
        const ballY = 0.45 + Math.abs(wave) * 0.24;

        ball.position.set(trackX, ballY, ballZ);

        // Rolling spin physics
        ball.rotation.x += 0.08;
        ball.rotation.z = wave * 0.3;
      });

      renderer.render(scene, camera);
    };

    animate();

    // ── RESIZE HANDLER ───────────────────────────────────────────────────────
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
