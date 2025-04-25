import { useEffect, useRef } from 'react';
import Head from 'next/head';
import gsap from 'gsap';
import s from './join-nexus-club.module.scss';

export const Favicon = ({ animateOnScroll = true, triggers = [] }) => {
  const faviconRef = useRef(null);
  
  // Handle favicon animation on scroll
  useEffect(() => {
    if (!animateOnScroll || !faviconRef.current) return;
    
    const favicon = faviconRef.current;
    
    // Create a custom animation for the favicon
    const animateFavicon = () => {
      const tl = gsap.timeline();
      
      tl.to(favicon, {
        rotateY: 360,
        duration: 1,
        ease: 'power2.inOut'
      });
      
      tl.to(favicon, {
        scale: 1.2,
        duration: 0.3,
        ease: 'power1.out'
      });
      
      tl.to(favicon, {
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.7)'
      });
      
      return tl;
    };
    
    // Create scroll triggers for different sections if provided
    if (triggers && triggers.length > 0) {
      triggers.forEach(trigger => {
        const triggerElement = document.querySelector(trigger);
        
        if (triggerElement) {
          gsap.timeline({
            scrollTrigger: {
              trigger: triggerElement,
              start: 'top center',
              onEnter: () => animateFavicon()
            }
          });
        }
      });
    } else {
      // Default animation on scroll
      const handleScroll = () => {
        // Change favicon on certain scroll points
        const scrollPosition = window.scrollY;
        
        // Change on every 1000px of scroll
        if (scrollPosition > 0 && scrollPosition % 1000 < 20) {
          animateFavicon();
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
    
    // Initial animation
    animateFavicon();
    
    return () => {
      // Cleanup handled in specific cases above
    };
  }, [animateOnScroll, triggers]);
  
  // Dynamic favicon switcher
  const switchFavicon = (iconPath) => {
    try {
      // Find all existing favicon links
      const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      
      // Remove existing favicons
      existingFavicons.forEach(favicon => {
        document.head.removeChild(favicon);
      });
      
      // Create a new favicon link
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = iconPath;
      
      // Add the new favicon to the document head
      document.head.appendChild(newFavicon);
      
      // Animate the favicon element if it exists
      if (faviconRef.current) {
        gsap.fromTo(
          faviconRef.current,
          { scale: 0.8, opacity: 0.5 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
        );
      }
    } catch (error) {
      console.warn('Error switching favicon:', error);
    }
  };
  
  // Existing favicon as fallback
  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = '/favicon-32x32.png'; // Use existing favicon as fallback
  };
  
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
      </Head>
      
      <div className={s.faviconVisual} ref={faviconRef}>
        <img 
          src="/favicon-32x32.png" 
          alt="Necib Nexus Favicon" 
          className={s.faviconImage}
          onError={handleImageError}
          onLoad={() => {
            // Animate favicon when image loads
            if (faviconRef.current) {
              gsap.fromTo(
                faviconRef.current,
                { 
                  opacity: 0, 
                  scale: 0.8,
                  rotate: -10
                },
                { 
                  opacity: 1, 
                  scale: 1,
                  rotate: 0,
                  duration: 0.6,
                  ease: 'back.out(1.7)'
                }
              );
            }
          }}
        />
      </div>
      
      {typeof window !== 'undefined' && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.switchFavicon = ${switchFavicon.toString()};
            `
          }}
        />
      )}
    </>
  );
};

// Additional utility to programmatically change favicon
export const changeFavicon = (iconPath) => {
  if (typeof window !== 'undefined' && window.switchFavicon) {
    window.switchFavicon(iconPath);
  }
};

export default Favicon; 