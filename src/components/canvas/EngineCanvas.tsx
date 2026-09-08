'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const EngineCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090706, 0.035);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Dynamic brand-tinted glass stack
    const plateGeo = new THREE.BoxGeometry(3.6, 2.2, 0.05);
    const plates: THREE.Mesh[] = [];

    for (let i = 0; i < 4; i++) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#C61C09'),
        metalness: 0.1,
        roughness: 0.15,
        transmission: 0.75,
        thickness: 0.4,
        transparent: true,
        opacity: 0.85 - i * 0.15,
        reflectivity: 0.9,
      });

      const plate = new THREE.Mesh(plateGeo, mat);
      plate.position.set((i - 1.5) * 0.4, (i - 1.5) * 0.25, (i - 1.5) * -0.7);
      plate.rotation.set(0.15, -0.2 + i * 0.08, 0.05);
      group.add(plate);
      plates.push(plate);
    }

    // Atmospheric lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(new THREE.Color('#C61C09'), 2.5);
    keyLight.position.set(5, 6, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      group.rotation.y = targetX * 0.35 + Math.sin(elapsed * 0.3) * 0.05;
      group.rotation.x = -targetY * 0.25 + Math.cos(elapsed * 0.25) * 0.04;

      plates.forEach((p, idx) => {
        p.position.y += Math.sin(elapsed * 0.8 + idx) * 0.0008;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      plateGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
};
