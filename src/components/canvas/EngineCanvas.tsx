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
  const coreRef = useRef<THREE.Mesh | null>(null);
  const wireRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090706, 0.028);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 1. Central Brand Monolith Core (Icosahedron with Carmin #C61C09 Glow)
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 3);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x141216,
      emissive: 0xc61c09,
      emissiveIntensity: 0.25,
      roughness: 0.18,
      metalness: 0.88,
      clearcoat: 0.8,
      transmission: 0.45,
      thickness: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 1.2, 0);
    scene.add(coreMesh);
    coreRef.current = coreMesh;

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe02d18,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(coreGeo, wireMat);
    wireMesh.position.copy(coreMesh.position);
    scene.add(wireMesh);
    wireRef.current = wireMesh;

    // 2. Orbital Halo Rings
    const haloGeo = new THREE.TorusGeometry(3.6, 0.02, 16, 100);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xc61c09, transparent: true, opacity: 0.35 });
    const halo1 = new THREE.Mesh(haloGeo, haloMat);
    halo1.rotation.x = Math.PI / 2.3;
    scene.add(halo1);

    const halo2 = new THREE.Mesh(haloGeo, haloMat);
    halo2.rotation.y = Math.PI / 3;
    halo2.rotation.x = Math.PI / 4;
    scene.add(halo2);

    // 3. 4-Plate Spatial Glass Stack
    const plateGeo = new THREE.BoxGeometry(3.6, 2.2, 0.05);
    const plates: THREE.Mesh[] = [];

    for (let i = 0; i < 4; i++) {
      const pMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#C61C09'),
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.75,
        thickness: 0.4,
        transparent: true,
        opacity: 0.8 - i * 0.14,
        reflectivity: 0.9,
      });

      const plate = new THREE.Mesh(plateGeo, pMat);
      plate.position.set((i - 1.5) * 0.4, (i - 1.5) * 0.25, (i - 1.5) * -0.7 - 2);
      plate.rotation.set(0.15, -0.2 + i * 0.08, 0.05);
      scene.add(plate);
      plates.push(plate);
    }

    // 4. Lights
    const keyLight = new THREE.SpotLight(0xc61c09, 22, 30, Math.PI / 3, 0.4);
    keyLight.position.set(6, 9, 8);
    scene.add(keyLight);

    const ambLight = new THREE.AmbientLight(0x181822, 2.2);
    scene.add(ambLight);

    const cyanPoint = new THREE.PointLight(0x38bdf8, 8, 20);
    cyanPoint.position.set(-6, 2, -12);
    scene.add(cyanPoint);

    // Mouse Pointer Tracker
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 1.4;
    let targetCamZ = 9;

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

      // Core rotation
      if (coreMesh) {
        coreMesh.rotation.y = elapsed * 0.22;
        coreMesh.rotation.x = Math.sin(elapsed * 0.15) * 0.18;
        wireMesh.rotation.copy(coreMesh.rotation);
      }

      halo1.rotation.z = elapsed * 0.12;
      halo2.rotation.z = -elapsed * 0.09;

      plates.forEach((p, idx) => {
        p.position.y += Math.sin(elapsed * 0.8 + idx) * 0.0008;
      });

      // Camera Driver from Scroll & Navigation Mode
      if (navMode === 'journey') {
        const scrollZ = scrollProgress * 22;
        targetCamZ = 9 - scrollZ;
        targetCamX = mouseX * 0.45;
        targetCamY = 1.4 + mouseY * 0.35;
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
      coreGeo.dispose();
      haloGeo.dispose();
      plateGeo.dispose();
      renderer.dispose();
    };
  }, [navMode, scrollProgress, atlasPan, activeProject]);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
};
