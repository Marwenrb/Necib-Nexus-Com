import { useState, useEffect } from 'react';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const updateMousePosition = (ev) => {
      // Calculate normalized coordinates (-1 to 1) for both axes
      const x = (ev.clientX / window.innerWidth) * 2 - 1;
      const y = -(ev.clientY / window.innerHeight) * 2 + 1;
      
      setMousePosition({ x, y });
    };
    
    // Add mousemove listener
    window.addEventListener('mousemove', updateMousePosition);
    
    // Handle touch events for mobile devices
    const updateTouchPosition = (ev) => {
      if (ev.touches.length > 0) {
        const touch = ev.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        
        setMousePosition({ x, y });
      }
    };
    
    window.addEventListener('touchmove', updateTouchPosition);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('touchmove', updateTouchPosition);
    };
  }, []);
  
  return mousePosition;
}; 