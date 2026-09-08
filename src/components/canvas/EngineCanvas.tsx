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
    scene.fog = new THREE.FogExp2(0x090706, 0.025);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // ── DIAMOND PRISM GROUP (BLENDER ASSET + SHADERS) ─────────────────────────
    const diamondGroup = new THREE.Group();
    diamondGroup.position.set(0, 1.1, 0);
    scene.add(diamondGroup);

    // Diamond Material (Refractive Luxury Crystal IOR: 2.417)
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xc61c09,
      emissiveIntensity: 0.18,
      roughness: 0.03,
      metalness: 0.1,
      transmission: 0.94,
      ior: 2.417,
      thickness: 1.2,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.95,
      reflectivity: 1.0,
    });

    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xff5a2d,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    let loadedDiamondMesh: THREE.Object3D | null = null;

    // Load Blender GLB Diamond Model
    const loader = new GLTFLoader();
    loader.load(
      '/models/diamond_lozenge.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.4, 1.4, 1.4);
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = diamondMat;

            // Add wireframe cage
            const wireClone = new THREE.Mesh(mesh.geometry, wireframeMat);
            wireClone.scale.set(1.002, 1.002, 1.002);
            model.add(wireClone);
          }
        });
        diamondGroup.add(model);
        loadedDiamondMesh = model;
      },
      undefined,
      (err) => {
        // Procedural Fallback Diamond if GLB path is delayed
        const fallbackGeo = new THREE.OctahedronGeometry(1.6, 2);
        const fallbackMesh = new THREE.Mesh(fallbackGeo, diamondMat);
        diamondGroup.add(fallbackMesh);
        loadedDiamondMesh = fallbackMesh;
      }
    );

    // ── ORBITAL HALO LIGHT RINGS ─────────────────────────────────────────────
    const haloGeo = new THREE.TorusGeometry(3.6, 0.02, 16, 100);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xc61c09, transparent: true, opacity: 0.4 });
    const halo1 = new THREE.Mesh(haloGeo, haloMat);
    halo1.rotation.x = Math.PI / 2.3;
    scene.add(halo1);

    const halo2 = new THREE.Mesh(haloGeo, haloMat);
    halo2.rotation.y = Math.PI / 3;
    halo2.rotation.x = Math.PI / 4;
    scene.add(halo2);

    // ── 4-PLATE SUSPENDED SPATIAL GLASS STACK ─────────────────────────────────
    const plateGeo = new THREE.BoxGeometry(3.6, 2.2, 0.05);
    const plates: THREE.Mesh[] = [];

    for (let i = 0; i < 4; i++) {
      const pMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#C61C09'),
        metalness: 0.1,
        roughness: 0.12,
        transmission: 0.8,
        thickness: 0.4,
        transparent: true,
        opacity: 0.75 - i * 0.14,
        reflectivity: 0.9,
      });

      const plate = new THREE.Mesh(plateGeo, pMat);
      plate.position.set((i - 1.5) * 0.4, (i - 1.5) * 0.25, (i - 1.5) * -0.7 - 2.5);
      plate.rotation.set(0.15, -0.2 + i * 0.08, 0.05);
      scene.add(plate);
      plates.push(plate);
    }

    // ── DIAMOND SPARKLE LIGHTS ───────────────────────────────────────────────
    const keySpot = new THREE.SpotLight(0xffffff, 25, 35, Math.PI / 3, 0.3);
    keySpot.position.set(5, 8, 8);
    scene.add(keySpot);

    const carminSpot = new THREE.SpotLight(0xc61c09, 30, 30, Math.PI / 3, 0.4);
    carminSpot.position.set(-6, -4, 6);
    scene.add(carminSpot);

    const ambientLight = new THREE.AmbientLight(0x221815, 2.5);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x38bdf8, 12, 18);
    cyanPoint.position.set(0, 4, -4);
    scene.add(cyanPoint);

    // Mouse Pointer Tracker
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 1.2;
    let targetCamZ = 8.5;

    const onPointerMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onPointerMove, { passive: true });

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Diamond Lozenge slow jewelry rotation
      if (diamondGroup) {
        diamondGroup.rotation.y = elapsed * 0.35 + mouseX * 0.3;
        diamondGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.15 - mouseY * 0.2;
        diamondGroup.position.y = 1.1 + Math.sin(elapsed * 0.8) * 0.08;
      }

      halo1.rotation.z = elapsed * 0.12;
      halo2.rotation.z = -elapsed * 0.09;

      plates.forEach((p, idx) => {
        p.position.y += Math.sin(elapsed * 0.8 + idx) * 0.0008;
      });

      // Camera Driver from Scroll & Navigation Mode
      if (navMode === 'journey') {
        const scrollZ = scrollProgress * 22;
        targetCamZ = 8.5 - scrollZ;
        targetCamX = mouseX * 0.45;
        targetCamY = 1.2 + mouseY * 0.35;
      } else {
        targetCamZ = 16 / (atlasPan.zoom || 1);
        targetCamX = atlasPan.x * 0.08 + mouseX * 0.6;
        targetCamY = -atlasPan.y * 0.08 + mouseY * 0.4;
      }

      camera.position.x += (targetCamX - camera.position.x) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.position.z += (targetCamZ - camera.position.z) * 0.06;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      haloGeo.dispose();
      plateGeo.dispose();
      diamondMat.dispose();
      wireframeMat.dispose();
      renderer.dispose();
    };
  }, [navMode, scrollProgress, atlasPan, activeProject]);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
};
