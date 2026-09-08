'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090706, 0.035);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.1, 7.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── AUTOMOTIVE STUDIO LIGHTING ───────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xff6030, 2.0);
    fillLight.position.set(-6, 4, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x4080ff, 2.5);
    rimLight.position.set(0, 6, -6);
    scene.add(rimLight);

    const groundGlow = new THREE.PointLight(0xc61c09, 3.0, 10, 1.5);
    groundGlow.position.set(0, -0.2, 0);
    scene.add(groundGlow);

    // ── STUDIO FLOOR MIRROR & GROUND GRID ────────────────────────────────────
    const gridHelper = new THREE.GridHelper(24, 40, 0xc61c09, 0x1f1917);
    gridHelper.position.y = -0.7;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    scene.add(gridHelper);

    // ── CAR ROOT ASSEMBLY ───────────────────────────────────────────────────
    const carRoot = new THREE.Group();
    carRoot.position.set(0, -0.2, 0);
    scene.add(carRoot);

    // ── LOAD RED SPORTS CAR GLB ──────────────────────────────────────────────
    const loader = new GLTFLoader();
    let carModel: THREE.Group | null = null;

    loader.load(
      '/models/red_sports_car.glb',
      (gltf) => {
        carModel = gltf.scene;
        
        // Auto-center and normalize scale
        const box = new THREE.Box3().setFromObject(carModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 3.6 / (maxDim || 1);

        carModel.scale.set(targetScale, targetScale, targetScale);
        carModel.position.sub(center.multiplyScalar(targetScale));
        carModel.position.y += 0.3;

        carModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // Enhance materials with luxury PBR finish
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat.name.toLowerCase().includes('red') || mat.name.toLowerCase().includes('body')) {
                mat.roughness = 0.15;
                mat.metalness = 0.85;
                mat.envMapIntensity = 2.0;
              }
            }
          }
        });

        carRoot.add(carModel);
      },
      undefined,
      (err) => {
        console.error('Failed to load red sports car:', err);
      }
    );

    // ── INTERACTIVE MOUSE / GYROSCOPE CONTROLS ───────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.15;
    let targetRotY = -0.55;
    let currentRotX = 0.15;
    let currentRotY = -0.55;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

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
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.005;
        targetRotX = Math.max(-0.4, Math.min(0.6, targetRotX));
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

    // ── ANIMATION RENDER LOOP ────────────────────────────────────────────────
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth damping interpolation
      if (!isDragging) {
        targetRotY += 0.0035; // Gentle turntable idle spin
      }
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      carRoot.rotation.y = currentRotY;
      carRoot.rotation.x = currentRotX + Math.sin(elapsed * 1.5) * 0.02;

      // Gentle floating suspension breathing motion
      carRoot.position.y = -0.2 + Math.sin(elapsed * 2.0) * 0.03;

      // Key light subtle dynamic orbit
      keyLight.position.x = 5 + Math.sin(elapsed * 0.8) * 2.0;
      groundGlow.intensity = 2.5 + Math.sin(elapsed * 3.0) * 1.0;

      // Scroll response
      const scrollOffset = scrollProgress || 0;
      camera.position.z = 7.2 + scrollOffset * 3.5;
      camera.position.y = 1.1 + scrollOffset * 0.5;

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

  return <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing z-0" />;
};
