import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
  PerspectiveCamera,
  AdaptiveDpr,
  BakeShadows,
  useTexture,
  Instance,
  Instances,
  useDetectGPU
} from '@react-three/drei';
import { MathUtils, Color, Vector3, MeshStandardMaterial, DoubleSide, InstancedMesh, Matrix4 } from 'three';
import { useMousePosition } from '../../utils/useMousePosition';

// Define model path as a constant
const MODEL_PATH = '/models/energized_tvman_accurate.glb';

// Minimal silent loader - no visible UI
const SilentLoader = () => null;

// Advanced particle system with instancing for better performance
function ParticleField() {
  const instancedMeshRef = useRef();
  const count = 60; // Significantly reduced particle count for better performance
  
  // Generate particle data once
  const { positions, scales, rotations, speeds } = useMemo(() => {
    const positions = [];
    const scales = [];
    const rotations = [];
    const speeds = [];
    
    for (let i = 0; i < count; i++) {
      // Position particles in a sphere around the center
      const radius = 15 + Math.random() * 10; 
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions.push(new Vector3(x, y, z));
      
      // Varied sizes for visual interest
      const scale = 0.05 + Math.random() * 0.2;
      scales.push(new Vector3(scale, scale, scale));
      
      // Random rotation
      rotations.push(Math.random() * Math.PI * 2);
      
      // Movement speed
      speeds.push(0.2 + Math.random() * 0.3);
    }
    
    return { positions, scales, rotations, speeds };
  }, []);
  
  // Rate limiting for animation frames
  const frameCount = useRef(0);
  const frameLimit = 2; // Only update every X frames
  
  // Optimized animation using matrix updates with frame skipping
  useFrame((state) => {
    if (!instancedMeshRef.current) return;
    
    // Skip frames for performance
    frameCount.current = (frameCount.current + 1) % frameLimit;
    if (frameCount.current !== 0) return;
    
    const time = state.clock.getElapsedTime();
    const mesh = instancedMeshRef.current;
    
    // Create a reusable matrix for updates
    const matrix = new Matrix4();
    
    // Update all particles in one pass
    for (let i = 0; i < count; i++) {
      const pos = positions[i];
      const speed = speeds[i];
      
      // Motion pattern - subtle orbit
      const angle = time * speed * 0.3;
      const x = pos.x * Math.cos(angle) - pos.z * Math.sin(angle);
      const z = pos.x * Math.sin(angle) + pos.z * Math.cos(angle);
      
      matrix.setPosition(x, pos.y, z);
      
      // Apply scale
      matrix.scale(scales[i]);
      
      // Apply to instanced mesh
      mesh.setMatrixAt(i, matrix);
    }
    
    mesh.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={instancedMeshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial 
        color="#4895ef" 
        transparent 
        opacity={0.6} 
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// Progressive loading manager for 3D assets
function ModelLoadManager({ children }) {
  const { active, progress, errors, item, loaded, total } = useProgress();
  const [showModel, setShowModel] = useState(false);
  
  useEffect(() => {
    // Only show model when fully loaded
    if (progress >= 100) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setShowModel(true), 100);
      return () => clearTimeout(timer);
    }
  }, [progress]);
  
  return showModel ? children : <SilentLoader />;
}

// Adaptive quality based on device GPU
function AdaptiveQuality({ children }) {
  const [dpr, setDpr] = useState(1);
  const gpu = useDetectGPU();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set quality based on GPU tier
    if (gpu && gpu.tier) {
      if (gpu.tier >= 3) {
        setDpr(Math.min(window.devicePixelRatio, 1.5));
      } else if (gpu.tier >= 2) {
        setDpr(Math.min(window.devicePixelRatio, 1));
      } else {
        setDpr(0.75);
      }
    }
    
    // Simulate a short loading period to ensure everything initializes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [gpu]);
  
  return (
    <>
      <AdaptiveDpr pixelated />
      {children}
    </>
  );
}

// Main 3D model component optimized for performance
const TVManModel = ({ mouse }) => {
  const group = useRef();
  const spotLight1 = useRef();
  const spotLight2 = useRef();
  const [hovered, setHovered] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  
  // Use try-catch with async loading
  useEffect(() => {
    const loadModel = async () => {
      try {
        // Load model with a shorter timeout to prevent long hanging
        await new Promise((resolve, reject) => {
          // Check if file exists by making a HEAD request
          fetch(MODEL_PATH, { method: 'HEAD' })
            .then(response => {
              if (response.ok) {
                resolve();
              } else {
                reject(new Error(`Model file not found: ${MODEL_PATH}`));
              }
            })
            .catch(error => reject(error));
        });
        
        setModelLoaded(true);
      } catch (error) {
        console.error("Error pre-loading model:", error);
        setModelError(true);
      }
    };
    
    loadModel();
  }, []);
  
  // Fallback for model error - render simplified geometry instead
  if (modelError) {
    return (
      <group ref={group}>
        <spotLight 
          position={[5, 5, 5]} 
          angle={0.4} 
          penumbra={0.5} 
          intensity={2} 
          color="#7c3aed" 
        />
        <mesh>
          <boxGeometry args={[2, 3, 1]} />
          <meshStandardMaterial 
            color="#5352ED" 
            emissive="#3730A3"
            emissiveIntensity={0.5}
            wireframe={true}
          />
        </mesh>
        <Text
          position={[0, -4, 0]}
          fontSize={0.5}
          color="#fff"
          anchorX="center"
          anchorY="middle"
        >
          Model visualization
        </Text>
      </group>
    );
  }
  
  // Attempt to load the model with error handling
  const { scene, animations } = useGLTF(MODEL_PATH, undefined, 
    (e) => {
      console.error("Error loading model:", e);
      setModelError(true);
    },
    { 
      timeout: 15000, // Reduced timeout to prevent long hanging
    }
  );
  
  // Signal that model is loaded successfully
  useEffect(() => {
    if (scene) {
      setModelLoaded(true);
    }
  }, [scene]);
  
  // Only attempt animations if model loaded successfully
  const { actions, mixer } = !modelError && scene ? useAnimations(animations, group) : { actions: {}, mixer: null };
  
  // Setup animations and model properties with batched operations
  useEffect(() => {
    if (modelError) return;
    
    // Enable animations with performance optimization
    Object.values(actions).forEach(action => {
      action.reset().play();
      action.setEffectiveTimeScale(0.5); // Slower animations for better performance
    });
    
    // Optimize all meshes in the scene
    const optimizeMeshes = () => {
      scene.traverse((child) => {
        if (child.isMesh) {
          // Reduce shadow quality for performance
          child.castShadow = false;
          child.receiveShadow = false;
          
          // Simplify materials
          if (child.material) {
            // Override with simplified material
            child.material = new MeshStandardMaterial({
              color: child.material.color || new Color(0.8, 0.8, 0.8),
              roughness: 0.7,
              metalness: 0.3,
              emissive: new Color(0.1, 0.05, 0.2),
              emissiveIntensity: 0.5,
              flatShading: true // Performance boost
            });
          }
          
          // Simplify geometry to reduce vertices
          if (child.geometry && child.geometry.attributes.position) {
            child.geometry.attributes.position.usage = 35044; // STATIC_DRAW hint
          }
        }
      });
    };
    
    optimizeMeshes();
  }, [scene, actions, modelError]);
  
  // Optimized animation frame with batch updates
  useFrame((state, delta) => {
    if (!group.current || !modelLoaded || modelError) return;
    
    const time = state.clock.getElapsedTime() * 0.5; // Slow down animations slightly
    
    // Smooth mouse-following with enhanced model rotation
    const targetRotationY = mouse.current[0] * 0.08; // Reduced sensitivity
    const targetRotationX = -mouse.current[1] * 0.04; // Reduced sensitivity
    
    // Batch rotation updates for better performance
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      targetRotationY,
      3,
      delta
    );
    
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      targetRotationX,
      3,
      delta
    );
    
    // Simplified floating animation
    group.current.position.y = Math.sin(time * 0.3) * 0.08;
    
    // Batch light updates
    if (spotLight1.current) {
      spotLight1.current.position.x = Math.sin(time * 0.2) * 4;
      spotLight1.current.position.z = Math.cos(time * 0.2) * 4;
      spotLight1.current.intensity = 1.8 + Math.sin(time * 0.3) * 0.2;
    }
    
    if (spotLight2.current) {
      spotLight2.current.position.x = Math.sin(time * 0.3 + Math.PI) * 3;
      spotLight2.current.position.z = Math.cos(time * 0.3 + Math.PI) * 3;
      spotLight2.current.intensity = 1.3 + Math.cos(time * 0.4) * 0.2;
    }
    
    // Batch material updates
    if (hovered) {
      scene.traverse((child) => {
        if (child.isMesh && child.material?.emissive) {
          child.material.emissiveIntensity = 0.5 + Math.sin(time + child.userData.randomOffset) * 0.2;
        }
      });
    }
    
    // Update animation mixer with optimized delta
    if (mixer) mixer.update(Math.min(delta, 0.033)); // Cap at 30fps for animations
  });
  
  return (
    <group 
      ref={group} 
      position={[0, 0, 0]} 
      scale={3.2}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Optimized lighting with fewer shadows */}
      <spotLight 
        ref={spotLight1}
        position={[4, 4, 4]}
        angle={0.3}
        penumbra={0.7}
        intensity={1.8}
        color="#7c3aed"
        castShadow
        shadow-bias={-0.0005}
        shadow-mapSize={[512, 512]}
        shadow-camera-far={20}
      />
      
      <spotLight 
        ref={spotLight2}
        position={[-3, 2, -3]}
        angle={0.25}
        penumbra={0.8}
        intensity={1.3}
        color="#4895ef"
        castShadow
        shadow-bias={-0.0005}
        shadow-mapSize={[512, 512]}
        shadow-camera-far={15}
      />
      
      {/* The main model with optimized settings */}
      <primitive object={scene} castShadow receiveShadow />
    </group>
  );
};

