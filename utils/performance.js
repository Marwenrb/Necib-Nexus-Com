/**
 * Performance utilities for optimizing loading and rendering
 */
import { useState, useEffect } from 'react';

/**
 * Check if the current device is low-end based on various factors
 * @returns {boolean} - True if device is considered low-end
 */
export const detectLowEndDevice = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for navigator.deviceMemory (Chrome, Edge)
  const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  
  // Check for hardware concurrency (CPU cores)
  const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  
  // Check for connection type
  const slowConnection = 
    navigator.connection && 
    (navigator.connection.saveData || 
    ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType));
  
  // Battery status if available
  let lowBattery = false;
  if (navigator.getBattery) {
    navigator.getBattery().then(battery => {
      lowBattery = battery.level < 0.15 && !battery.charging;
    });
  }
  
  return !!(lowMemory || lowCPU || slowConnection || lowBattery);
};

/**
 * Hook to determine optimal quality settings based on device capabilities
 * @returns {object} - Quality settings object
 */
export const useQualitySettings = () => {
  const [settings, setSettings] = useState({
    particleCount: 1500,
    textureQuality: 'high',
    shadowQuality: 'medium',
    dpr: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1,
    enablePostProcessing: true,
  });
  
  useEffect(() => {
    const isLowEnd = detectLowEndDevice();
    
    if (isLowEnd) {
      setSettings({
        particleCount: 500,
        textureQuality: 'low',
        shadowQuality: 'low',
        dpr: 1,
        enablePostProcessing: false,
      });
    } else if (typeof window !== 'undefined') {
      // Choose quality based on device pixel ratio
      const dpr = window.devicePixelRatio || 1;
      
      if (dpr > 2.5) {
        // High-end device
        setSettings({
          particleCount: 2000,
          textureQuality: 'high',
          shadowQuality: 'high',
          dpr: Math.min(dpr, 2),
          enablePostProcessing: true,
        });
      } else if (dpr > 1) {
        // Mid-range device
        setSettings({
          particleCount: 1500,
          textureQuality: 'medium',
          shadowQuality: 'medium',
          dpr: Math.min(dpr, 1.5),
          enablePostProcessing: true,
        });
      } else {
        // Lower-end device
        setSettings({
          particleCount: 1000,
          textureQuality: 'low',
          shadowQuality: 'low',
          dpr: 1,
          enablePostProcessing: false,
        });
      }
    }
  }, []);
  
  return settings;
};

/**
 * Hook for priority-based loading of resources
 * @returns {function} - Function to register a resource for priority loading
 */
export const usePriorityLoading = () => {
  const [resources, setResources] = useState([]);
  const [currentlyLoading, setCurrentlyLoading] = useState(null);
  
  // Process the queue when it changes
  useEffect(() => {
    const processQueue = async () => {
      if (resources.length === 0 || currentlyLoading) return;
      
      // Sort by priority (lower number = higher priority)
      const sortedResources = [...resources].sort((a, b) => a.priority - b.priority);
      const nextResource = sortedResources[0];
      
      setCurrentlyLoading(nextResource.id);
      
      try {
        await nextResource.loadFn();
      } catch (error) {
        console.error('Error loading resource:', error);
      }
      
      // Remove from queue
      setResources(prev => prev.filter(r => r.id !== nextResource.id));
      setCurrentlyLoading(null);
    };
    
    processQueue();
  }, [resources, currentlyLoading]);
  
  // Add a resource to the loading queue
  const registerResource = (id, loadFn, priority = 1) => {
    setResources(prev => [...prev, { id, loadFn, priority }]);
    
    return {
      cancel: () => {
        setResources(prev => prev.filter(r => r.id !== id));
      }
    };
  };
  
  return registerResource;
};

/**
 * Function to optimize Three.js materials for performance
 * @param {Object} material - Three.js material to optimize
 * @param {string} quality - Quality level (low, medium, high)
 * @returns {Object} - Optimized material
 */
export const optimizeMaterial = (material, quality = 'medium') => {
  if (!material) return material;
  
  // Clone to avoid modifying original
  const optimized = material.clone();
  
  // Common optimizations for all quality levels
  optimized.fog = false;
  optimized.transparent = !!optimized.transparent;
  
  if (quality === 'low') {
    // Low quality settings
    optimized.roughness = 1.0;
    optimized.metalness = 0.0;
    optimized.envMapIntensity = 0.5;
    
    if (optimized.map) {
      optimized.map.minFilter = 1003; // LinearFilter
      optimized.map.magFilter = 1003; // LinearFilter
      optimized.map.anisotropy = 1;
    }
    
    optimized.flatShading = true;
    optimized.wireframe = false;
    optimized.shadowSide = 0; // FrontSide
    
  } else if (quality === 'medium') {
    // Medium quality settings
    if (optimized.map) {
      optimized.map.minFilter = 1006; // LinearMipmapLinearFilter
      optimized.map.magFilter = 1003; // LinearFilter
      optimized.map.anisotropy = 2;
    }
    
    optimized.envMapIntensity = 1.0;
    optimized.flatShading = false;
    
  } else {
    // High quality settings (fewer optimizations)
    if (optimized.map) {
      optimized.map.anisotropy = 4;
    }
  }
  
  return optimized;
};

export default {
  detectLowEndDevice,
  useQualitySettings,
  usePriorityLoading,
  optimizeMaterial
}; 