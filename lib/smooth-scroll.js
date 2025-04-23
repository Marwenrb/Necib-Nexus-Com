'use client';

import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { useStore } from './store';

// Create context for smooth scrolling
const SmoothScrollContext = createContext({
  lenis: null,
});

// Throttle function to limit execution rate
function throttle(callback, delay = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
}

export function SmoothScrollProvider({ children }) {
  const [lenis, setLenis] = useState(null);
  const reqIdRef = useRef(null);
  const { setLenis: storeLenis, isMobile, performanceMode, setScrollProgress } = useStore();

  useEffect(() => {
    // Define options based on device
    const options = {
      duration: isMobile ? 1.2 : 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: isMobile ? 0.8 : 1,
      touchMultiplier: isMobile ? 1.5 : 2,
      infinite: false,
    };

    // Initialize Lenis instance
    const lenisInstance = new Lenis(options);

    // Track scroll progress for animations
    lenisInstance.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
      // Update scroll progress in store for other components to use
      setScrollProgress({ 
        scroll, 
        limit, 
        velocity, 
        direction, 
        progress,
        normalized: Math.min(1, Math.max(0, scroll / limit))
      });
    });

    // Set up animation loop with performance adjustments
    const raf = (time) => {
      lenisInstance.raf(time);
      
      // In performance mode, we use a less frequent update for better performance
      if (performanceMode) {
        setTimeout(() => {
          reqIdRef.current = requestAnimationFrame(raf);
        }, 1000 / 30); // 30fps for performance mode
      } else {
        reqIdRef.current = requestAnimationFrame(raf);
      }
    };
    
    reqIdRef.current = requestAnimationFrame(raf);
    setLenis(lenisInstance);
    storeLenis(lenisInstance);

    // Handle window resize - throttled to improve performance
    const handleResize = throttle(() => {
      lenisInstance.resize();
    }, 200);
    
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      if (reqIdRef.current) {
        cancelAnimationFrame(reqIdRef.current);
        reqIdRef.current = null;
      }
      
      window.removeEventListener('resize', handleResize);
      lenisInstance.destroy();
      setLenis(null);
      storeLenis(null);
    };
  }, [isMobile, storeLenis, performanceMode, setScrollProgress]);

  return (
    <SmoothScrollContext.Provider value={{ lenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

// Hook to access smooth scroll context
export function useSmoothScroll() {
  const context = useContext(SmoothScrollContext);
  if (context === undefined) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
  }
  return context;
}

// Hook to scroll to a specific element
export function useScrollTo() {
  const { lenis } = useSmoothScroll();

  return useCallback(
    (target, options = {}) => {
      if (!lenis) return;

      const defaultOptions = {
        offset: 0,
        duration: 1.2,
        immediate: false,
      };

      lenis.scrollTo(target, {
        ...defaultOptions,
        ...options,
      });
    },
    [lenis]
  );
}

// Hook to track scroll position and respond to scroll events
export function useScrollPosition() {
  const { scrollProgress } = useStore();
  
  return scrollProgress;
} 