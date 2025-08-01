import { useEffect, useRef, useState } from 'react';
import { useStore } from 'lib/store';
import cn from 'clsx';
import Image from 'next/image';
import s from './entry-experience.module.scss';

// Simple client-side only component
function EntryExperienceClient() {
  // Single state object to minimize reactivity
  const [state, setState] = useState({
    isActive: false,
    isMounted: false,
    isExiting: false,
    currentImageIndex: 0,
    currentMessageIndex: 0 // Track which message is currently showing
  });
  
  // Refs
  const containerRef = useRef();
  const intervalRef = useRef(null);
  const messageIntervalRef = useRef(null);
  
  // Store references
  const setIntroOut = useStore(({ setIntroOut }) => setIntroOut);
  const introOut = useStore(({ introOut }) => introOut);
  const lenis = useStore(({ lenis }) => lenis);
  
  // Static content
  const images = [
    '/images/photo-1519608220182-b0ee9d0f54d6.jpeg',
    '/images/photo-1519608487953-e999c86e7455.jpeg',
    '/images/photo-1529089377585-0da2bfe38f8d.jpeg',
    '/images/photo-1534076355207-1717511180ba.jpeg'
  ];
  
  const storyMessages = [
    "Step into Innovation",
    "Explore Next-Gen Designs"
  ];
  
  // Single initialization effect
  useEffect(() => {
    // Force reset introOut to false on mount
    setIntroOut(false);
    
    // Mark as mounted
    setState(prev => ({ ...prev, isMounted: true }));
    
    // Stop scrolling
    if (lenis) lenis.stop();
    
    // Activate with delay
    const timer = setTimeout(() => {
      setState(prev => ({ ...prev, isActive: true }));
    }, 500);
    
    // Set up image rotation
    intervalRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        currentImageIndex: (prev.currentImageIndex + 1) % images.length
      }));
    }, 3000);
    
    // Set up message rotation - separate from images
    messageIntervalRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        currentMessageIndex: (prev.currentMessageIndex + 1) % storyMessages.length
      }));
    }, 4000); // Use different timing to avoid syncing with images
    
    // Cleanup
    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
    };
  }, []);
  
  // Handle exit - only called by user interaction
  const handleEnter = () => {
    if (state.isExiting) return;
    
    console.log("Entry experience: handleEnter called");
    setState(prev => ({ ...prev, isExiting: true }));
    
    // Set introOut to true immediately to trigger other components
    console.log("Entry experience: Setting introOut to true");
    setIntroOut(true);
    
    // Allow time for exit animation then start scrolling
    setTimeout(() => {
      console.log("Entry experience: Starting scrolling");
      if (lenis) lenis.start();
    }, 500);
  };
  
  // Always render the component, regardless of introOut state
  return (
    <div 
      ref={containerRef} 
      className={cn(
        s.container,
        state.isActive && s.active,
        state.isExiting && s.exiting,
        introOut && s.exitComplete
      )}
    >
      {/* Background image */}
      <div className={s.bgContainer}>
        {images.map((img, index) => (
          <div 
            key={index} 
            style={{ 
              opacity: state.currentImageIndex === index ? 1 : 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transition: 'opacity 1s ease'
            }}
          >
            <Image
              src={img}
              alt={`Background ${index + 1}`}
              fill
              priority={index < 2}
              quality={90}
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
      
      {/* Content */}
      <div className={s.content}>
        {/* Messages - show only current one */}
        <div className={s.storyContainer}>
          {storyMessages.map((message, index) => (
            <div 
              key={index}
              style={{
                position: 'absolute',
                top: '30%', // Position higher
                left: 0,
                width: '100%',
                textAlign: 'center',
                color: '#fff',
                fontSize: '2.5rem',
                fontWeight: 'bold',
                opacity: state.isActive && state.currentMessageIndex === index ? 1 : 0,
                transition: 'opacity 1s ease',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)' // Add shadow for better readability
              }}
            >
              {message}
            </div>
          ))}
        </div>
        
        {/* Enter button */}
        <button 
          className={s.enterButton}
          onClick={handleEnter}
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '1rem 2rem',
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '100px',
            color: '#fff',
            opacity: state.isActive ? 1 : 0,
            transition: 'opacity 1s ease, background 0.3s ease',
            transitionDelay: '1s',
            cursor: 'pointer',
            fontSize: '1rem',
            letterSpacing: '2px',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.9)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
        >
          TAP TO ENTER
        </button>
      </div>
    </div>
  );
}

// Wrap for client-side only rendering
export default function EntryExperience() {
  const [mounted, setMounted] = useState(false);
  const introOut = useStore(({ introOut }) => introOut);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Skip rendering if intro is already out
  if (!mounted || introOut) return null;
  
  return <EntryExperienceClient />;
}

// Export as named export as well to maintain compatibility
export { EntryExperience };
