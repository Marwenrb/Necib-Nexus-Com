import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations, PerspectiveCamera, Environment, useHelper } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MathUtils, SpotLightHelper, PointLightHelper, Vector3 } from 'three';

const ModelViewer = ({ modelPath, mouse, scale = 3, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const group = useRef();
  const spotLight = useRef();
  const pointLight = useRef();
  const [modelError, setModelError] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  
  // Try to load the model with error handling
  const { scene, animations } = useGLTF(
    modelError ? BACKUP_MODEL_PATH : modelPath, 
    undefined,
    (error) => {
      console.error("Error loading model:", error);
      setModelError(true);
      setUsingFallback(true);
    }
  );
  
  // Apply animations if available
  const { actions, mixer } = useAnimations(animations, group);
  
  // Debug helpers for lights (only in development)
  // useHelper(spotLight, SpotLightHelper, 'red');
  // useHelper(pointLight, PointLightHelper, 0.5, 'blue');
  
  // Set up animations if they exist
  useEffect(() => {
    if (animations.length > 0) {
      // Play all animations for more dynamic effect
      Object.keys(actions).forEach(actionName => {
        const action = actions[actionName];
        action.reset().play();
        action.setEffectiveTimeScale(0.8); // Slightly slower for better visual
      });
    } else {
      console.log("No animations found in the model");
    }
    
    // Add glow effect to model materials and prepare for animation
    scene.traverse((child) => {
      if (child.isMesh) {
        // Enhance material settings for better visual quality
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Upgrade materials for better visual quality
        if (child.material) {
          // Add emissive properties for glow effects
          child.material.emissive = child.material.emissive || { r: 0, g: 0, b: 0 };
          child.material.emissiveIntensity = 0.6;
          
          // Improve material quality
          if (child.material.roughness !== undefined) {
            child.material.roughness = Math.max(0.2, child.material.roughness);
          }
          if (child.material.metalness !== undefined) {
            child.material.metalness = Math.min(0.8, child.material.metalness + 0.2);
          }
          
          // Add custom properties for animation
          child.userData.initialPosition = { ...child.position };
          child.userData.randomOffset = Math.random() * 2 * Math.PI;
          child.userData.randomFactor = 0.5 + Math.random() * 0.5;
          child.userData.pulseSpeed = 0.3 + Math.random() * 0.5;
        }
      }
    });
    
    // Show console message if using fallback
    if (usingFallback) {
      console.log("Using fallback model due to loading error with primary model");
    }
    
    return () => {
      if (animations.length > 0) {
        // Stop animations on unmount
        Object.values(actions).forEach(action => action.stop());
      }
      
      // Dispose resources
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      });
    };
  }, [scene, animations, actions, usingFallback]);
  
  // Animate the model based on mouse position
  useFrame(({ clock }) => {
    if (!group.current) return;
    
    const time = clock.getElapsedTime();
    
    // Gentle floating animation
    group.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1;
    
    // Subtle mouse-based movement
    if (mouse && mouse.current) {
      group.current.rotation.x = rotation[0] + mouse.current[1] * 0.1;
      group.current.rotation.y = rotation[1] + mouse.current[0] * 0.1;
    }
    
    // Animated lighting
    if (spotLight.current) {
      spotLight.current.intensity = 1.5 + Math.sin(time) * 0.5;
    }
    
    if (pointLight.current) {
      pointLight.current.intensity = 1 + Math.sin(time * 0.5) * 0.3;
    }
    
    // Update animations
    if (mixer) {
      mixer.update(0.016); // Fixed time step for consistent animation
    }
  });
  
  return (
    <group ref={group} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Add dramatic lighting for the model */}
      <spotLight 
        ref={spotLight}
        position={[5, 5, 5]} 
        angle={0.4} 
        penumbra={0.5} 
        intensity={2} 
        color="#7c3aed" 
        castShadow
        shadow-bias={-0.0005}
      />
      
      <pointLight
        ref={pointLight}
        position={[-3, 0, -3]}
        intensity={1.5}
        color="#4895ef"
        distance={10}
      />
      
      {/* The 3D model */}
      <primitive object={scene} />
    </group>
  );
};

// Preload the model to avoid loading delays
useGLTF.preload("/models/energized_tvman_accurate.glb");

// Create a backup model path as fallback
const BACKUP_MODEL_PATH = "/models/robotic_glow_fbx.glb";
useGLTF.preload(BACKUP_MODEL_PATH);

export default ModelViewer; 