// Main scene component with performance optimizations
const NextGenScene = ({ className }) => {
  const { x, y } = useMousePosition();
  const mouse = useRef([0, 0]);
  const [perfLevel, setPerfLevel] = useState(1);
  const [hasLoadingError, setHasLoadingError] = useState(false);
  
  // Preload the model to avoid loading delays
  useEffect(() => {
    // Check if model exists before trying to load it
    fetch(MODEL_PATH, { method: 'HEAD' })
      .then(response => {
        if (!response.ok) {
          console.error("Model file not found:", MODEL_PATH);
          setHasLoadingError(true);
        }
      })
      .catch(error => {
        console.error("Error checking model file:", error);
        setHasLoadingError(true);
      });
      
    // Pre-register the models to be handled by draco
    try {
      useGLTF.preload(MODEL_PATH);
    } catch (error) {
      console.error("Error preloading model:", error);
      setHasLoadingError(true);
    }
  }, []);
  
  // Convert mouse position from DOM to normalized values for 3D scene
  useEffect(() => {
    const handleMouseMove = (e) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Get mouse position relative to the center of the screen
      const mouseX = (e.clientX - windowWidth / 2) / (windowWidth / 2);
      const mouseY = (e.clientY - windowHeight / 2) / (windowHeight / 2);
      
      // Apply smooth damping to mouse movement
      mouse.current = [
        mouseX,
        mouseY
      ];
    };
    
    window.addEventListener('mousemove', throttle(handleMouseMove, 50));
    return () => window.removeEventListener('mousemove', throttle(handleMouseMove, 50));
  }, []);
  
  // Throttle function for better performance
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
    <div className={`next-gen-scene ${className || ''}`} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: -1
    }}>
      <Canvas
        dpr={perfLevel}
        style={{ background: 'transparent' }}
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{
          powerPreference: "high-performance",
          alpha: true,
          antialias: false,
          stencil: false,
          depth: true,
        }}
        performance={{ min: perfLevel * 0.5 }}
      >
        <color attach="background" args={['#030014']} />
        
        {/* Minimal lighting for performance */}
        <ambientLight intensity={0.2} />
        <hemisphereLight intensity={0.3} color="#7c3aed" groundColor="#000" />
        
        {/* Automatic performance adjustment */}
        <PerformanceMonitor 
          onIncline={() => setPerfLevel(Math.min(1.5, perfLevel + 0.1))}
          onDecline={() => setPerfLevel(Math.max(0.5, perfLevel - 0.1))}
        >
          <AdaptiveQuality>
            <Suspense fallback={<SilentLoader />}>
              {/* Core elements */}
              <Center top>
                <TVManModel mouse={mouse} />
              </Center>
              
              {/* Optimized particle system */}
              <ParticleField />
              
              {/* Optimized stars with reduced count */}
              <Stars 
                radius={40} 
                depth={30} 
                count={500} // Reduced count
                factor={3} 
                saturation={0.7} 
                fade
                speed={0.3}
              />
              
              {/* Simplified shadows */}
              <AccumulativeShadows 
                frames={10} // Reduced for performance
                alphaTest={0.85} 
                opacity={0.4} 
                scale={10}
                position={[0, -3.5, 0]}
              >
                <RandomizedLight 
                  amount={3} // Reduced light count
                  radius={8} 
                  intensity={0.8} 
                  ambient={0.3} 
                  position={[5, 8, -5]} 
                  bias={0.001}
                />
              </AccumulativeShadows>
              
              {/* Simple environment */}
              <Environment preset="night" background={false} blur={0.5} />
              
              {/* Bake shadows for performance */}
              <BakeShadows />
              
              {/* Ensure all core assets are preloaded */}
              <Preload all />
            </Suspense>
          </AdaptiveQuality>
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
};

export default NextGenScene; 