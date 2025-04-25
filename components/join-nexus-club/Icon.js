import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import s from './join-nexus-club.module.scss';

export const Icon = ({ name, path, size = 'medium', onClick, interactive = true }) => {
  const iconRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(path);
  
  // Determine icon size class
  const sizeClass = {
    small: s.iconSmall,
    medium: s.iconMedium,
    large: s.iconLarge
  }[size] || s.iconMedium;
  
  // Handle image error and use fallback
  const handleImageError = () => {
    console.warn(`Failed to load icon image: ${path}`);
    setImageSrc('/favicon-32x32.png'); // Use site's favicon as fallback
  };
  
  // Animation on hover
  useEffect(() => {
    if (!iconRef.current || !interactive) return;
    
    const icon = iconRef.current;
    const iconWrapper = icon.querySelector(`.${s.iconWrapper}`);
    const iconImage = icon.querySelector(`.${s.iconImage}`);
    
    if (!iconWrapper || !iconImage) return;
    
    // Setup hover animations
    const enterAnimation = () => {
      gsap.to(iconWrapper, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      gsap.to(iconImage, {
        rotate: 10,
        duration: 0.4,
        ease: 'elastic.out(1, 0.7)'
      });
    };
    
    const leaveAnimation = () => {
      gsap.to(iconWrapper, {
        scale: 1,
        duration: 0.2,
        ease: 'power1.in'
      });
      
      gsap.to(iconImage, {
        rotate: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };
    
    // Add event listeners
    icon.addEventListener('mouseenter', enterAnimation);
    icon.addEventListener('mouseleave', leaveAnimation);
    
    // Cleanup
    return () => {
      icon.removeEventListener('mouseenter', enterAnimation);
      icon.removeEventListener('mouseleave', leaveAnimation);
    };
  }, [interactive, imageSrc]);
  
  // Initial animation on mount
  useEffect(() => {
    if (!iconRef.current) return;
    
    const iconImage = iconRef.current.querySelector(`.${s.iconImage}`);
    
    if (!iconImage) return;
    
    gsap.fromTo(
      iconImage,
      { 
        opacity: 0,
        scale: 0.5,
        rotate: -20
      },
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }
    );
  }, [imageSrc]);
  
  // Handle click event
  const handleClick = () => {
    if (!onClick || !interactive || !iconRef.current) return;
      
    // Add click animation
    const iconWrapper = iconRef.current.querySelector(`.${s.iconWrapper}`);
    
    if (!iconWrapper) return;
    
    gsap.timeline()
      .to(iconWrapper, {
        scale: 0.9,
        duration: 0.1,
        ease: 'power2.in'
      })
      .to(iconWrapper, {
        scale: 1,
        duration: 0.2,
        ease: 'elastic.out(1, 0.7)'
      });
    
    // Call the provided onClick handler
    onClick(name);
  };
  
  return (
    <div 
      ref={iconRef}
      className={`${s.icon} ${sizeClass} ${interactive ? s.interactive : ''}`}
      onClick={handleClick}
      title={name}
    >
      <div className={s.iconWrapper}>
        <img 
          src={imageSrc} 
          alt={name} 
          className={s.iconImage}
          onError={handleImageError}
        />
      </div>
    </div>
  );
};

// Default export
export default Icon; 