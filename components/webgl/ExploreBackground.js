import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useMousePosition } from '../../utils/useMousePosition';

const ExploreBackground = () => {
  const containerRef = useRef(null);
  const { x, y } = useMousePosition();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup scene
    const scene = new THREE.Scene();
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1500;
    
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);
    
    // Position particles randomly
    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 15;
      posArray[i + 1] = (Math.random() - 0.5) * 15;
      posArray[i + 2] = (Math.random() - 0.5) * 15;
      
      // Store scale for each particle
      scaleArray[i / 3] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Create particle material
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x3498db,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Create a simple mesh
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.5, 128, 64);
    const material = new THREE.MeshBasicMaterial({
      color: 0x3498db,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let mouseX = 0;
    let mouseY = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update mouse position with smoothing
      mouseX = x * 0.5;
      mouseY = y * 0.5;
      
      // Rotate particle system based on mouse position
      particleSystem.rotation.x += 0.001;
      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.x += (mouseY * 0.01 - particleSystem.rotation.x) * 0.05;
      particleSystem.rotation.y += (mouseX * 0.01 - particleSystem.rotation.y) * 0.05;
      
      // Rotate mesh based on mouse position
      mesh.rotation.x += 0.001;
      mesh.rotation.y += 0.002;
      mesh.rotation.x += (mouseY * 0.02 - mesh.rotation.x) * 0.03;
      mesh.rotation.y += (mouseX * 0.02 - mesh.rotation.y) * 0.03;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [x, y]);
  
  return (
    <div ref={containerRef} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1
    }} />
  );
};

export default ExploreBackground; 