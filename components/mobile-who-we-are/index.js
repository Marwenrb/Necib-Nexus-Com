import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@darkroom.engineering/hamo';
import cn from 'clsx';
import { motion, useScroll, useTransform, useSpring, useAnimation, AnimatePresence } from 'framer-motion';
import s from './mobile-who-we-are.module.scss';

const FeatureItem = ({ title, content, index }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  
  // Custom spring config for smoother animations
  const springConfig = {
    type: "spring",
    damping: 20,
    stiffness: 90,
    restDelta: 0.001
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          controls.start("visible");
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "-10% 0% -10% 0%"
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);
  
  // Enhanced touch interaction with haptic feedback
  const [touchRotation, setTouchRotation] = useState({ x: 0, y: 0 });
  const [initialTouch, setInitialTouch] = useState({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);
  const [touchEnergy, setTouchEnergy] = useState(0);
  
  const handleTouchStart = (e) => {
    setIsTouching(true);
    setInitialTouch({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
    
    // Add subtle haptic feedback for premium feel if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }
  };
  
  const handleTouchMove = (e) => {
    if (!isTouching) return;
    
    const deltaX = (e.touches[0].clientX - initialTouch.x);
    const deltaY = (e.touches[0].clientY - initialTouch.y);
    
    // Calculate touch energy for dynamic effects
    const energy = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 100, 1);
    setTouchEnergy(energy);
    
    setTouchRotation({
      y: deltaX * 0.08,
      x: deltaY * -0.08
    });
    
    // Prevent scrolling when manipulating the card
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      e.preventDefault();
    }
  };
  
  const handleTouchEnd = () => {
    setIsTouching(false);
    
    // Smooth reset with spring physics
    const resetAnimation = {
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200
      }
    };
    
    setTouchRotation(resetAnimation);
    setTouchEnergy(0);
    
    // Add subtle haptic feedback for premium feel if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(3);
    }
  };
  
  // Animation variants with enhanced transitions
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...springConfig,
        delay: index * 0.15,
        staggerChildren: 0.1,
        delayChildren: index * 0.15 + 0.2
      }
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...springConfig,
        delay: 0.1
      }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ...springConfig,
        delay: 0.2
      }
    }
  };
  
  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        ...springConfig,
        delay: 0.3
      }
    }
  };
  
  // Handle tap to expand/collapse feature for more detail
  const handleToggleDetail = () => {
    setShowDetail(!showDetail);
    
    // Add subtle haptic feedback for premium feel if available
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([10, 20, 10]);
    }
  };
  
  // Calculate dynamic shadow based on touch energy
  const shadowIntensity = Math.min(15 + touchEnergy * 20, 30);
  const glowIntensity = Math.min(5 + touchEnergy * 10, 15);
  
  return (
    <motion.div
      ref={ref}
      className={cn(s.featureItem, { [s.expanded]: showDetail })}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      style={{
        rotateX: touchRotation.x,
        rotateY: touchRotation.y,
        z: isTouching ? 20 : 0,
        boxShadow: `0 ${shadowIntensity}px ${shadowIntensity * 2}px rgba(0, 0, 0, 0.1),
                   0 0 ${glowIntensity}px rgba(83, 82, 237, ${0.2 + touchEnergy * 0.3})`,
        background: `rgba(255, 255, 255, ${0.03 + touchEnergy * 0.02})`,
        border: `1px solid rgba(255, 255, 255, ${0.05 + touchEnergy * 0.1})`
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleToggleDetail}
    >
      {title && (
        <>
          <motion.h3 
            className={s.featureTitle}
            variants={titleVariants}
          >
            {title}
          </motion.h3>
          <motion.div 
            className={s.titleLine}
            variants={lineVariants}
          />
        </>
      )}
      <motion.p 
        className={s.featureContent}
        variants={contentVariants}
      >
        {showDetail ? content : content.slice(0, 100) + (content.length > 100 ? '...' : '')}
      </motion.p>
      
      {content.length > 100 && (
        <motion.div 
          className={s.expandIndicator}
          animate={{ rotate: showDetail ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="rgba(83, 82, 237, 0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      )}
      
      <motion.div 
        className={s.featureSideLine}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.1 }}
      />
      
      {/* Interactive glow effect that follows touch */}
      {isTouching && (
        <motion.div 
          className={s.touchGlow}
          style={{
            opacity: touchEnergy * 0.8,
            background: `radial-gradient(circle at center, rgba(83, 82, 237, 0.3) 0%, transparent 70%)`
          }}
        />
      )}
    </motion.div>
  );
};

export const MobileWhoWeAre = ({ features }) => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const containerRef = useRef(null);
  const controls = useAnimation();
  
  // Use layoutEffect false to prevent the warnings about ref not being hydrated
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false // Prevent hydration warnings
  });
  
  // Pre-calculate transform values
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);
  
  // Smoother scroll progress with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 15,
    stiffness: 100
  });
  
  // Pre-calculate parallax values for background elements
  const bgCircleY = useTransform(smoothProgress, [0, 1], [0, -100]);
  const bgLineOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.7, 0.3]);
  const particlesY = useTransform(smoothProgress, [0, 1], [0, -50]);
  const particlesRotate = useTransform(smoothProgress, [0, 1], [0, 10]);
  
  // Title animation with 3D effects
  const titleControls = useAnimation();
  const titleRef = useRef(null);
  
  useEffect(() => {
    if (!isMobile) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          titleControls.start({
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
              type: "spring",
              damping: 15,
              stiffness: 100
            }
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (titleRef.current) {
      observer.observe(titleRef.current);
    }
    
    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, [titleControls, isMobile]);
  
  // Only render on mobile
  if (!isMobile) return null;
  
  return (
    <motion.div 
      ref={containerRef}
      className={s.mobileWhoWeAre}
      style={{ 
        opacity, 
        scale,
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Enhanced background decorative elements */}
      <motion.div className={s.backgroundDecoration}>
        <motion.div 
          className={s.circle}
          style={{ y: bgCircleY }}
        />
        <motion.div 
          className={s.line}
          style={{ opacity: bgLineOpacity }}
        />
        <motion.div 
          className={s.particles}
          style={{ 
            y: particlesY,
            rotate: particlesRotate
          }}
        />
      </motion.div>
      
      {/* Enhanced title with 3D perspective */}
      <motion.div 
        className={s.titleContainer}
        ref={titleRef}
        initial={{ opacity: 0, y: 30, rotateX: 10 }}
        animate={titleControls}
        style={{ 
          transformStyle: "preserve-3d", 
          transformPerspective: "1000px"
        }}
      >
        <h2 className={s.sectionTitle}>Who we are</h2>
        <motion.div 
          className={s.titleUnderline}
          initial={{ width: 0 }}
          animate={{ width: "50%" }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        <motion.div 
          className={s.titleGlow}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            repeatType: "reverse"
          }}
        />
      </motion.div>
      
      {/* Features with enhanced animations */}
      <motion.div
        className={s.featuresContainer}
        style={{ y: y2 }}
      >
        {features.map((feature, index) => (
          <FeatureItem 
            key={index} 
            title={feature.title} 
            content={feature.content} 
            index={index} 
          />
        ))}
      </motion.div>
    </motion.div>
  );
}; 