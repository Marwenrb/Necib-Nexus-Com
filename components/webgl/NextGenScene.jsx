import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  useGLTF, 
  Environment, 
  useAnimations,
  Float,
  Html,
  Stars,
  ContactShadows,
  Text,
  useProgress,
  Center,
  PerformanceMonitor,
  Preload,
  AccumulativeShadows,
  RandomizedLight,
  PerspectiveCamera
} from '@react-three/drei';
import { MathUtils, Color, Vector3 } from 'three';
import { useMousePosition } from '../../utils/useMousePosition';

// Minimal silent loader - no visible UI
const SilentLoader = () => null;

// Main 3D model component
const TVManModel = ({ mouse }) => {
  const group = useRef();
  const spotLight1 = useRef();
  const spotLight2 = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Load the 3D model with absolute path
  const { scene, animations } = useGLTF('/models/energized_tvman_accurate.glb');
  const { actions, mixer } = useAnimations(animations, group);
  
  // Setup animations and model properties
  useEffect(() => {
    // Play all animations
    if (animations && animations.length > 0) {
      Object.keys(actions).forEach(key => {
        const action = actions[key];
        action.reset().play();
        action.setEffectiveTimeScale(0.8);
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
          // Improved material settings
          if (child.material.emissive) {
            child.material.emissive = new Color(0.1, 0.05, 0.2);
            child.material.emissiveIntensity = 0.5;
          }
          
          // Store original position for animations
          child.userData.initialPosition = new Vector3().copy(child.position);
          child.userData.initialRotation = child.rotation.clone();
          child.userData.randomFactor = 0.4 + Math.random() * 0.6;
          child.userData.randomOffset = Math.random() * Math.PI * 2;
        }
      }
    });
    
    return () => {
      // Clean up animations
      Object.values(actions).forEach(action => action.stop());
    };
  }, [scene, animations, actions]);
  
  // Animation loop with performance optimizations
  useFrame((state, delta) => {
    if (!group.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Smooth mouse-following with enhanced model rotation
    const targetRotationY = mouse.current[0] * 0.1;
    const targetRotationX = -mouse.current[1] * 0.05;
    
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      targetRotationY,
      2.5,
      delta
    );
    
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      targetRotationX,
      2.5,
      delta
    );
    
    // Advanced floating animation
    const floatY = Math.sin(time * 0.4) * 0.1;
    group.current.position.y = floatY;
    
    // Animate lights
    if (spotLight1.current) {
      spotLight1.current.position.x = Math.sin(time * 0.3) * 5;
      spotLight1.current.position.z = Math.cos(time * 0.3) * 5;
      spotLight1.current.intensity = 2 + Math.sin(time * 0.5) * 0.3;
    }
    
    if (spotLight2.current) {
      spotLight2.current.position.x = Math.sin(time * 0.4 + Math.PI) * 4;
      spotLight2.current.position.z = Math.cos(time * 0.4 + Math.PI) * 4;
      spotLight2.current.intensity = 1.5 + Math.cos(time * 0.6) * 0.2;
    }
    
    // Apply subtle animations to model parts with performance considerations
    scene.traverse((child) => {
      if (child.isMesh && child.userData.initialPosition) {
        const childTime = time * child.userData.randomFactor + child.userData.randomOffset;
        
        // Apply small, efficient offsets
        child.position.y = child.userData.initialPosition.y + Math.sin(childTime) * 0.02;
        
        // Pulse material only when visible
        if (child.material && child.material.emissive && hovered) {
          child.material.emissiveIntensity = 0.5 + Math.sin(time * 1.2 + child.userData.randomOffset) * 0.3;
        }
      }
    });
    
    // Update animation mixer with delta clamping for stability
    if (mixer) mixer.update(Math.min(delta, 0.05));
  });
  
  return (
    <group 
      ref={group} 
      position={[0, 0, 0]} 
      scale={3.2}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Optimized lighting setup */}
      <spotLight 
        ref={spotLight1}
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={0.7}
        intensity={2}
        color="#7c3aed"
        castShadow
        shadow-bias={-0.0005}
        shadow-mapSize={[1024, 1024]}
      />
      
      <spotLight 
        ref={spotLight2}
        position={[-4, 3, -4]}
        angle={0.25}
        penumbra={0.8}
        intensity={1.5}
        color="#4895ef"
        castShadow
        shadow-bias={-0.0005}
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* The main model */}
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
};

