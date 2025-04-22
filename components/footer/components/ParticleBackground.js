import React, { useRef, useMemo, Suspense, lazy, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from 'lib/store'

// Custom useInView hook replacement
const useCustomInView = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      
      // If triggerOnce is enabled, disconnect after becoming visible
      if (options.triggerOnce && entry.isIntersecting) {
        observer.disconnect();
      }
    }, {
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0
    });
    
    observer.observe(ref);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, options.rootMargin, options.threshold, options.triggerOnce]);
  
  return [setRef, inView];
};

// Check if device is mobile for conditional rendering
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// Simplified particle material with shared instance for performance
const particleMaterial = new THREE.MeshBasicMaterial({
  color: '#5352ED',
  transparent: true,
  opacity: 0.6
});

// Simplified particle geometry with shared instance for performance
const particleGeometry = new THREE.SphereGeometry(0.07, 3, 3);

// Simplified particle with better performance
const Particle = ({ position, speed }) => {
  const mesh = useRef();
  const initialPosition = useMemo(() => [...position], [position]);
  
  // Use memo for animation function to reduce garbage collection
  const animate = useMemo(() => {
    return (time) => {
      if (!mesh.current) return;
      mesh.current.position.y += Math.sin(time * 0.1 + initialPosition[0] * 10) * 0.0003 * speed;
    };
  }, [initialPosition, speed]);
  
  useFrame((state) => {
    animate(state.clock.elapsedTime);
  });
  
  return (
    <mesh ref={mesh} position={position} geometry={particleGeometry} material={particleMaterial} />
  );
};

// Optimized particle field with fewer particles
const ParticleField = ({ count = 5 }) => { // Further reduced count for performance
  // Generate random particles with memoization
  const particles = useMemo(() => {
    const temp = [];
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 3 - 2;
      const speed = 1 + Math.random() * 0.3; // Reduced speed range for smoother animation
      
      temp.push({
        id: i,
        position: [x, y, z],
        speed
      });
    }
    return temp;
  }, [count]);
  
  return (
    <>
      {particles.map((particle) => (
        <Particle 
          key={particle.id}
          position={particle.position}
          speed={particle.speed}
        />
      ))}
    </>
  );
};

// Simplified scene
const Scene = () => {
  return (
    <group>
      <ambientLight intensity={0.1} />
      <ParticleField count={5} />
    </group>
  );
};

// Lazy-loaded canvas component with even more aggressive optimization
const ParticleCanvas = lazy(() => 
  new Promise(resolve => {
    // Delay loading of 3D until after critical content is rendered
    if (typeof window !== 'undefined') {
      // Use requestIdleCallback for non-blocking loading
      window.requestIdleCallback = window.requestIdleCallback || function(cb) {
        return setTimeout(cb, 1);
      };
      
      window.requestIdleCallback(() => {
        resolve({
          default: () => (
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              dpr={0.5} // Even lower DPR for better performance
              frameloop="demand" // Only render when needed
              gl={{
                powerPreference: 'low-power',
                antialias: false,
                alpha: true,
                depth: false,
                stencil: false,
              }}
              style={{ opacity: 0.4 }}
              performance={{ min: 0.1, max: 0.5 }}
            >
              <Scene />
            </Canvas>
          )
        });
      }, { timeout: 2000 }); // Reduced timeout for faster loading
    } else {
      resolve({ default: () => null });
    }
  })
);

export const ParticleBackground = () => {
  // Check if we're on mobile
  const isMobile = useIsMobile();
  
  // Only load when visible in viewport
  const [ref, inView] = useCustomInView({
    triggerOnce: true,
    rootMargin: '200px 0px', // Preload when getting closer
    threshold: 0.1
  });
  
  // Skip rendering on mobile devices for better performance
  if (isMobile) {
    return null;
  }
  
  return (
    <div 
      ref={ref}
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none',
        zIndex: 0,
        display: inView ? 'block' : 'none'
      }}
    >
      {inView && (
        <Suspense fallback={null}>
          <ParticleCanvas />
        </Suspense>
      )}
    </div>
  );
} 