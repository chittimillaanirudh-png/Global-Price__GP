// src/components/GlobeBackground.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import * as THREE from "three";

interface Star {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

// Where the textures live in your project. Drop the /textures/earth folder
// from the download straight into /public and this just works.
const TEXTURE_PATHS = {
  day: "/textures/earth/day.jpg",
  clouds: "/textures/earth/clouds.png",
  specular: "/textures/earth/specular.jpg",
  normal: "/textures/earth/normal.jpg",
};

// Tuning knobs — adjust look and feel here without touching the render logic.
const EARTH_ROTATION_SPEED = 0.015; // radians / second
const CLOUD_ROTATION_SPEED = 0.02; // slightly faster than the surface, for drift
const AXIAL_TILT_DEG = 12; // gentle tilt, like real orbital photography
const CAMERA_DISTANCE = 2.9;
const CAMERA_FOV = 45;
const SUN_INTENSITY = 2.2;
const AMBIENT_INTENSITY = 0.3;

export const GlobeBackground: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [isInteractive, setIsInteractive] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);

  // Background star particles
  useEffect(() => {
    const generated: Star[] = Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 1.6 + 0.5,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * -10,
    }));
    setStars(generated);
  }, []);

  // The globe itself: a real 3D sphere rendered with three.js, lit by a
  // directional "sun" and spun on its own axis every frame.
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth || 300;
    let height = mount.clientHeight || window.innerHeight || 300;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, 0, CAMERA_DISTANCE);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    
    // Compatibility layer for colorSpace vs encoding in different Three.js versions
    const srgbColorSpace = (THREE as any).SRGBColorSpace;
    const srgbEncoding = (THREE as any).sRGBEncoding;
    
    if (srgbColorSpace !== undefined) {
      renderer.outputColorSpace = srgbColorSpace;
    } else if (srgbEncoding !== undefined) {
      (renderer as any).outputEncoding = srgbEncoding;
    }
    
    mount.appendChild(renderer.domElement);

    // One group holds the whole planet so a single static axial tilt can be
    // applied, while the earth and clouds spin independently inside it.
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = THREE.MathUtils.degToRad(AXIAL_TILT_DEG);
    scene.add(globeGroup);

    const textureLoader = new THREE.TextureLoader();

    const dayMap = textureLoader.load(TEXTURE_PATHS.day);
    if (srgbColorSpace !== undefined) {
      dayMap.colorSpace = srgbColorSpace;
    } else if (srgbEncoding !== undefined) {
      (dayMap as any).encoding = srgbEncoding;
    }
    
    let maxAnisotropy = 1;
    if (renderer.capabilities && typeof renderer.capabilities.getMaxAnisotropy === 'function') {
      maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    }
    dayMap.anisotropy = Math.min(maxAnisotropy, 4); // optimized anisotropy

    const specularMap = textureLoader.load(TEXTURE_PATHS.specular);
    const normalMap = textureLoader.load(TEXTURE_PATHS.normal);

    const cloudsMap = textureLoader.load(TEXTURE_PATHS.clouds);
    if (srgbColorSpace !== undefined) {
      cloudsMap.colorSpace = srgbColorSpace;
    } else if (srgbEncoding !== undefined) {
      (cloudsMap as any).encoding = srgbEncoding;
    }

    // Optimized subdivisions to prevent scroll lag/getting stuck
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: dayMap,
      specularMap,
      specular: new THREE.Color(0x333333),
      shininess: 10,
      normalMap,
      normalScale: new THREE.Vector2(0.7, 0.7),
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earth);

    // Cloud shell, a hair above the surface so it never z-fights
    const cloudGeometry = new THREE.SphereGeometry(1.008, 64, 64);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: cloudsMap,
      transparent: true,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    globeGroup.add(clouds);

    // Lighting: white directional "sun" shining from the left, plus a gorgeous blue atmospheric rim glow,
    // and an extremely low ambient level so the shadow side remains in complete shade.
    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(-2.8, 0.4, 1.8);
    scene.add(sun);

    const blueRimLight = new THREE.DirectionalLight(0x0099ff, 4.2);
    blueRimLight.position.set(-3.5, 0.1, 0.3);
    scene.add(blueRimLight);

    const ambient = new THREE.AmbientLight(0x02050a, 0.04);
    scene.add(ambient);

    const renderOnce = () => renderer.render(scene, camera);

    let frameId = 0;
    let lastTime = performance.now();

    // Interaction state variables
    let isDragging = false;
    let isInteractiveVar = false;
    let previousPointer = { x: 0, y: 0 };

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!isInteractiveVar) {
        // Standard auto-rotation
        earth.rotation.y += EARTH_ROTATION_SPEED * delta;
        clouds.rotation.y += CLOUD_ROTATION_SPEED * delta;
        
        // Float back to normal axial tilt/rotation alignment if interactive mode is off
        globeGroup.rotation.x += (0 - globeGroup.rotation.x) * 0.05;
      } else {
        // Clouds drift slowly when manual rotation is enabled
        clouds.rotation.y += (CLOUD_ROTATION_SPEED - EARTH_ROTATION_SPEED) * delta;
      }

      renderOnce();
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    // Toggle manual interaction state handler
    const toggleInteractiveMode = () => {
      isInteractiveVar = !isInteractiveVar;
      setIsInteractive(isInteractiveVar);
    };

    // Pointer rotation listeners
    const handlePointerDown = (e: PointerEvent) => {
      if (!isInteractiveVar) return;
      isDragging = true;
      previousPointer = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isInteractiveVar || !isDragging) return;
      const deltaX = e.clientX - previousPointer.x;
      const deltaY = e.clientY - previousPointer.y;

      const sensitivity = 0.005;
      globeGroup.rotation.y += deltaX * sensitivity;
      globeGroup.rotation.x += deltaY * sensitivity;

      previousPointer = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    // Double tap detector for mobile touch
    let lastTap = 0;
    const handleTouchStart = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault();
        toggleInteractiveMode();
      }
      lastTap = now;
    };

    // Attach listeners
    mount.addEventListener("dblclick", toggleInteractiveMode);
    mount.addEventListener("pointerdown", handlePointerDown);
    mount.addEventListener("pointermove", handlePointerMove);
    mount.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("pointerup", handlePointerUp);

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      width = entry.contentRect.width;
      height = entry.contentRect.height;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      
      // Clean up event listeners
      mount.removeEventListener("dblclick", toggleInteractiveMode);
      mount.removeEventListener("pointerdown", handlePointerDown);
      mount.removeEventListener("pointermove", handlePointerMove);
      mount.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("pointerup", handlePointerUp);

      mount.removeChild(renderer.domElement);

      earthGeometry.dispose();
      earthMaterial.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      dayMap.dispose();
      specularMap.dispose();
      normalMap.dispose();
      cloudsMap.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#010101] z-0 select-none pointer-events-none [transform:translateZ(0)]">
      {/* Star particles */}
      <div className="absolute inset-0 opacity-60">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.12, 0.45, 0.12],
              scale: [1, 1.35, 1],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Globe container — Optimized hardware layers & Interactive controls */}
      <div className="absolute top-1/2 -translate-y-1/2 right-[-65vw] w-[130vw] h-[130vw] sm:right-[-12vw] sm:w-[85vw] sm:h-[85vw] md:right-[-15vw] md:w-[75vw] md:h-[75vw] lg:right-[-10vw] lg:w-[65vw] lg:h-[65vw] xl:right-[-5vw] xl:w-[58vw] xl:h-[58vw] max-w-[950px] max-h-[950px] aspect-square pointer-events-auto cursor-pointer group [transform:translateZ(0)]">
        {/* Soft ambient bloom behind the sphere */}
        <div className="absolute inset-0 rounded-full bg-radial from-amber-500/10 via-amber-950/5 to-transparent blur-3xl scale-125 pointer-events-none" />
        <div ref={mountRef} className="absolute inset-0" />

        {/* Hover / Active Interactivity Indicator */}
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap transition-all duration-500">
          <div className={`px-3 py-1 rounded-full border text-[9px] tracking-widest font-mono uppercase flex items-center gap-1.5 backdrop-blur-md transition-all duration-500 ${
            isInteractive 
              ? "bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-105" 
              : "bg-white/3 border-white/5 text-white/40 opacity-0 group-hover:opacity-100"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isInteractive ? "bg-amber-400 animate-pulse" : "bg-white/30"}`} />
            {isInteractive ? "MANUAL CONTROL: DRAG" : "DOUBLE-TAP / DBL-CLICK TO SPIN"}
          </div>
        </div>
      </div>

      {/* Gradient masks so foreground text stays legible */}
      <div className="absolute inset-x-0 bottom-0 h-[35vh] sm:h-[45vh] bg-gradient-to-t from-[#010101] via-[#010101]/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#010101]/5 to-[#010101]/65 sm:to-[#010101]/95 pointer-events-none" />
    </div>
  );
};

export default GlobeBackground;