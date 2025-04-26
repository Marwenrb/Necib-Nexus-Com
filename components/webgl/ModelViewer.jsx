import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations, PerspectiveCamera, Environment, useHelper } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MathUtils, SpotLightHelper, PointLightHelper, Vector3 } from 'three';

const ModelViewer = ({ modelPath, mouse, scale = 3, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const group = useRef();
  const spotLight = useRef();
  const pointLight = useRef();
  const [loaded, setLoaded] = useState(false);
  
  // Load the model
  const { scene, animations } = useGLTF(modelPath, true); // Enable loading manager
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
    
    setLoaded(true);
    
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
  }, [scene, animations, actions]);
  
  // Reactive animation frame
  useFrame((state, delta) => {
    if (!group.current || !loaded) return;
    
    const time = state.clock.getElapsedTime();
    
    // Smooth mouse following with enhanced responsiveness
    const targetRotationY = mouse.current[0] * 0.12; // Slightly increased for better reactivity
    const targetRotationX = -mouse.current[1] * 0.10;
    
    // More responsive rotation with damping
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      targetRotationY + rotation[1],
      4.0, // Higher damping for smoother movement
      delta
    );
    
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      targetRotationX + rotation[0],
      4.0,
      delta
    );
    
    // Enhanced floating animation with multiple frequencies
    const floatY = Math.sin(time * 0.5) * 0.2 + Math.sin(time * 0.3) * 0.1;
    const floatX = Math.cos(time * 0.3) * 0.1;
    
    group.current.position.y = position[1] + floatY;
    group.current.position.x = position[0] + floatX;
    
    // Move spotlight to create dynamic lighting
    if (spotLight.current) {
      const radius = 5;
      spotLight.current.position.x = Math.sin(time * 0.3) * radius;
      spotLight.current.position.z = Math.cos(time * 0.3) * radius;
      spotLight.current.intensity = 2 + Math.sin(time) * 0.5; // Pulsing intensity
    }
    
    // Detailed mesh animations for organic movement
    scene.traverse((child) => {
      if (child.isMesh && child.userData.initialPosition) {
        // Apply subtle movement to child meshes for more organic feel
        const childTime = time * child.userData.randomFactor + child.userData.randomOffset;
        const offsetY = Math.sin(childTime) * 0.04;
        const offsetX = Math.cos(childTime * 0.7) * 0.03;
        const offsetZ = Math.sin(childTime * 0.5) * 0.02;
        
        // Apply the offsets to the mesh positions
        child.position.y = child.userData.initialPosition.y + offsetY;
        child.position.x = child.userData.initialPosition.x + offsetX;
        child.position.z = (child.userData.initialPosition.z || 0) + offsetZ;
        
        // Subtle scale pulsing for more organic feel
        if (child.userData.pulseSpeed) {
          const scalePulse = 1 + Math.sin(time * child.userData.pulseSpeed) * 0.03;
          child.scale.set(scalePulse, scalePulse, scalePulse);
        }
        
        // Subtle material animation if the material has emissive properties
        if (child.material && child.material.emissive) {
          // Pulse the emissive intensity
          child.material.emissiveIntensity = 0.5 + Math.sin(time * 1.5 + child.userData.randomOffset) * 0.3;
        }
      }
    });
    
    // Update animation mixer for skeletal animations
    if (mixer) mixer.update(delta);
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

export default ModelViewer; 