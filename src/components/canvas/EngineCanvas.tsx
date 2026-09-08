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
    scene.fog = new THREE.FogExp2(0x090706, 0.02);

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
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // ── LUXURY DIAMOND REFRACTIVE MATERIAL (IOR: 2.417) ──────────────────────
    const diamondMat1 = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xc61c09,
      emissiveIntensity: 0.15,
      roughness: 0.02,
      metalness: 0.05,
      transmission: 0.95,
      ior: 2.417,
      thickness: 1.4,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.95,
      reflectivity: 1.0,
    });

    const diamondMat2 = diamondMat1.clone();
    diamondMat2.emissive = new THREE.Color(0xff4422);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff5a2d,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    // ── DUAL DIAMOND GROUPS ──────────────────────────────────────────────────
    const diamond1 = new THREE.Group();
    const diamond2 = new THREE.Group();
    diamond1.position.set(-1.8, 1.2, 0);
    diamond2.position.set(1.8, 1.2, 0);
    scene.add(diamond1);
    scene.add(diamond2);

    // ── CORONAL LIGHT BURST (CENTER PLASMA SPARK) ───────────────────────────
    const burstGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const burstMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const burstMesh = new THREE.Mesh(burstGeo, burstMat);
    burstMesh.position.set(0, 1.2, 0);
    scene.add(burstMesh);

    // Central Light Explosion Point
    const burstLight = new THREE.PointLight(0xffffff, 0, 15, 2);
    burstLight.position.set(0, 1.2, 0);
    scene.add(burstLight);

    const redGlowLight = new THREE.PointLight(0xc61c09, 0, 18, 1.5);
    redGlowLight.position.set(0, 1.2, 0);
    scene.add(redGlowLight);

    // Sparkle Particle Field
    const sparkGeo = new THREE.BufferGeometry();
    const sparkCount = 40;
    const sparkPositions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount * 3; i += 3) {
      sparkPositions[i] = (Math.random() - 0.5) * 1.5;
      sparkPositions[i + 1] = 1.2 + (Math.random() - 0.5) * 1.5;
      sparkPositions[i + 2] = (Math.random() - 0.5) * 1.5;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xff5a2d,
      size: 0.08,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkPoints);

    // ── LOAD BLENDER 3D DIAMOND GLB ASSET ────────────────────────────────────
    const loader = new GLTFLoader();
    loader.load(
      '/models/diamond_lozenge.glb',
      (gltf) => {
        // Clone for Diamond 1 (Left)
        const model1 = gltf.scene.clone();
        model1.scale.set(1.3, 1.3, 1.3);
        model1.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = diamondMat1;
            const wire = new THREE.Mesh(mesh.geometry, wireMat);
            wire.scale.set(1.002, 1.002, 1.002);
            model1.add(wire);
          }
        });
        diamond1.add(model1);

        // Clone for Diamond 2 (Right)
        const model2 = gltf.scene.clone();
        model2.scale.set(1.3, 1.3, 1.3);
        model2.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.material = diamondMat2;
            const wire = new THREE.Mesh(mesh.geometry, wireMat);
            wire.scale.set(1.002, 1.002, 1.002);
            model2.add(wire);
          }
        });
        diamond2.add(model2);
      },
      undefined,
      () => {
        // Fallback procedural diamonds
        const fallbackGeo = new THREE.OctahedronGeometry(1.4, 2);
        diamond1.add(new THREE.Mesh(fallbackGeo, diamondMat1));
        diamond2.add(new THREE.Mesh(fallbackGeo, diamondMat2));
      }
    );

    // ── SCENE LIGHTING ───────────────────────────────────────────────────────
    const keySpot = new THREE.SpotLight(0xffffff, 18, 30, Math.PI / 3, 0.4);
    keySpot.position.set(6, 9, 8);
    scene.add(keySpot);

    const carminSpot = new THREE.SpotLight(0xc61c09, 20, 25, Math.PI / 3, 0.4);
    carminSpot.position.set(-6, -3, 6);
    scene.add(carminSpot);

    const ambientLight = new THREE.AmbientLight(0x181412, 2.0);
    scene.add(ambientLight);

    // ── INTERACTIVE POINTER LISTENER ─────────────────────────────────────────
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

      // Convergence logic: how close the mouse or scroll brings the diamonds together
      // Center proximity (cursor in middle = max attraction)
      const centerDist = Math.hypot(mouseX, mouseY);
      const proximityFactor = Math.max(0, 1 - centerDist * 1.1) + Math.min(scrollProgress * 2, 0.8);
      const clampedProximity = Math.min(Math.max(proximityFactor, 0), 1);

      // Diamonds glide towards each other
      const baseDistance = 1.8;
      const currentOffset = THREE.MathUtils.lerp(baseDistance, 0.38, clampedProximity);

      diamond1.position.x = -currentOffset;
      diamond2.position.x = currentOffset;

      // Vertical hover breathing
      const hover1 = Math.sin(elapsed * 1.2) * 0.08;
      const hover2 = Math.cos(elapsed * 1.2) * 0.08;
      diamond1.position.y = 1.2 + hover1;
      diamond2.position.y = 1.2 + hover2;

      // Inverse rotations for luxury twin interaction
      diamond1.rotation.y = elapsed * 0.45 + mouseX * 0.3;
      diamond1.rotation.x = Math.sin(elapsed * 0.3) * 0.2 - mouseY * 0.2;
      diamond1.rotation.z = Math.cos(elapsed * 0.25) * 0.15;

      diamond2.rotation.y = -elapsed * 0.45 - mouseX * 0.3;
      diamond2.rotation.x = -Math.sin(elapsed * 0.3) * 0.2 - mouseY * 0.2;
      diamond2.rotation.z = -Math.cos(elapsed * 0.25) * 0.15;

      // ── LIGHT BURST TRIGGER WHEN DIAMONDS GET CLOSE ────────────────────────
      const isClose = clampedProximity > 0.45;
      const burstFactor = Math.pow(Math.max(0, (clampedProximity - 0.45) / 0.55), 2);

      // Light flash intensity
      burstLight.intensity = THREE.MathUtils.lerp(0, 75, burstFactor);
      redGlowLight.intensity = THREE.MathUtils.lerp(0, 90, burstFactor);

      // Flare mesh expansion & opacity
      burstMesh.scale.setScalar(THREE.MathUtils.lerp(0.1, 1.8 + Math.sin(elapsed * 15) * 0.3, burstFactor));
      burstMat.opacity = THREE.MathUtils.lerp(0, 0.95, burstFactor);

      // Sparkle particles appearance
      sparkMat.opacity = THREE.MathUtils.lerp(0, 0.85, burstFactor);
      sparkPoints.rotation.y = elapsed * 0.8;

      // Diamond material emissive surge on contact
      diamondMat1.emissiveIntensity = THREE.MathUtils.lerp(0.15, 0.95, burstFactor);
      diamondMat2.emissiveIntensity = THREE.MathUtils.lerp(0.15, 0.95, burstFactor);

      // Camera motion
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
      burstGeo.dispose();
      burstMat.dispose();
      sparkGeo.dispose();
      sparkMat.dispose();
      diamondMat1.dispose();
      diamondMat2.dispose();
      wireMat.dispose();
      renderer.dispose();
    };
  }, [navMode, scrollProgress, atlasPan, activeProject]);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
};
