import Lenis from '@studio-freight/lenis';

/**
 * Initialize smooth scrolling with Lenis
 * @returns {Lenis} Lenis instance
 */
export const initLenis = () => {
  // Create a new Lenis instance with optimal settings for premium feel
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium feel
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Connect lenis to requestAnimationFrame for smoother animations
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  // Start the animation loop
  requestAnimationFrame(raf);

  return lenis;
};

// Helper to get normalized scroll progress for any element
export const getScrollProgress = (element, offset = { start: 0, end: 0 }) => {
  if (!element) return 0;
  
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  // Element is above viewport
  if (rect.bottom + offset.end < 0) return 1;
  
  // Element is below viewport
  if (rect.top - offset.start > windowHeight) return 0;
  
  // Element is partially or fully in viewport
  const elementHeight = rect.height + windowHeight;
  const scrollPosition = windowHeight - rect.top + offset.start;
  const scrollProgress = Math.min(Math.max(scrollPosition / elementHeight, 0), 1);
  
  return scrollProgress;
}; 