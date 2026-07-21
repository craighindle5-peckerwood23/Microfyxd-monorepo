import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HolographicCanvasProps {
  coherence: number;
  isTuningActive: boolean;
  activeTab: string;
}

export const HolographicCanvas: React.FC<HolographicCanvasProps> = ({
  coherence,
  isTuningActive,
  activeTab
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // Keep latest state in refs for the animation loop
  const stateRef = useRef({ coherence, isTuningActive, activeTab, isRotating });
  useEffect(() => {
    stateRef.current = { coherence, isTuningActive, activeTab, isRotating };
  }, [coherence, isTuningActive, activeTab, isRotating]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 260;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06070a, 0.08);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    // 2. Renderer Setup with Alpha and Antialias
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Create Holographic Objects Group
    const hologramGroup = new THREE.Group();
    scene.add(hologramGroup);

    // 3a. Geodesic Particle Brain Sphere
    const particleCount = 280;
    const sphereRadius = 2.0;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Distribute particles evenly on a sphere
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = sphereRadius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color variation (neon cyan to purple based on position)
      const mix = (y + sphereRadius) / (sphereRadius * 2);
      colors[i * 3] = THREE.MathUtils.lerp(0.0, 0.65, mix); // Red
      colors[i * 3 + 1] = THREE.MathUtils.lerp(0.9, 0.2, mix); // Green
      colors[i * 3 + 2] = THREE.MathUtils.lerp(1.0, 1.0, mix); // Blue
    }

    const sphereGeometry = new THREE.BufferGeometry();
    sphereGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    sphereGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Glowy particles
    const pMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const brainParticles = new THREE.Points(sphereGeometry, pMaterial);
    hologramGroup.add(brainParticles);

    // 3b. Interactive Particle Connections (Wireframe Web)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    });

    // Create custom wireframe web connections
    const lineIndices: number[] = [];
    for (let i = 0; i < particleCount; i++) {
      // Connect to nearest 2 neighbors to build a high-tech network
      const idxsWithDist = [];
      const x1 = positions[i * 3];
      const y1 = positions[i * 3 + 1];
      const z1 = positions[i * 3 + 2];

      for (let j = i + 1; j < particleCount; j++) {
        const x2 = positions[j * 3];
        const y2 = positions[j * 3 + 1];
        const z2 = positions[j * 3 + 2];
        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
        idxsWithDist.push({ idx: j, dist });
      }

      idxsWithDist.sort((a, b) => a.dist - b.dist);
      // Connect to the closest 2 neighbors
      const neighbors = idxsWithDist.slice(0, 2);
      neighbors.forEach(n => {
        lineIndices.push(i, n.idx);
      });
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    lineGeometry.setIndex(lineIndices);

    const brainNetwork = new THREE.LineSegments(lineGeometry, lineMaterial);
    hologramGroup.add(brainNetwork);

    // 3c. Concentric Outer Orbit Rings
    const ringGeom1 = new THREE.RingGeometry(2.6, 2.62, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const orbitRing1 = new THREE.Mesh(ringGeom1, ringMat1);
    orbitRing1.rotation.x = Math.PI / 2.3;
    hologramGroup.add(orbitRing1);

    const ringGeom2 = new THREE.RingGeometry(2.9, 2.91, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    const orbitRing2 = new THREE.Mesh(ringGeom2, ringMat2);
    orbitRing2.rotation.x = -Math.PI / 3;
    orbitRing2.rotation.y = Math.PI / 4;
    hologramGroup.add(orbitRing2);

    // 4. Mouse Drag Navigation Emu
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y
      };

      hologramGroup.rotation.y += deltaMove.x * 0.005;
      hologramGroup.rotation.x += deltaMove.y * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const canvasEl = canvasRef.current;
    canvasEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const state = stateRef.current;

      // Pulse speed and colors based on tuning active state
      const rotationSpeed = state.isTuningActive ? 1.4 : 0.35;
      const pulseFactor = 1.0 + Math.sin(elapsedTime * (state.isTuningActive ? 6.0 : 2.0)) * 0.05;

      if (state.isRotating && !isMouseDown) {
        hologramGroup.rotation.y += 0.004 * rotationSpeed;
        brainParticles.rotation.z -= 0.001 * rotationSpeed;
      }

      // Pulse particle positions slightly
      brainParticles.scale.set(pulseFactor, pulseFactor, pulseFactor);
      brainNetwork.scale.set(pulseFactor, pulseFactor, pulseFactor);

      // Rotate orbit rings
      orbitRing1.rotation.z += 0.002;
      orbitRing2.rotation.z -= 0.003;

      // Adjust camera zoom based on state zoom level
      camera.position.z = 8 / zoomLevel;

      // Dynamically shift wireframe line color based on activeTab
      if (state.activeTab === 'quantum_tuning') {
        lineMaterial.color.setHex(0xa855f7); // Neon Purple
      } else if (state.activeTab === 'cockpit') {
        lineMaterial.color.setHex(0x4f46e5); // Purple-Indigo
      } else if (state.activeTab === 'sandbox') {
        lineMaterial.color.setHex(0x10b981); // Emerald
      } else if (state.activeTab === 'workspace') {
        lineMaterial.color.setHex(0x3b82f6); // Blue
      } else {
        lineMaterial.color.setHex(0x06b6d4); // Cyan
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Container Resize using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const h = height || 260;
        camera.aspect = width / h;
        camera.updateProjectionMatrix();
        renderer.setSize(width, h);
      }
    });

    resizeObserver.observe(containerRef.current);

    // Cleanup WebGL and listeners
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (canvasEl) {
        canvasEl.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      // Dispose resources
      sphereGeometry.dispose();
      lineGeometry.dispose();
      ringGeom1.dispose();
      ringGeom2.dispose();
      pMaterial.dispose();
      lineMaterial.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      renderer.dispose();
    };
  }, [zoomLevel]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[220px] bg-[#05060b] border border-gray-850/60 rounded-xl relative overflow-hidden group select-none flex flex-col justify-between"
      id="3d-hologram-visualizer"
    >
      {/* 3D WebGL Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Holographic Controls overlay HUD */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-0.5 pointer-events-none">
        <span className="text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          HOLOGRAPHIC NEURAL SHIELD
        </span>
        <span className="text-[8.5px] font-mono text-gray-500">ZOOM: {zoomLevel.toFixed(1)}X | ROTATION: ON</span>
      </div>

      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 pointer-events-auto">
        <button
          onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.2))}
          className="w-5 h-5 bg-gray-900/80 hover:bg-gray-800 border border-gray-850 text-white font-mono text-[10px] rounded flex items-center justify-center cursor-pointer transition"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
          className="w-5 h-5 bg-gray-900/80 hover:bg-gray-800 border border-gray-850 text-white font-mono text-[10px] rounded flex items-center justify-center cursor-pointer transition"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={() => setIsRotating(prev => !prev)}
          className={`w-12 py-0.5 bg-gray-900/80 hover:bg-gray-800 border border-gray-850 text-[8px] font-mono rounded flex items-center justify-center cursor-pointer transition ${isRotating ? 'text-cyan-400' : 'text-gray-500'}`}
          title="Toggle Rotation"
        >
          {isRotating ? 'ROTATE' : 'PAUSED'}
        </button>
      </div>

      {/* HUD Bottom status overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none border-t border-gray-900/40 pt-1.5">
        <span className="text-[8.5px] font-mono text-gray-400 flex items-center gap-1">
          <span>COHERENCE CORE RESONANCE:</span>
          <span className="text-indigo-400 font-bold">{coherence.toFixed(1)}%</span>
        </span>
        <span className="text-[8.5px] font-mono text-emerald-400 font-bold">
          {isTuningActive ? 'SWEEP CALIBRATION ACTIVE' : 'STEADY RUNTIME'}
        </span>
      </div>
    </div>
  );
};