// Modern particles field with improved performance
const ParticleField = () => {
  const points = useRef();
  
  // Generate optimized particles
  const particles = React.useMemo(() => {
    const temp = [];
    const count = 150; // Balanced for performance
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 0.4 + 0.1;
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 25;
      const z = (Math.random() - 0.5) * 25;
      
      temp.push({ position: [x, y, z], size });
    }
    return temp;
  }, []);
  
  // Create positions array
  const positions = React.useMemo(() => {
    return new Float32Array(particles.flatMap(p => p.position));
  }, [particles]);
  
  // Create sizes array
  const sizes = React.useMemo(() => {
    return new Float32Array(particles.map(p => p.size));
  }, [particles]);
  
  // Minimal animation for performance
  useFrame((state) => {
    if (!points.current) return;
    
    points.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particles.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.5} 
        color="#4895ef" 
        sizeAttenuation
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </points>
  );
};

// Main scene component with performance optimizations
const NextGenScene = ({ className }) => {
  const mouse = useRef([0, 0]);
  const mousePosition = useMousePosition();
  const [perfSetting, setPerfSetting] = useState(1);
  
  // Preload model before mounting component for instant availability
  useEffect(() => {
    // Pre-load 3D model
    useGLTF.preload('/models/energized_tvman_accurate.glb');
  }, []);
  
  useEffect(() => {
    const handleMouseMove = () => {
      // Normalized coordinates for 3D interactions
      mouse.current = [
        (mousePosition.x / window.innerWidth) * 2 - 1,
        -(mousePosition.y / window.innerHeight) * 2 + 1
      ];
    };
    
    // Throttled event handler for performance
    const throttledMove = throttle(handleMouseMove, 16);
    window.addEventListener('mousemove', throttledMove);
    
    return () => {
      window.removeEventListener('mousemove', throttledMove);
    };
  }, [mousePosition]);
  
  // Simple throttle function
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  return (
    <div className={className}>
      <Canvas 
        shadows="basic"
        dpr={[1, perfSetting]} 
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          alpha: true
        }}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 0 
        }}
        camera={{ position: [0, 0, 15], fov: 50 }}
      >
        <color attach="background" args={['#030014']} />
        
        {/* Base lighting - minimized for performance */}
        <ambientLight intensity={0.2} />
        <hemisphereLight intensity={0.3} color="#7c3aed" groundColor="#000" />
        
        {/* Performance monitor to adapt quality */}
        <PerformanceMonitor 
          onIncline={() => setPerfSetting(Math.min(1.5, perfSetting + 0.1))}
          onDecline={() => setPerfSetting(Math.max(0.75, perfSetting - 0.1))}
        >
          <Suspense fallback={<SilentLoader />}>
            {/* Main content */}
            <Center top>
              <TVManModel mouse={mouse} />
            </Center>
            
            {/* Background elements */}
            <ParticleField />
            
            {/* Optimized stars with reduced count */}
            <Stars 
              radius={40} 
              depth={40} 
              count={750} 
              factor={3} 
              saturation={0.7} 
              fade
              speed={0.5}
            />
            
            {/* Efficient shadow implementation */}
            <AccumulativeShadows 
              frames={30} 
              alphaTest={0.85} 
              opacity={0.5} 
              scale={12}
              position={[0, -3.5, 0]}
            >
              <RandomizedLight 
                amount={4} 
                radius={10} 
                intensity={1} 
                ambient={0.25} 
                position={[5, 10, -5]} 
                bias={0.001}
              />
            </AccumulativeShadows>
            
            {/* Optimized environment */}
            <Environment preset="night" background={false} blur={0.6} />
            
            {/* Ensure all assets are preloaded */}
            <Preload all />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
};

// Preload the model
useGLTF.preload('/models/energized_tvman_accurate.glb');

export default NextGenScene; 