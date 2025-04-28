import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

/**
 * Custom hook for optimized lazy loading of 3D models
 * 
 * @param {string} path - Path to the 3D model
 * @param {boolean} inView - Whether the component is in view
 * @param {Function} onProgress - Optional progress callback
 * @param {number} priority - Loading priority (lower loads first)
 * @param {object} options - Additional options
 * @returns {object} - Model data and loading status
 */
export function useLazyModel(path, inView = true, onProgress = null, priority = 0, options = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const { gl } = useThree();
  
  // Create a unique cache key to prevent duplicate loads
  const cacheKey = `${path}-${priority}`;
  
  // Only load the model when in view or when priority is 0 (high priority)
  const shouldLoad = inView || priority === 0;
  
  // Custom progress tracking
  const handleProgress = (event) => {
    const progressValue = event.loaded / event.total * 100;
    setProgress(progressValue);
    
    if (onProgress) {
      onProgress(progressValue);
    }
  };
  
  // Handle error
  const handleError = (err) => {
    console.error(`Error loading model ${path}:`, err);
    setError(err);
  };
  
  // Custom loader with prioritization
  const { scene, animations } = useGLTF(
    shouldLoad ? path : null,
    undefined,
    handleError,
    {
      ...options,
      onProgress: handleProgress,
      prioritizeRequest: priority,
    }
  );
  
  // Notify when loading is complete
  useEffect(() => {
    if (scene) {
      // Apply memory optimizations
      scene.traverse((child) => {
        if (child.isMesh && child.geometry) {
          // Use static draw for geometries
          child.geometry.attributes.position.usage = 35044; // STATIC_DRAW
          
          // Dispose unneeded attributes to save memory
          if (child.geometry.attributes.normal) {
            child.geometry.attributes.normal.needsUpdate = false;
          }
          
          if (child.geometry.attributes.uv) {
            child.geometry.attributes.uv.needsUpdate = false;
          }
        }
      });
      
      setIsLoaded(true);
      
      // Force a single render to update scene
      gl.render(scene, gl.camera);
    }
  }, [scene, gl]);
  
  // Automatically dispose resources when component unmounts
  useEffect(() => {
    return () => {
      if (scene) {
        scene.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [scene]);
  
  return {
    scene,
    animations,
    isLoaded,
    error,
    progress
  };
}

export default useLazyModel; 