import React, { useState, useEffect, useRef } from 'react';
import styles from './FooterCursor.module.scss';
import cn from 'clsx';

export default function FooterCursor({ children }) {
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const cursorRef = useRef(null);
  const containerRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const container = containerRef.current;
    
    if (!cursor || !container) return;
    
    let pointerElements = [];
    let mouseX = -100;
    let mouseY = -100;

    // Throttle mouse movement for better performance
    const updateCursorPosition = () => {
      if (cursor) {
        cursor.style.transform = `translate3d(${mouseX - 15}px, ${mouseY - 15}px, 0)`;
      }
      frameRef.current = null;
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!visible) {
        setVisible(true);
      }
      
      // Only request animation frame if one isn't already requested
      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(updateCursorPosition);
      }
    };

    const onMouseEnter = () => {
      setVisible(true);
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    // Handle pointer elements (interactive elements)
    const refreshPointerElements = () => {
      pointerElements = container.querySelectorAll('a, button, [data-cursor], [role="button"]');
      pointerElements.forEach(el => {
        el.addEventListener('mouseenter', () => setIsPointer(true));
        el.addEventListener('mouseleave', () => setIsPointer(false));
      });
    };

    // Set up event listeners
    refreshPointerElements();
    document.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    // Clean up event listeners when component unmounts
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      
      pointerElements.forEach(el => {
        el.removeEventListener('mouseenter', () => setIsPointer(true));
        el.removeEventListener('mouseleave', () => setIsPointer(false));
      });
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [visible]);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      {children}
      <div 
        ref={cursorRef}
        className={cn(
          styles.cursor,
          { 
            [styles.visible]: visible,
            [styles.pointer]: isPointer 
          }
        )}
      />
    </div>
  );
} 