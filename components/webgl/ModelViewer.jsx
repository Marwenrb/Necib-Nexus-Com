import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, PerspectiveCamera, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

const ModelViewer = ({ modelPath, mouse, scale = 3, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const group = useRef();
  const { scene, animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, group);
  
  // Set up animations if they exist
  useEffect(() => {
    if (animations.length > 0) {
      // Play the first animation by default
      const animationAction = actions[Object.keys(actions)[0]];
      if (animationAction) {
        animationAction.reset().play();
      }
    }
    
    // Add glow effect to model materials
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.emissive = child.material.emissive || { r: 0, g: 0, b: 0 };
        child.material.emissiveIntensity = 0.5;
        
        // Add custom properties for animation
        child.userData.initialPosition = { ...child.position };
        child.userData.randomOffset = Math.random() * 2 * Math.PI;
        child.userData.randomFactor = 0.5 + Math.random() * 0.5;
      }
    });
    
    return () => {
      if (animations.length > 0) {
        // Stop animations on unmount
        Object.values(actions).forEach(action => action.stop());
      }
    };
  }, [scene, animations, actions]);
  
  // Reactive animation frame
  useFrame((state, delta) => {
    if (!group.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Smooth mouse following
    const targetRotationY = mouse.current[0] * 0.1;
    const targetRotationX = -mouse.current[1] * 0.1;
    
    group.current.rotation.y = MathUtils.lerp(
      group.current.rotation.y,
      targetRotationY + rotation[1],
      0.05
    );
    
    group.current.rotation.x = MathUtils.lerp(
      group.current.rotation.x,
      targetRotationX + rotation[0],
      0.05
    );
    
    // Gentle floating animation
    group.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;
    
    // Subtle mesh animations
    scene.traverse((child) => {
      if (child.isMesh && child.userData.initialPosition) {
        // Apply subtle movement to child meshes for more organic feel
        const childTime = time * child.userData.randomFactor + child.userData.randomOffset;
        const offsetY = Math.sin(childTime) * 0.03;
        const offsetX = Math.cos(childTime * 0.7) * 0.02;
        
        child.position.y = child.userData.initialPosition.y + offsetY;
        child.position.x = child.userData.initialPosition.x + offsetX;
      }
    });
    
    // Update animation mixer
    if (mixer) mixer.update(delta);
  });
  
  return (
    <group ref={group} position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <primitive object={scene} />
    </group>
  );
};

export default ModelViewer; 