'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface EngineCanvasProps {
  activeBall?: 'gold' | 'ruby' | 'cobalt' | 'emerald';
  activeCam?: 'piste' | 'quilles' | 'drone';
  isSlowMo?: boolean;
  isMuted?: boolean;
  triggerStrike?: number;
  onImpact?: () => void;
}

export const EngineCanvas: React.FC<EngineCanvasProps> = ({
  activeBall = 'gold',
  activeCam = 'piste',
  isSlowMo = false,
  isMuted = false,
  triggerStrike = 0,
  onImpact,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const ballMeshRef = useRef<THREE.Mesh | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastImpactTimeRef = useRef<number>(0);

  // Ball Material Presets
  const getBallMaterial = useCallback((colorType: string) => {
    switch (colorType) {
      case 'gold':
        return new THREE.MeshPhysicalMaterial({
          color: 0xe6b325,
          metalness: 0.88,
          roughness: 0.08,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          reflectivity: 1.0,
          envMapIntensity: 3.2,
        });
      case 'ruby':
        return new THREE.MeshPhysicalMaterial({
          color: 0xc61c09,
          metalness: 0.45,
          roughness: 0.06,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          reflectivity: 1.0,
          envMapIntensity: 2.8,
        });
      case 'cobalt':
        return new THREE.MeshPhysicalMaterial({
          color: 0x0088ff,
          metalness: 0.65,
          roughness: 0.07,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          reflectivity: 1.0,
          envMapIntensity: 3.0,
        });
      case 'emerald':
        return new THREE.MeshPhysicalMaterial({
          color: 0x10b981,
          metalness: 0.55,
          roughness: 0.08,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          reflectivity: 1.0,
          envMapIntensity: 2.8,
        });
      default:
        return new THREE.MeshPhysicalMaterial({
          color: 0xe6b325,
          metalness: 0.85,
          roughness: 0.08,
          clearcoat: 1.0,
        });
    }
  }, []);

  // Update Ball Material when activeBall changes
  useEffect(() => {
    if (ballMeshRef.current) {
      ballMeshRef.current.material = getBallMaterial(activeBall);
    }
  }, [activeBall, getBallMaterial]);

  // Restart / Trigger Strike animation
  useEffect(() => {
    if (actionRef.current) {
      actionRef.current.reset();
      actionRef.current.play();
    }
  }, [triggerStrike]);

  // Web Audio Sound Synthesizer (Realistic Bowling Roll & Strike Impact)
  const playImpactSound = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // 1. Initial Solid Wood Strike Thud (Low transient)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.35);
      oscGain.gain.setValueAtTime(0.7, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);

      // 2. High Frequency Pin Clatter / Wood Resonance (Pins crashing together)
      const bufferSize = Math.floor(ctx.sampleRate * 0.6);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1850, now);
      filter.Q.setValueAtTime(3.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.9, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isMuted]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // ── 1. SCENE & BACKGROUND ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0d14);
    scene.fog = new THREE.FogExp2(0x0a0d14, 0.025);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── 2. STUDIO HDR LIGHTING RIG ──────────────────────────────────────────
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x06080c);

    // Overhead Lane Light Strip
    const laneLight = new THREE.Mesh(
      new THREE.PlaneGeometry(4.0, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    laneLight.position.set(0, 9, 1);
    laneLight.rotation.x = Math.PI / 2;
    envScene.add(laneLight);

    // Warm Pin Deck Glow
    const pinGlow = new THREE.Mesh(
      new THREE.SphereGeometry(3.0, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffdfaa })
    );
    pinGlow.position.set(0, 5, 7.5);
    envScene.add(pinGlow);

    const envTex = pmremGen.fromScene(envScene, 0.04).texture;
    scene.environment = envTex;
    envScene.clear();

    // ── 3. DIRECT LIGHTS ────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xdde8ff, 1.2);
    scene.add(ambientLight);

    // Pin Deck Spotlight
    const pinDeckSpot = new THREE.SpotLight(0xffeedd, 8.5, 20, Math.PI / 3.2, 0.3, 1.2);
    pinDeckSpot.position.set(0, 6.0, 5.8);
    pinDeckSpot.target.position.set(0, 0.35, 7.3);
    pinDeckSpot.castShadow = true;
    pinDeckSpot.shadow.mapSize.width = 1024;
    pinDeckSpot.shadow.mapSize.height = 1024;
    pinDeckSpot.shadow.bias = -0.0001;
    scene.add(pinDeckSpot);
    scene.add(pinDeckSpot.target);

    // Warm Lane Keylight
    const laneKey = new THREE.DirectionalLight(0xffdfb8, 3.4);
    laneKey.position.set(4.5, 8.5, -2);
    laneKey.castShadow = true;
    scene.add(laneKey);

    // Cyan Neon Gutter Rim Light
    const neonRim = new THREE.DirectionalLight(0x00e5ff, 3.2);
    neonRim.position.set(-5.5, 3.5, 3.0);
    scene.add(neonRim);

    // ── 4. ENVIRONMENT DECOR (BOWLING LOUNGE ARCHITECTURE) ───────────────────
    const floorGeo = new THREE.PlaneGeometry(30, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090c12,
      roughness: 0.7,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.04;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Pin Deck Backboard Wall
    const backWallGeo = new THREE.BoxGeometry(7, 3.8, 0.3);
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x121722,
      roughness: 0.5,
      metalness: 0.5,
    });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 1.8, 9.2);
    scene.add(backWall);

    // Glowing Neon Sign Bar on Back Wall
    const neonBarGeo = new THREE.BoxGeometry(5.5, 0.08, 0.06);
    const neonBarMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const neonBar = new THREE.Mesh(neonBarGeo, neonBarMat);
    neonBar.position.set(0, 3.2, 9.02);
    scene.add(neonBar);

    // ── 5. IMPACT PARTICLES ─────────────────────────────────────────────────
    const sparkCount = 60;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel: THREE.Vector3[] = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = (Math.random() - 0.5) * 0.4;
      sparkPos[i * 3 + 1] = 0.25;
      sparkPos[i * 3 + 2] = 6.8;
      sparkVel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 4.2,
          Math.random() * 3.5 + 1.2,
          Math.random() * 3.8 + 1.0
        )
      );
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffcc33,
      size: 0.16,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const sparkParticles = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkParticles);

    // ── 6. LOAD GLB MODEL ───────────────────────────────────────────────────
    const loader = new GLTFLoader();
    let bowlingScene: THREE.Group | null = null;

    loader.load(
      '/models/bowling_strike.glb',
      (gltf) => {
        bowlingScene = gltf.scene;
        scene.add(bowlingScene);

        bowlingScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const nameL = mesh.name.toLowerCase();
            if (nameL.includes('ball')) {
              ballMeshRef.current = mesh;
              mesh.material = getBallMaterial(activeBall);
            } else if (nameL.includes('pin')) {
              // Master pin with red stripes
              if (Array.isArray(mesh.material)) {
                mesh.material[0] = new THREE.MeshPhysicalMaterial({
                  color: 0xfcfdfe,
                  roughness: 0.08,
                  metalness: 0.04,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.02,
                  envMapIntensity: 2.4,
                });
                mesh.material[1] = new THREE.MeshPhysicalMaterial({
                  color: 0xd91424,
                  roughness: 0.1,
                  metalness: 0.06,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.02,
                  envMapIntensity: 2.2,
                });
              } else {
                mesh.material = new THREE.MeshPhysicalMaterial({
                  color: 0xfcfdfe,
                  roughness: 0.08,
                  metalness: 0.04,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.02,
                  envMapIntensity: 2.4,
                });
              }
            } else if (nameL.includes('lane') || nameL.includes('parquet')) {
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0xb58253,
                roughness: 0.14,
                metalness: 0.06,
                clearcoat: 0.98,
                clearcoatRoughness: 0.02,
                envMapIntensity: 2.6,
              });
            } else if (nameL.includes('neon')) {
              mesh.material = new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
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
      (err) => console.error('Error loading bowling strike model:', err)
    );

    // ── 7. SMOOTH INTERACTIVE ORBIT DAMPING ──────────────────────────────────
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
        targetRotX = Math.max(-0.25, Math.min(0.35, targetRotX));
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

    // ── 8. ANIMATION LOOP & CAMERA TARGETS ───────────────────────────────────
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixerRef.current) {
        const playSpeed = isSlowMo ? 0.28 : 1.0;
        mixerRef.current.timeScale = playSpeed;
        mixerRef.current.update(delta);
      }

      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      // Dynamic Camera Presets
      if (activeCam === 'piste') {
        const camX = 2.4 + Math.sin(currentRotY) * 4.5;
        const camZ = -6.4 * Math.cos(currentRotY);
        const camY = 2.2 + currentRotX * 2.5;
        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, 0.45, 4.8);
      } else if (activeCam === 'quilles') {
        const camX = 1.2 + Math.sin(currentRotY) * 2.5;
        const camZ = 5.2 + Math.cos(currentRotY) * 1.5;
        const camY = 0.95 + currentRotX * 1.2;
        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, 0.4, 7.2);
      } else {
        const camX = 4.2 + Math.sin(currentRotY) * 4.0;
        const camZ = 0.5 + Math.cos(currentRotY) * 3.0;
        const camY = 5.8 + currentRotX * 2.0;
        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, 0.2, 3.5);
      }

      // Check for impact window to trigger sound & spark particles
      if (mixerRef.current && actionRef.current) {
        const clipDuration = actionRef.current.getClip().duration || 3.0;
        const animTime = actionRef.current.time % clipDuration;

        if (animTime >= 0.72 && animTime <= 1.15) {
          const t = (animTime - 0.72) / 0.43;
          sparkMat.opacity = Math.sin(t * Math.PI) * 0.95;

          const pArr = sparkGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < sparkCount; i++) {
            pArr[i * 3] = (Math.random() - 0.5) * 0.35 + sparkVel[i].x * t * 0.7;
            pArr[i * 3 + 1] = 0.25 + sparkVel[i].y * t * 0.7 - 0.5 * 9.8 * t * t * 0.08;
            pArr[i * 3 + 2] = 6.8 + sparkVel[i].z * t * 0.6;
          }
          sparkGeo.attributes.position.needsUpdate = true;

          const now = Date.now();
          if (now - lastImpactTimeRef.current > 1200) {
            lastImpactTimeRef.current = now;
            playImpactSound();
            if (onImpact) onImpact();
          }
        } else {
          sparkMat.opacity = 0;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // ── 9. RESIZE HANDLER ───────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeCam, activeBall, isSlowMo, getBallMaterial, playImpactSound, onImpact]);

  return (
    <div ref={mountRef} className="w-full h-full relative cursor-grab active:cursor-grabbing select-none" />
  );
};
