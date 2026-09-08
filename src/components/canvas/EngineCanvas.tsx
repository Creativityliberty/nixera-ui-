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
          color: 0xf5bf26,
          metalness: 0.92,
          roughness: 0.06,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          reflectivity: 1.0,
          envMapIntensity: 3.5,
        });
      case 'ruby':
        return new THREE.MeshPhysicalMaterial({
          color: 0xd61c09,
          metalness: 0.5,
          roughness: 0.05,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          reflectivity: 1.0,
          envMapIntensity: 3.0,
        });
      case 'cobalt':
        return new THREE.MeshPhysicalMaterial({
          color: 0x0099ff,
          metalness: 0.75,
          roughness: 0.06,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          reflectivity: 1.0,
          envMapIntensity: 3.2,
        });
      case 'emerald':
        return new THREE.MeshPhysicalMaterial({
          color: 0x059669,
          metalness: 0.65,
          roughness: 0.07,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          reflectivity: 1.0,
          envMapIntensity: 3.0,
        });
      default:
        return new THREE.MeshPhysicalMaterial({
          color: 0xf5bf26,
          metalness: 0.9,
          roughness: 0.06,
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

      // Heavy bowling ball impact
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.38);
      oscGain.gain.setValueAtTime(0.75, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);

      // Pins crashing (resonant wood burst)
      const bufferSize = Math.floor(ctx.sampleRate * 0.65);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.14));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1950, now);
      filter.Q.setValueAtTime(3.8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.95, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    } catch {
      // Audio autoplay fallback
    }
  }, [isMuted]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // ── 1. CINEMATIC FULLSCREEN SCENE ───────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080d);
    scene.fog = new THREE.FogExp2(0x06080d, 0.022);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.75;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── 2. RICH HDRI STUDIO ENVIRONMENT ─────────────────────────────────────
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x040609);

    // Overhead Lane Light Strip
    const laneLight = new THREE.Mesh(
      new THREE.PlaneGeometry(5.0, 26),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    laneLight.position.set(0, 10, 1);
    laneLight.rotation.x = Math.PI / 2;
    envScene.add(laneLight);

    // Warm Ambient Lounge Fill
    const loungeGlow = new THREE.Mesh(
      new THREE.SphereGeometry(6.0, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffd999 })
    );
    loungeGlow.position.set(0, 6, 7.5);
    envScene.add(loungeGlow);

    const envTex = pmremGen.fromScene(envScene, 0.04).texture;
    scene.environment = envTex;
    envScene.clear();

    // ── 3. DIRECT LIGHTS ────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xccd8f0, 1.4);
    scene.add(ambientLight);

    // Pin Deck Spotlight
    const pinDeckSpot = new THREE.SpotLight(0xfff1de, 9.5, 25, Math.PI / 3.0, 0.25, 1.2);
    pinDeckSpot.position.set(0, 7.0, 5.5);
    pinDeckSpot.target.position.set(0, 0.35, 7.2);
    pinDeckSpot.castShadow = true;
    pinDeckSpot.shadow.mapSize.width = 2048;
    pinDeckSpot.shadow.mapSize.height = 2048;
    pinDeckSpot.shadow.bias = -0.0001;
    scene.add(pinDeckSpot);
    scene.add(pinDeckSpot.target);

    // Warm Golden Keylight
    const goldenKey = new THREE.DirectionalLight(0xffe6ba, 3.8);
    goldenKey.position.set(6, 9.5, -2);
    goldenKey.castShadow = true;
    scene.add(goldenKey);

    // Cyan Neon Gutter Rim Light
    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 3.6);
    cyanRim.position.set(-6, 4.0, 3.0);
    scene.add(cyanRim);

    // Deep Red Fill for luxury contrast
    const redFill = new THREE.PointLight(0xff2200, 2.5, 15);
    redFill.position.set(0, 1.5, 8.5);
    scene.add(redFill);

    // ── 4. EXTENDED LUXURY BOWLING ENVIRONMENT ──────────────────────────────
    // Wide Surrounding Parquet Floor
    const floorGeo = new THREE.PlaneGeometry(50, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x070a10,
      roughness: 0.65,
      metalness: 0.25,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.04;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Pin Deck Back Wall
    const backWallGeo = new THREE.BoxGeometry(12, 5.0, 0.4);
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x0e131d,
      roughness: 0.4,
      metalness: 0.6,
    });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 2.4, 9.6);
    scene.add(backWall);

    // Glowing Cyan & Gold Neon Signs
    const neonBar1 = new THREE.Mesh(
      new THREE.BoxGeometry(8.5, 0.08, 0.06),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    neonBar1.position.set(0, 4.4, 9.38);
    scene.add(neonBar1);

    const neonBar2 = new THREE.Mesh(
      new THREE.BoxGeometry(5.5, 0.06, 0.06),
      new THREE.MeshBasicMaterial({ color: 0xffcc33 })
    );
    neonBar2.position.set(0, 4.1, 9.38);
    scene.add(neonBar2);

    // ── 5. SPARK BURST PARTICLES ────────────────────────────────────────────
    const sparkCount = 80;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel: THREE.Vector3[] = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = (Math.random() - 0.5) * 0.45;
      sparkPos[i * 3 + 1] = 0.3;
      sparkPos[i * 3 + 2] = 6.8;
      sparkVel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 4.8,
          Math.random() * 4.2 + 1.2,
          Math.random() * 4.5 + 1.0
        )
      );
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.18,
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
              if (Array.isArray(mesh.material)) {
                mesh.material[0] = new THREE.MeshPhysicalMaterial({
                  color: 0xffffff,
                  roughness: 0.05,
                  metalness: 0.02,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.02,
                  envMapIntensity: 2.8,
                });
                mesh.material[1] = new THREE.MeshPhysicalMaterial({
                  color: 0xdd1122,
                  roughness: 0.08,
                  metalness: 0.04,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.02,
                  envMapIntensity: 2.5,
                });
              } else {
                mesh.material = new THREE.MeshPhysicalMaterial({
                  color: 0xffffff,
                  roughness: 0.05,
                  metalness: 0.02,
                  clearcoat: 1.0,
                  clearcoatRoughness: 0.02,
                  envMapIntensity: 2.8,
                });
              }
            } else if (nameL.includes('lane') || nameL.includes('parquet')) {
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0xbe8b5a,
                roughness: 0.12,
                metalness: 0.08,
                clearcoat: 1.0,
                clearcoatRoughness: 0.02,
                envMapIntensity: 3.2,
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
        dragRotX = Math.max(-0.2, Math.min(0.3, dragRotX));
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

    // ── 8. ANIMATION & CAMERA SYSTEM ────────────────────────────────────────
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

      // Smooth mouse parallax interpolation
      targetCamX += (mouseX * 0.8 + dragRotY * 3.0 - targetCamX) * 0.05;
      targetCamY += (-mouseY * 0.4 + dragRotX * 2.0 - targetCamY) * 0.05;

      if (activeCam === 'piste') {
        // Grand Bowler View down the whole illuminated runway
        camera.position.set(targetCamX, 1.85 + targetCamY, -7.2);
        camera.lookAt(0, 0.45, 5.0);
      } else if (activeCam === 'quilles') {
        // Dramatic Slow-Mo Pin Deck Impact View
        camera.position.set(1.4 + targetCamX * 0.5, 0.95 + targetCamY * 0.4, 5.2);
        camera.lookAt(0, 0.4, 7.3);
      } else {
        // VIP Drone Overhead View
        camera.position.set(3.8 + targetCamX, 5.5 + targetCamY, 0.2);
        camera.lookAt(0, 0.2, 3.8);
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
            pArr[i * 3] = (Math.random() - 0.5) * 0.35 + sparkVel[i].x * t * 0.7;
            pArr[i * 3 + 1] = 0.3 + sparkVel[i].y * t * 0.7 - 0.5 * 9.8 * t * t * 0.08;
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
