"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";

interface GlobeConfig {
  pointSize: number;
  globeColor: string;
  showAtmosphere: boolean;
  atmosphereColor: string;
  atmosphereAltitude: number;
  emissive: string;
  emissiveIntensity: number;
  shininess: number;
  polygonColor: string;
  ambientLight: string;
  directionalLeftLight: string;
  directionalTopLight: string;
  pointLight: string;
  arcTime: number;
  arcLength: number;
  rings: number;
  maxRings: number;
  initialPosition: { lat: number; lng: number };
  autoRotate: boolean;
  autoRotateSpeed: number;
}

interface Arc {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
}

interface WorldProps {
  data: Arc[];
  globeConfig: GlobeConfig;
}

export function World({ data, globeConfig }: WorldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ThreeGlobe | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 300;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Globe setup
    const globe = new ThreeGlobe();
    globeRef.current = globe;

    // Load world data
    fetch("/globe.json")
      .then((res) => res.json())
      .then((countries) => {
        globe.globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        );
        globe.hexPolygonsData(countries.features);
        globe.hexPolygonResolution(3);
        globe.hexPolygonMargin(0.7);
        globe.hexPolygonColor(() => globeConfig.polygonColor);
        scene.add(globe);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading globe data:", error);
        // Fallback: create a simple sphere
        const geometry = new THREE.SphereGeometry(100, 32, 32);
        const material = new THREE.MeshPhongMaterial({
          color: globeConfig.globeColor,
          transparent: true,
          opacity: 0.8,
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        setIsLoaded(true);
      });

    // Add arcs
    if (data && data.length > 0) {
      globe.arcsData(data);
      globe.arcColor("color");
      globe.arcDashLength(0.4);
      globe.arcDashGap(0.2);
      globe.arcDashAnimateTime(globeConfig.arcTime);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(globeConfig.ambientLight, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
      globeConfig.directionalTopLight,
      0.8
    );
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      if (globeConfig.autoRotate && globe) {
        globe.rotation.y += globeConfig.autoRotateSpeed * 0.01;
      }
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [data, globeConfig]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-lg">Loading globe...</div>
        </div>
      )}
    </div>
  );
}
