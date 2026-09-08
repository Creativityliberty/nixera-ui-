'use client';

import React, { useEffect, useRef, useCallback } from 'react';
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
          color: 0xfcc21b,
          metalness: 0.95,
          roughness: 0.04,
          clearcoat: 1.0,
          clearcoatRoughness: 0.01,
          reflectivity: 1.0,
          envMapIntensity: 4.0,
        });
      case 'ruby':
        return new THREE.MeshPhysicalMaterial({
          color: 0xe61010,
          metalness: 0.55,
          roughness: 0.04,
          clearcoat: 1.0,
          clearcoatRoughness: 0.01,
          reflectivity: 1.0,
          envMapIntensity: 3.5,
        });
      case 'cobalt':
        return new THREE.MeshPhysicalMaterial({
          color: 0x0090ff,
          metalness: 0.8,
          roughness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.01,
          reflectivity: 1.0,
          envMapIntensity: 3.8,
        });
      case 'emerald':
        return new THREE.MeshPhysicalMaterial({
          color: 0x10b981,
          metalness: 0.7,
          roughness: 0.06,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          reflectivity: 1.0,
          envMapIntensity: 3.5,
        });
      default:
        return new THREE.MeshPhysicalMaterial({
          color: 0xfcc21b,
          metalness: 0.95,
          roughness: 0.04,
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

  // Web Audio Synthesizer
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

      // Heavy ball strike thump
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(170, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
      oscGain.gain.setValueAtTime(0.85, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);

      // Pins crashing sound (wood resonance burst)
      const bufferSize = Math.floor(ctx.sampleRate * 0.7);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2100, now);
      filter.Q.setValueAtTime(4.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(1.0, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

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

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // ── 1. CINEMATIC SCENE ──────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090f);
    scene.fog = new THREE.FogExp2(0x07090f, 0.02);

    // FOV 34 for high-impact cinematic compression
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── 2. STUDIO LIGHTING RIG ──────────────────────────────────────────────
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x05070a);

    // Overhead Light Strip
    const laneLight = new THREE.Mesh(
      new THREE.PlaneGeometry(6.0, 28),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    laneLight.position.set(0, 11, 2);
    laneLight.rotation.x = Math.PI / 2;
    envScene.add(laneLight);

    // High Brightness Pin Deck Halo
    const pinHalo = new THREE.Mesh(
      new THREE.SphereGeometry(7.0, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfff0d0 })
    );
    pinHalo.position.set(0, 6, 7.0);
    envScene.add(pinHalo);

    const envTex = pmremGen.fromScene(envScene, 0.04).texture;
    scene.environment = envTex;
    envScene.clear();

    // ── 3. INTENSE DIRECT LIGHTS ON PINS ────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xdde8ff, 1.6);
    scene.add(ambientLight);

    // 🌟 SUPER BRIGHT PIN DECK SPOTLIGHT (Focuses straight onto the 10 pins!)
    const pinSpot = new THREE.SpotLight(0xfff8ee, 18.0, 30, Math.PI / 2.8, 0.2, 1.0);
    pinSpot.position.set(0, 5.8, 6.2);
    pinSpot.target.position.set(0, 0.35, 6.8);
    pinSpot.castShadow = true;
    pinSpot.shadow.mapSize.width = 2048;
    pinSpot.shadow.mapSize.height = 2048;
    pinSpot.shadow.bias = -0.0001;
    scene.add(pinSpot);
    scene.add(pinSpot.target);

    // Front Fill Spotlight for Pin Faces (ensures pins are dazzling bright)
    const pinFrontLight = new THREE.DirectionalLight(0xffeedd, 5.0);
    pinFrontLight.position.set(1.5, 3.5, 2.0);
    pinFrontLight.castShadow = true;
    scene.add(pinFrontLight);

    // Cyan Neon Gutter Rim
    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 4.5);
    cyanRim.position.set(-5.5, 3.5, 5.0);
    scene.add(cyanRim);

    // Gold Rim Light from opposite side
    const goldRim = new THREE.DirectionalLight(0xffcc33, 4.0);
    goldRim.position.set(5.5, 3.5, 5.0);
    scene.add(goldRim);

    // ── 4. SURROUNDINGS & BACKDROP ──────────────────────────────────────────
    const floorGeo = new THREE.PlaneGeometry(60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      roughness: 0.6,
      metalness: 0.3,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.04;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Pin Deck Back Wall with Glowing Sign
    const backWallGeo = new THREE.BoxGeometry(14, 6.0, 0.4);
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.4,
      metalness: 0.5,
    });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 2.8, 9.8);
    scene.add(backWall);

    // Neon Accent Bar
    const neonBar = new THREE.Mesh(
      new THREE.BoxGeometry(10.0, 0.12, 0.08),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    neonBar.position.set(0, 4.8, 9.58);
    scene.add(neonBar);

    // ── 5. SPARK EXPLOSION PARTICLES ────────────────────────────────────────
    const sparkCount = 100;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel: THREE.Vector3[] = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = (Math.random() - 0.5) * 0.4;
      sparkPos[i * 3 + 1] = 0.35;
      sparkPos[i * 3 + 2] = 6.6;
      sparkVel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 5.5,
          Math.random() * 4.8 + 1.5,
          Math.random() * 5.0 + 1.2
        )
      );
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.22,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const sparkParticles = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkParticles);

    // ── 6. LOAD GLB MODEL & ENHANCE PINS ────────────────────────────────────
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
              // High-gloss ultra-bright white with vivid scarlet stripes
              if (Array.isArray(mesh.material)) {
                mesh.material[0] = new THREE.MeshPhysicalMaterial({
                  color: 0xffffff,
                  roughness: 0.04,
                  metalness: 0.02,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.01,
                  reflectivity: 1.0,
                  envMapIntensity: 3.2,
                });
                mesh.material[1] = new THREE.MeshPhysicalMaterial({
                  color: 0xee0011,
                  roughness: 0.06,
                  metalness: 0.03,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.01,
                  reflectivity: 1.0,
                  envMapIntensity: 3.0,
                });
              } else {
                mesh.material = new THREE.MeshPhysicalMaterial({
                  color: 0xffffff,
                  roughness: 0.04,
                  metalness: 0.02,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.01,
                  reflectivity: 1.0,
                  envMapIntensity: 3.2,
                });
              }
            } else if (nameL.includes('lane') || nameL.includes('parquet')) {
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0xc89360,
                roughness: 0.09,
                metalness: 0.08,
                clearcoat: 1.0,
                clearcoatRoughness: 0.02,
                envMapIntensity: 3.5,
              });
            } else if (nameL.includes('neon')) {
              mesh.material = new THREE.MeshBasicMaterial({
                color: 0x00f0ff,
              });
            }
          }
        });

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

    // ── 7. MOUSE PARALLAX & ORBIT ───────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 0;
    let isDragging = false;
    let dragRotY = 0;
    let dragRotX = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        dragRotY += deltaX * 0.005;
        dragRotX += deltaY * 0.003;
        dragRotX = Math.max(-0.25, Math.min(0.35, dragRotX));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // ── 8. ANIMATION LOOP & PROXIMITY CAMERA FRAMING ─────────────────────────
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixerRef.current) {
        const playSpeed = isSlowMo ? 0.25 : 1.0;
        mixerRef.current.timeScale = playSpeed;
        mixerRef.current.update(delta);
      }

      targetCamX += (mouseX * 0.6 + dragRotY * 2.5 - targetCamX) * 0.06;
      targetCamY += (-mouseY * 0.3 + dragRotX * 1.8 - targetCamY) * 0.06;

      // 🎥 CLOSE-UP & BROADCAST-STYLE CAMERA PRESETS
      if (activeCam === 'piste') {
        // ✨ PROXIMITY 3/4 BROADCAST VIEW : Pins are LARGE and front-and-center!
        // Camera at z = 1.6 looking at z = 6.6 (distance is only 5 units!)
        const posX = 1.35 + targetCamX * 0.8;
        const posY = 1.25 + targetCamY * 0.5;
        const posZ = 1.2;
        camera.position.set(posX, posY, posZ);
        camera.lookAt(0, 0.42, 6.7);
      } else if (activeCam === 'quilles') {
        // 🎯 FRONT POCKET CLOSE-UP (Direct face-to-face with Headpin #1)
        const posX = 0.5 + targetCamX * 0.5;
        const posY = 0.85 + targetCamY * 0.4;
        const posZ = 4.6;
        camera.position.set(posX, posY, posZ);
        camera.lookAt(0, 0.38, 6.8);
      } else {
        // 🚁 DRONE OVERHEAD (Looking down dynamically at the collision zone)
        const posX = 2.6 + targetCamX;
        const posY = 4.2 + targetCamY;
        const posZ = 3.6;
        camera.position.set(posX, posY, posZ);
        camera.lookAt(0, 0.25, 6.6);
      }

      // Trigger spark particles & sound on impact
      if (mixerRef.current && actionRef.current) {
        const clipDuration = actionRef.current.getClip().duration || 3.0;
        const animTime = actionRef.current.time % clipDuration;

        if (animTime >= 0.72 && animTime <= 1.15) {
          const t = (animTime - 0.72) / 0.43;
          sparkMat.opacity = Math.sin(t * Math.PI) * 0.95;

          const pArr = sparkGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < sparkCount; i++) {
            pArr[i * 3] = (Math.random() - 0.5) * 0.4 + sparkVel[i].x * t * 0.7;
            pArr[i * 3 + 1] = 0.35 + sparkVel[i].y * t * 0.7 - 0.5 * 9.8 * t * t * 0.08;
            pArr[i * 3 + 2] = 6.6 + sparkVel[i].z * t * 0.6;
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

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [activeCam, activeBall, isSlowMo, getBallMaterial, playImpactSound, onImpact]);

  return (
    <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing" />
  );
};
