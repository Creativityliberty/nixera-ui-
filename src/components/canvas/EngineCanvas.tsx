'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Play, RotateCcw, Zap, Eye } from 'lucide-react';

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
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSlowMo, setIsSlowMo] = useState(false);
  const [strikeScore, setStrikeScore] = useState<string>('PERFECT STRIKE • 300');
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // ── 1. SCENE & DYNAMIC CAMERA ───────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0b0e);
    scene.fog = new THREE.FogExp2(0x0a0b0e, 0.035);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.8, -7.5);
    camera.lookAt(0, 0.4, 4.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.7;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── 2. STUDIO HDR LIGHTING ──────────────────────────────────────────────
    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x0f1115);

    // Overhead Light Strip along Bowling Lane
    const laneLightGeo = new THREE.PlaneGeometry(3, 18);
    const laneLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const laneLightMesh = new THREE.Mesh(laneLightGeo, laneLightMat);
    laneLightMesh.position.set(0, 8, 2);
    laneLightMesh.rotation.x = Math.PI / 2;
    envScene.add(laneLightMesh);

    // Pin Spot Light
    const pinGlow = new THREE.Mesh(
      new THREE.SphereGeometry(2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffe8d0 })
    );
    pinGlow.position.set(0, 5, 8);
    envScene.add(pinGlow);

    const envTex = pmremGen.fromScene(envScene, 0.04).texture;
    scene.environment = envTex;
    envScene.clear();

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pinSpot = new THREE.SpotLight(0xfffaee, 6.0, 15, Math.PI / 4, 0.3, 1.5);
    pinSpot.position.set(0, 5, 6.5);
    pinSpot.target.position.set(0, 0.3, 7.8);
    pinSpot.castShadow = true;
    pinSpot.shadow.mapSize.width = 1024;
    pinSpot.shadow.mapSize.height = 1024;
    scene.add(pinSpot);
    scene.add(pinSpot.target);

    const laneKey = new THREE.DirectionalLight(0xfff0dd, 2.5);
    laneKey.position.set(4, 8, -2);
    laneKey.castShadow = true;
    scene.add(laneKey);

    const cyanRim = new THREE.DirectionalLight(0x00d4ff, 3.0);
    cyanRim.position.set(-5, 3, 4);
    scene.add(cyanRim);

    // ── 3. IMPACT PARTICLE SPARKS ───────────────────────────────────────────
    const sparkCount = 35;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    const sparkVel: THREE.Vector3[] = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = 0;
      sparkPos[i * 3 + 1] = 0.3;
      sparkPos[i * 3 + 2] = 7.5;
      sparkVel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 4.0,
          Math.random() * 3.5 + 1.0,
          Math.random() * 3.0 + 1.0
        )
      );
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffbb44,
      size: 0.12,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const sparkParticles = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkParticles);

    // ── 4. LOAD ANIMATED BOWLING STRIKE GLB ──────────────────────────────────
    const loader = new GLTFLoader();
    let bowlingScene: THREE.Group | null = null;
    let ballObject: THREE.Object3D | null = null;

    loader.load(
      '/models/bowling_strike.glb',
      (gltf) => {
        bowlingScene = gltf.scene;
        scene.add(bowlingScene);

        // Enhance materials with PBR Clearcoat Shaders
        bowlingScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.name.toLowerCase().includes('ball')) {
              ballObject = mesh;
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0xc61c09,
                roughness: 0.06,
                metalness: 0.4,
                clearcoat: 1.0,
                clearcoatRoughness: 0.02,
                reflectivity: 1.0,
                envMapIntensity: 2.5,
              });
            } else if (mesh.name.toLowerCase().includes('pin')) {
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0xfcfcfd,
                roughness: 0.12,
                metalness: 0.05,
                clearcoat: 1.0,
                clearcoatRoughness: 0.03,
                envMapIntensity: 2.0,
              });
            } else if (mesh.name.toLowerCase().includes('lane') || mesh.name.toLowerCase().includes('parquet')) {
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0x9e734b,
                roughness: 0.18,
                metalness: 0.08,
                clearcoat: 0.95,
                clearcoatRoughness: 0.04,
                envMapIntensity: 2.2,
              });
            }
          }
        });

        // Setup Animation Mixer
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

    // ── 5. MOUSE INTERACTION & ORBIT TILT ───────────────────────────────────
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
        targetRotX = Math.max(-0.35, Math.min(0.45, targetRotX));
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

    // ── 6. RENDER & CINEMATIC TRACKING LOOP ─────────────────────────────────
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Update Animation Mixer with Slow-Mo scaling
      if (mixerRef.current) {
        const playSpeed = isSlowMo ? 0.35 : 1.0;
        mixerRef.current.timeScale = playSpeed;
        mixerRef.current.update(delta);
      }

      // Smooth camera orbit damping
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      const baseCamZ = -7.5 + (scrollProgress || 0) * 2.5;
      camera.position.x = Math.sin(currentRotY) * 6.5 + currentRotY * 1.5;
      camera.position.z = Math.cos(currentRotY) * baseCamZ;
      camera.position.y = 1.8 + currentRotX * 3.5;
      camera.lookAt(0, 0.4, 4.0);

      // Impact spark trigger at impact time (~1.1s in animation)
      if (mixerRef.current && actionRef.current) {
        const animTime = actionRef.current.time % actionRef.current.getClip().duration;
        if (animTime > 1.05 && animTime < 1.45) {
          sparkMat.opacity = Math.min(1.0, sparkMat.opacity + 0.15);
          const pArr = sparkGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < sparkCount; i++) {
            pArr[i * 3] += sparkVel[i].x * delta * 2.0;
            pArr[i * 3 + 1] += sparkVel[i].y * delta * 2.0;
            pArr[i * 3 + 2] += sparkVel[i].z * delta * 2.0;
          }
          sparkGeo.attributes.position.needsUpdate = true;
        } else {
          sparkMat.opacity = Math.max(0.0, sparkMat.opacity - 0.08);
          if (sparkMat.opacity <= 0) {
            // Reset sparks
            const pArr = sparkGeo.attributes.position.array as Float32Array;
            for (let i = 0; i < sparkCount; i++) {
              pArr[i * 3] = (Math.random() - 0.5) * 0.4;
              pArr[i * 3 + 1] = 0.25;
              pArr[i * 3 + 2] = 7.5;
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
              ? 'bg-[#dda236] text-[#0c0d10] border-[#dda236]'
              : 'bg-[#140f0c]/90 text-[#a89f91] hover:text-[#f5efe9] border-[#2e2724]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isSlowMo ? 'SLOW-MO ON (0.35x)' : 'SLOW-MO'}</span>
        </button>
      </div>
    </div>
  );
};
