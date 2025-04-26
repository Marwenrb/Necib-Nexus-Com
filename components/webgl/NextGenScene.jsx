import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  useGLTF, 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  useAnimations,
  Float,
  Html,
  Stars,
  ContactShadows,
  useHelper,
  BakeShadows,
  Text3D
} from '@react-three/drei';
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration, 
  Noise, 
  Vignette, 
  Glitch, 
  DepthOfField
} from '@react-three/postprocessing';
import { 
  Color,
  SpotLightHelper, 
  PointLightHelper,
  MathUtils
} from 'three';
import { useMousePosition } from '../../utils/useMousePosition';
import { BlendFunction } from 'postprocessing';

// Main 3D model component focused on the TV Man
const CustomModel = ({ mouse }) => {
  const group = useRef();
  const spotLight = useRef();
  const spotLight2 = useRef();
  const pointLight = useRef();
  
  // Debug helpers for development
  // useHelper(spotLight, SpotLightHelper, 'cyan');
  // useHelper(spotLight2, SpotLightHelper, 'magenta');
  // useHelper(pointLight, PointLightHelper, 0.5, 'yellow');
  
  // Load the 3D model with loading manager
  const { scene, animations } = useGLTF('/models/energized_tvman_accurate.glb');
  const { actions, mixer } = useAnimations(animations, group);
  
  // Setup animations and model properties
  useEffect(() => {
    // Play all animations for a dynamic effect
    if (animations.length > 0) {
      Object.keys(actions).forEach(key => {
        const action = actions[key];
        action.reset().play();
        action.setEffectiveTimeScale(0.8); // Slightly slower for better visuals
      });
    }
    
    // Enhance model materials
    scene.traverse((child) => {
      if (child.isMesh) {
        // Set up shadows
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Enhance material properties
        if (child.material) {
          // Add glow effects
          child.material.emissive = child.material.emissive || new Color(0, 0, 0);
          child.material.emissiveIntensity = 0.7;
          
          // Improve material quality
          if (child.material.roughness !== undefined) {
            child.material.roughness = Math.max(0.1, child.material.roughness);
          }
          if (child.material.metalness !== undefined) {
            child.material.metalness = Math.min(0.9, child.material.metalness + 0.2);
          }
          
          // Add animation properties to user data
          child.userData.initialPosition = { ...child.position };
          child.userData.initialRotation = { ...child.rotation };
          child.userData.randomFactor = 0.4 + Math.random() * 0.6;
          child.userData.randomOffset = Math.random() * Math.PI * 2;
        }
      }
    });
    
    return () => {
      // Clean up animations
      Object.values(actions).forEach(action => action.stop());
      
      // Dispose of resources
      scene.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        }
      });
    };
  }, [scene, animations, actions]);
  
  // Animation loop 
  React.useFrame((state, delta) => {
    if (!group.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Smooth mouse-following with enhanced model rotation
    const targetRotationY = mouse.current[0] * 0.15;
    const targetRotationX = -mouse.current[1] * 0.1;
    
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      targetRotationY + Math.PI * 0.05, // Slight offset for better viewing angle
      3.0,
      delta
    );
    
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      targetRotationX,
      3.0,
      delta
    );
    
    // Complex floating animation with multiple frequencies
    const floatingY = Math.sin(time * 0.4) * 0.15 + Math.sin(time * 0.2) * 0.1;
    const floatingX = Math.cos(time * 0.3) * 0.05;
    
    group.current.position.y = floatingY;
    group.current.position.x = floatingX;
    
    // Animate lights
    if (spotLight.current) {
      const radius = 8;
      spotLight.current.position.x = Math.sin(time * 0.3) * radius;
      spotLight.current.position.z = Math.cos(time * 0.3) * radius;
      spotLight.current.intensity = 2 + Math.sin(time * 0.5) * 0.5;
    }
    
    if (spotLight2.current) {
      const radius = 6;
      spotLight2.current.position.x = Math.sin(time * 0.4 + Math.PI) * radius;
      spotLight2.current.position.z = Math.cos(time * 0.4 + Math.PI) * radius;
      spotLight2.current.intensity = 1.5 + Math.cos(time * 0.6) * 0.4;
    }
    
    // Animate model parts
    scene.traverse((child) => {
      if (child.isMesh && child.userData.initialPosition) {
        // Apply subtle mesh animations for an organic feel
        const childTime = time * child.userData.randomFactor + child.userData.randomOffset;
        
        // Position offsets
        const posOffset = {
          x: Math.cos(childTime * 0.7) * 0.03,
          y: Math.sin(childTime) * 0.04,
          z: Math.sin(childTime * 0.5) * 0.02
        };
        
        // Apply offsets
        child.position.x = child.userData.initialPosition.x + posOffset.x;
        child.position.y = child.userData.initialPosition.y + posOffset.y;
        child.position.z = (child.userData.initialPosition.z || 0) + posOffset.z;
        
        // Pulse material properties if available
        if (child.material && child.material.emissive) {
          child.material.emissiveIntensity = 0.5 + Math.sin(time * 1.2 + child.userData.randomOffset) * 0.5;
        }
      }
    });
    
    // Update animation mixer
    if (mixer) mixer.update(delta);
  });
  
  return (
    <group ref={group} position={[0, 0, 0]} scale={3.2}>
      {/* Dynamic lighting setup */}
      <spotLight 
        ref={spotLight}
        position={[8, 8, 8]}
        angle={0.4}
        penumbra={0.5}
        intensity={2.5}
        color="#7c3aed"
        castShadow
        shadow-bias={-0.0005}
        shadow-mapSize={[1024, 1024]}
      />
      
      <spotLight 
        ref={spotLight2}
        position={[-6, 4, -6]}
        angle={0.3}
        penumbra={0.7}
        intensity={1.8}
        color="#4895ef"
        castShadow
        shadow-bias={-0.0005}
        shadow-mapSize={[1024, 1024]}
      />
      
      <pointLight
        ref={pointLight}
        position={[0, 3, -5]}
        intensity={1.5}
        color="#ffffff"
        distance={10}
      />
      
      {/* The main model */}
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
};

