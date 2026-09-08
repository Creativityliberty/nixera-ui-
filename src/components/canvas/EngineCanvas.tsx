'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCcw, Zap } from 'lucide-react';

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
  const [isSlowMo, setIsSlowMo] = useState(false);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // ── 1. SCENE & DRAMATIC 3/4 PERSPECTIVE CAMERA ───────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0e12);
    scene.fog = new THREE.FogExp2(0x0c0e12, 0.03);

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    // Positioned behind the release point looking down the lane at the pin deck
    camera.position.set(2.8, 2.4, -6.8);
    camera.lookAt(0, 0.35, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.65;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── 2. STUDIO HDR ENVMAP GENERATION ──────────────────────────────────────
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x0a0c10);

    // Lane Light Strip
    const laneLight = new THREE.Mesh(
      new THREE.PlaneGeometry(3.5, 20),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    laneLight.position.set(0, 9, 2);
    laneLight.rotation.x = Math.PI / 2;
    envScene.add(laneLight);

    // Pin Deck Spotlight
    const pinGlow = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffeedd })
    );
    pinGlow.position.set(0, 5, 7.5);
    envScene.add(pinGlow);

    const envTex = pmremGen.fromScene(envScene, 0.04).texture;
    scene.environment = envTex;
    envScene.clear();

    // ── 3. THREE-POINT LIGHTING SETUP ────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const pinDeckSpot = new THREE.SpotLight(0xfff8ee, 7.0, 18, Math.PI / 3.5, 0.25, 1.2);
    pinDeckSpot.position.set(0, 5.5, 6.0);
    pinDeckSpot.target.position.set(0, 0.3, 7.2);
    pinDeckSpot.castShadow = true;
    pinDeckSpot.shadow.mapSize.width = 1024;
    pinDeckSpot.shadow.mapSize.height = 1024;
    pinDeckSpot.shadow.bias = -0.0001;
    scene.add(pinDeckSpot);
    scene.add(pinDeckSpot.target);

    const laneKey = new THREE.DirectionalLight(0xffeedd, 3.2);
    laneKey.position.set(5, 9, -2);
    laneKey.castShadow = true;
    scene.add(laneKey);

    const neonRim = new THREE.DirectionalLight(0x00d4ff, 3.5);
    neonRim.position.set(-6, 3, 3);
    scene.add(neonRim);

    // ── 4. IMPACT SPARKS / DUST PARTICLES ────────────────────────────────────
    const sparkCount = 40;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel: THREE.Vector3[] = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = (Math.random() - 0.5) * 0.3;
      sparkPos[i * 3 + 1] = 0.25;
      sparkPos[i * 3 + 2] = 6.8;
      sparkVel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 3.5,
          Math.random() * 3.0 + 0.8,
          Math.random() * 3.2 + 0.8
        )
      );
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffaa33,
      size: 0.14,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const sparkParticles = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkParticles);

    // ── 5. LOAD ANIMATED BOWLING STRIKE GLB ──────────────────────────────────
    const loader = new GLTFLoader();
    let bowlingScene: THREE.Group | null = null;

    loader.load(
      '/models/bowling_strike.glb',
      (gltf) => {
        bowlingScene = gltf.scene;
        scene.add(bowlingScene);

        // Apply Luxury Materials
        bowlingScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const nameL = mesh.name.toLowerCase();
            if (nameL.includes('ball')) {
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0xc61c09,
                roughness: 0.05,
                metalness: 0.45,
                clearcoat: 1.0,
                clearcoatRoughness: 0.02,
                reflectivity: 1.0,
                envMapIntensity: 2.5,
              });
            } else if (nameL.includes('pin')) {
              // Master pin with red stripes
              if (Array.isArray(mesh.material)) {
                mesh.material[0] = new THREE.MeshPhysicalMaterial({
                  color: 0xfafbfc,
                  roughness: 0.1,
                  metalness: 0.04,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.02,
                  envMapIntensity: 2.2,
                });
                mesh.material[1] = new THREE.MeshPhysicalMaterial({
                  color: 0xd91424,
                  roughness: 0.12,
                  metalness: 0.05,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.03,
                  envMapIntensity: 2.0,
                });
              } else {
                mesh.material = new THREE.MeshPhysicalMaterial({
                  color: 0xfafbfc,
                  roughness: 0.1,
                  metalness: 0.04,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.02,
                  envMapIntensity: 2.2,
                });
              }
            } else if (nameL.includes('lane') || nameL.includes('parquet')) {
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0xa87c52,
                roughness: 0.16,
                metalness: 0.06,
                clearcoat: 0.95,
                clearcoatRoughness: 0.03,
                envMapIntensity: 2.4,
              });
            } else if (nameL.includes('neon')) {
              mesh.material = new THREE.MeshBasicMaterial({
                color: 0x00e1ff,
              });
            }
          }
        });

        // Initialize Animation
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(bowlingScene);
          mixerRef.current = mixer;

          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();
            actionRef.current = action;
          });
        }
      },
      undefined,
      (err) => console.error('Error loading bowling strike:', err)
    );

    // ── 6. SMOOTH ORBIT CONTROLS ────────────────────────────────────────────
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = cx;
      prevMouseY = cy;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = cx - prevMouseX;
        const deltaY = cy - prevMouseY;
        targetRotY += deltaX * 0.005;
        targetRotX += deltaY * 0.003;
        targetRotX = Math.max(-0.35, Math.min(0.4, targetRotX));
        prevMouseX = cx;
        prevMouseY = cy;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // ── 7. RENDER & CINEMATIC CAMERA DYNAMICS ────────────────────────────────
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixerRef.current) {
        const playSpeed = isSlowMo ? 0.32 : 1.0;
        mixerRef.current.timeScale = playSpeed;
        mixerRef.current.update(delta);
      }

      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      // Camera Position & Smooth Damping
      const camX = 2.8 + Math.sin(currentRotY) * 5.5;
      const camZ = -6.8 * Math.cos(currentRotY);
      const camY = 2.4 + currentRotX * 3.0;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0.4, 4.5);

      // Trigger spark particles right at impact (~frame 23 -> ~0.76s in animation)
      if (mixerRef.current && actionRef.current) {
        const clipDuration = actionRef.current.getClip().duration || 3.0;
        const animTime = actionRef.current.time % clipDuration;

        // Impact window: 0.74s to 1.1s
        if (animTime > 0.72 && animTime < 1.15) {
          sparkMat.opacity = Math.min(1.0, sparkMat.opacity + 0.2);
          const pArr = sparkGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < sparkCount; i++) {
            pArr[i * 3] += sparkVel[i].x * delta * 2.2;
            pArr[i * 3 + 1] += sparkVel[i].y * delta * 2.2;
            pArr[i * 3 + 2] += sparkVel[i].z * delta * 2.2;
          }
          sparkGeo.attributes.position.needsUpdate = true;
        } else {
          sparkMat.opacity = Math.max(0.0, sparkMat.opacity - 0.08);
          if (sparkMat.opacity <= 0) {
            const pArr = sparkGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < sparkCount; i++) {
              pArr[i * 3] = (Math.random() - 0.5) * 0.3;
              pArr[i * 3 + 1] = 0.25;
              pArr[i * 3 + 2] = 6.8;
            }
            sparkGeo.attributes.position.needsUpdate = true;
          }
        }
      }

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
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      pmremGen.dispose();
      envTex.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [scrollProgress, isSlowMo]);

  const handleRestart = () => {
    if (actionRef.current) {
      actionRef.current.reset();
      actionRef.current.play();
    }
  };

  const toggleSlowMo = () => {
    setIsSlowMo((prev) => !prev);
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing z-0"
      />

      {/* Floating Interactive Controls HUD */}
      <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={handleRestart}
          className="px-3 py-1.5 rounded-xl bg-[#140f0c]/90 hover:bg-[#C61C09] border border-[#2e2724] text-[#f5efe9] text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-xl backdrop-blur-md cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>REPLAY STRIKE</span>
        </button>
        <button
          onClick={toggleSlowMo}
          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-xl backdrop-blur-md cursor-pointer ${
            isSlowMo
              ? 'bg-[#00d4ff] text-[#0c0e12] border-[#00d4ff]'
              : 'bg-[#140f0c]/90 text-[#a89f91] hover:text-[#f5efe9] border-[#2e2724]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isSlowMo ? 'SLOW-MO ON (0.32x)' : 'SLOW-MO'}</span>
        </button>
      </div>
    </div>
  );
};