// Floating particles for background
const ParticlesField = () => {
  const points = useRef();
  
  // Generate particles data
  const particles = React.useMemo(() => {
    const temp = [];
    const count = 350; // Reduced count for better performance
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 0.5 + 0.1;
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 30;
      
      temp.push({ position: [x, y, z], size });
    }
    return temp;
  }, []);
  
  // Animate particles
  React.useFrame((state) => {
    if (!points.current) return;
    
    const time = state.clock.getElapsedTime();
    
    points.current.rotation.x = time * 0.05;
    points.current.rotation.y = time * 0.03;
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={new Float32Array(particles.flatMap(p => p.position))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.5} 
        color="#4895ef" 
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
};

// Loading indicator component
const Loader = () => (
  <Html center>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '3px solid rgba(124, 58, 237, 0.2)',
        borderTop: '3px solid rgba(124, 58, 237, 1)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }} />
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p>Loading 3D Experience...</p>
    </div>
  </Html>
);

// Main scene component
const NextGenScene = ({ className }) => {
  const mouse = useRef([0, 0]);
  const mousePosition = useMousePosition();
  
  useEffect(() => {
    // Update mouse position for 3D interactions
    mouse.current = [mousePosition.x - window.innerWidth / 2, -(mousePosition.y - window.innerHeight / 2)];
  }, [mousePosition]);
  
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 20], fov: 60 }}>
        {/* Base lighting */}
        <ambientLight intensity={0.2} />
        <hemisphereLight intensity={0.3} color="#7c3aed" groundColor="#000" />
        
        <Suspense fallback={<Loader />}>
          {/* Main scene elements */}
          <Float
            speed={1.2}
            rotationIntensity={0.1}
            floatIntensity={0.4}
          >
            <CustomModel mouse={mouse} />
          </Float>
          
          {/* Background elements */}
          <ParticlesField />
          
          <Stars 
            radius={50} 
            depth={50} 
            count={2000} 
            factor={4} 
            saturation={0.5} 
            fade
            speed={1}
          />
          
          {/* Ground shadow */}
          <ContactShadows 
            position={[0, -3.5, 0]} 
            scale={20} 
            blur={2}
            opacity={0.7}
            far={4.5}
            color="#7c3aed"
          />
          
          {/* Post-processing effects */}
          <EffectComposer multisampling={0}>
            <Bloom 
              luminanceThreshold={0.15} 
              luminanceSmoothing={0.9} 
              intensity={1.2}
              radius={0.8}
            />
            <ChromaticAberration 
              offset={[0.002, 0.002]} 
              radialModulation
              modulationOffset={0.5}
            />
            <Noise 
              opacity={0.02} 
              blendFunction={BlendFunction.OVERLAY}
            />
            <Vignette 
              darkness={0.5} 
              offset={0.1} 
            />
            <DepthOfField 
              focusDistance={0.01}
              focalLength={0.02}
              bokehScale={5}
            />
          </EffectComposer>
          
          {/* Environment */}
          <Environment preset="night" background={false} blur={0.8} />
          
          {/* Optimize shadows */}
          <BakeShadows />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Preload the model
useGLTF.preload('/models/energized_tvman_accurate.glb');

export default NextGenScene; 