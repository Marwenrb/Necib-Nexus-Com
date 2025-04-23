import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useMediaQuery } from '@darkroom.engineering/hamo';
import cn from 'clsx';
import { motion, useInView, useAnimation, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import s from './who-we-are.module.scss';
import Lenis from '@studio-freight/lenis';
import { useStore } from '../../lib/store'; // Import useStore

// Ultra-premium neural network visualization with blue theme
const NeuralParticles = () => {
  const svgRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [animatedConnections, setAnimatedConnections] = useState(new Set());
  
  // Create neural network nodes and connections
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svgWidth = svgRef.current.clientWidth;
    const svgHeight = svgRef.current.clientHeight;
    
    // Generate 70 nodes (increased from 50 for more density)
    const newNodes = Array.from({ length: 70 }, (_, i) => {
      const x = Math.random() * svgWidth;
      const y = Math.random() * svgHeight;
      const radius = Math.random() * 1.5 + 1;
      
      // Assign different node types for varied colors
      const nodeType = Math.random() < 0.6 
        ? 'primaryNode' 
        : Math.random() < 0.8 
          ? 'secondaryNode' 
          : 'accentNode';
          
      // Make some nodes pulsate
      const isPulsating = Math.random() < 0.3;
      
      return { id: i, x, y, radius, nodeType, isPulsating };
    });
    
    // Generate connections between nodes
    const newConnections = [];
    let connectionId = 0; // Unique ID counter for connections
    
    newNodes.forEach((node, i) => {
      // Connect to 2-4 nearby nodes
      const connectionCount = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * newNodes.length);
        if (targetIndex !== i) {
          // Assign connection types for varied colors
          const connectionType = Math.random() < 0.6 
            ? 'primaryConnection' 
            : Math.random() < 0.8 
              ? 'secondaryConnection' 
              : 'accentConnection';
          
          // Use a unique ID for each connection instead of source-target pattern
          // This prevents duplicate keys when multiple connections between same nodes
          connectionId++;
              
          newConnections.push({
            id: `connection-${connectionId}`,
            source: i,
            target: targetIndex,
            connectionType
          });
        }
      }
    });
    
    setNodes(newNodes);
    setConnections(newConnections);
    
    // Animate random connections
    const interval = setInterval(() => {
      setAnimatedConnections(prev => {
        const newSet = new Set(prev);
        const randomConnection = newConnections[Math.floor(Math.random() * newConnections.length)];
        
        if (randomConnection) {
          if (newSet.has(randomConnection.id)) {
            newSet.delete(randomConnection.id);
          } else {
            newSet.add(randomConnection.id);
          }
        }
        
        return newSet;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={s.neuralNetworkContainer}>
      <svg ref={svgRef} className={s.neuralNetwork} width="100%" height="100%">
        {/* Render connections */}
        {connections.map(connection => {
          const source = nodes[connection.source];
          const target = nodes[connection.target];
          if (!source || !target) return null;
          
          const isActive = animatedConnections.has(connection.id);
          const connectionClass = `${s.neuralConnection} ${isActive ? s.activeConnection : ''} ${s[connection.connectionType] || ''}`;
          
          return (
            <line
              key={connection.id}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              className={connectionClass}
            />
          );
        })}
        
        {/* Render nodes */}
        {nodes.map(node => {
          const nodeClass = `${s.neuralNode} ${node.isPulsating ? s.pulsatingNode : ''} ${s[node.nodeType] || ''}`;
          
          return (
            <circle
              key={node.id}
              cx={node.x}
              cy={node.y}
              r={node.radius}
              className={nodeClass}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Advanced AI-themed decorative element with enhanced pulse animations
const AIPulseEffect = ({ delay = 0, size = 'medium', color = 'blue' }) => {
  const generateRings = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <motion.div
        key={i}
        className={cn(s.pulseRing, {
          [s.pulseLarge]: size === 'large',
          [s.pulseSmall]: size === 'small',
          [s.pulseBlue]: color === 'blue',
          [s.pulseSecondary]: color === 'secondary',
          [s.pulseAccent]: color === 'accent'
        })}
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ 
          scale: [0, 1.5], 
          opacity: [0.8, 0] 
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: delay + i * 0.4,
          ease: "easeOut"
        }}
      />
    ));
  };
  
  return (
    <div className={s.aiPulseContainer}>
      {generateRings(3)}
    </div>
  );
};

// Premium blue glass scrolling card with directional animations
const FeatureItem = ({ title, content, index, isMobile, isTablet, direction }) => {
  const ref = useRef(null);
  const cardRef = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2, margin: "-50px 0px" });
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Determine scroll direction class for ultra-premium animation
  const scrollClass = useMemo(() => {
    if (direction === 'left') return s.scrollLeftCard;
    if (direction === 'right') return s.scrollRightCard;
    return '';
  }, [direction]);
  
  // Scroll position tracking for parallax and directional effects
  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const scrollPercentage = 1 - (rect.top / window.innerHeight);
        setScrollPosition(scrollPercentage);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Touch interaction states for mobile with enhanced effects
  const [touchInfo, setTouchInfo] = useState({ 
    isTouching: false, 
    energy: 0, 
    rotation: { x: 0, y: 0 },
    position: { x: 0, y: 0 }
  });
  
  // Handle touch interactions for mobile with improved feedback
  const handleTouchStart = (e) => {
    setTouchInfo(prev => ({
      ...prev,
      isTouching: true,
      startPosition: { x: e.touches[0].clientX, y: e.touches[0].clientY },
      position: { x: 0, y: 0 }
    }));
    
    // Enhanced haptic feedback
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(3);
    }
  };
  
  const handleTouchMove = (e) => {
    if (!touchInfo.isTouching || !touchInfo.startPosition) return;
    
    const deltaX = e.touches[0].clientX - touchInfo.startPosition.x;
    const deltaY = e.touches[0].clientY - touchInfo.startPosition.y;
    
    // Calculate touch energy (intensity) with more responsiveness
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const energy = Math.min(distance / 80, 1); // More sensitive
    
    setTouchInfo(prev => ({
      ...prev,
      energy,
      rotation: { x: deltaY * -0.07, y: deltaX * 0.07 }, // Enhanced rotation
      position: { x: deltaX * 0.1, y: deltaY * 0.1 } // Enhanced movement
    }));
    
    // Prevent scrolling when touch movement is significant
    if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
      e.preventDefault();
    }
  };
  
  const handleTouchEnd = () => {
    setTouchInfo({ 
      isTouching: false, 
      energy: 0, 
      rotation: { x: 0, y: 0 },
      position: { x: 0, y: 0 }
    });
    
    // Light haptic feedback on release
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(2);
    }
  };
  
  // Toggle expanded state for content with improved animation
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    
    // Enhanced haptic feedback pattern on expand/collapse
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(isExpanded ? [3, 5] : [3, 10, 5]);
    }
  };

  // Ultra-premium spring animation settings for more bounce
  const springConfig = { 
    type: "spring", 
    damping: 12, // Lower damping for more bounce
    stiffness: 100, // Higher stiffness for faster response
    mass: 1,
    restDelta: 0.001
  };
  
  // Enhanced animation variants for ultra-premium scroll reveal
  const containerVariants = {
    hidden: direction === 'left' 
      ? { opacity: 0, x: -80, rotateY: 15 } 
      : { opacity: 0, x: 80, rotateY: -15 },
    visible: { 
      opacity: 1, 
      x: 0,
      rotateY: 0,
      scale: 1,
      transition: { 
        ...springConfig,
        delay: index * 0.15
      }
    },
    exit: direction === 'left'
      ? { opacity: 0, x: -80, rotateY: 15 }
      : { opacity: 0, x: 80, rotateY: -15 }
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: springConfig }
  };

  // Dynamic style properties for scroll-based animations and directional movement
  const getFeatureStyles = () => {
    // Calculate scroll-based transforms
    const scrollProgress = Math.max(0, Math.min(1, scrollPosition));
    const directionFactor = direction === 'left' ? -1 : 1;
    const scrollRotateY = isInView ? 0 : directionFactor * 15;
    const scrollTranslateX = isInView ? 0 : directionFactor * 50;
    
    // Base styles with enhanced 3D transform
    const styles = {
      transform: `
        perspective(1200px) 
        rotateX(${touchInfo.rotation.x}deg) 
        rotateY(${touchInfo.rotation.y + scrollRotateY}deg)
        translateZ(${touchInfo.isTouching ? 25 : 0}px)
        translateX(${touchInfo.position.x + scrollTranslateX * (1 - scrollProgress)}px)
        translateY(${touchInfo.position.y}px)
        scale(${isInView ? 1 : 0.95})
      `,
      boxShadow: `
        0 15px 35px rgba(0, 0, 0, ${0.1 + touchInfo.energy * 0.2}),
        0 5px 15px rgba(0, 122, 255, ${0.08 + touchInfo.energy * 0.2})
      `,
      border: `1px solid rgba(255, 255, 255, ${0.08 + touchInfo.energy * 0.15})`,
      zIndex: touchInfo.isTouching ? 10 : 1,
      opacity: isInView ? 1 : 0.3,
      transition: touchInfo.isTouching ? 'none' : 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
    };
    
    // Add enhanced desktop hover effects
    if (!isMobile && isHovered) {
      styles.transform = `
        perspective(1200px) 
        translateY(-12px) 
        translateZ(30px)
        rotateX(3deg)
        rotateY(${directionFactor * 3}deg)
      `;
      styles.boxShadow = `
        0 25px 50px rgba(0, 0, 0, 0.18), 
        0 15px 35px rgba(0, 122, 255, 0.18),
        0 0 20px rgba(0, 122, 255, 0.12) inset
      `;
      styles.border = `1px solid rgba(255, 255, 255, 0.2)`;
    }
    
    // Add expanded state styles with enhanced elevation
    if (isExpanded) {
      styles.transform = `
        perspective(1200px) 
        translateY(-8px) 
        translateZ(15px)
      `;
      styles.boxShadow = `
        0 20px 40px rgba(0, 0, 0, 0.15), 
        0 10px 30px rgba(0, 122, 255, 0.12),
        0 0 12px rgba(0, 122, 255, 0.08) inset
      `;
    }
    
    return styles;
  };

  // Enhanced motion blur effect when moving
  const blurAmount = useMemo(() => {
    if (touchInfo.isTouching) {
      return Math.min(Math.abs(touchInfo.rotation.x) + Math.abs(touchInfo.rotation.y), 7);
    }
    return 0;
  }, [touchInfo]);

  // Enhanced spring-based animations for hover effects
  const hoverScale = useSpring(1, springConfig);
  const glowOpacity = useSpring(0, springConfig);
  
  useEffect(() => {
    if (isHovered || touchInfo.isTouching) {
      hoverScale.set(1.03);
      glowOpacity.set(0.9);
    } else {
      hoverScale.set(1);
      glowOpacity.set(0);
    }
  }, [isHovered, touchInfo.isTouching, hoverScale, glowOpacity]);

  return (
    <motion.div
      ref={ref}
      className={cn(s.featureItem, scrollClass, {
        [s.expanded]: isExpanded,
        [s.touching]: touchInfo.isTouching,
        [s.withTitle]: !!title,
        [s.hovered]: isHovered,
        [s.firstItem]: index === 0,
        [s.inView]: isInView
      })}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{
        ...getFeatureStyles(),
        filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none'
      }}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      onClick={isMobile && content.length > 100 ? handleExpand : undefined}
      whileHover={{ scale: isMobile ? 1 : 1.03 }}
      whileTap={isMobile ? { scale: 0.98 } : undefined}
    >
      {/* Ultra-premium frosted glass effect layer */}
      <div className={s.glassLayer}></div>
      
      {/* Enhanced blue-themed decorative elements */}
      <div className={s.aiDecorationContainer}>
        <div className={s.aiDecoration} />
      </div>
      
      {/* Title with enhanced blue theme underline effect */}
      {title && (
        <motion.div className={s.titleWrapper} variants={childVariants}>
          <h3 className={s.featureTitle}>{title}</h3>
          <motion.div 
            className={s.titleUnderline}
            animate={{ 
              width: isHovered || touchInfo.isTouching || isExpanded ? "80%" : "40%",
              opacity: isHovered || touchInfo.isTouching || isExpanded ? 1 : 0.7,
              background: isHovered || touchInfo.isTouching ? 
                'linear-gradient(90deg, var(--neon-blue), var(--neon-accent), transparent)' : 
                'linear-gradient(90deg, var(--neon-blue), transparent)'
            }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      )}
      
      {/* Content with enhanced expand/collapse functionality */}
      <motion.div className={s.contentWrapper} variants={childVariants}>
        <p className={s.featureContent}>
          {isMobile && !isExpanded && content.length > 100
            ? content.substring(0, 100) + "..."
            : content
          }
        </p>
      </motion.div>
      
      {/* Enhanced expand indicator for mobile */}
      {isMobile && content.length > 100 && (
        <motion.div 
          className={s.expandIndicator}
          animate={{ 
            rotate: isExpanded ? 180 : 0,
            backgroundColor: isExpanded ? 'rgba(0, 122, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)'
          }}
          transition={{ duration: 0.3 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path 
              d="M6 9L12 15L18 9" 
              stroke="rgba(0, 122, 255, 0.8)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}
      
      {/* Enhanced decorative elements with blue theme */}
      <motion.div 
        className={s.decorativeLine}
        initial={{ scaleY: 0 }}
        animate={{ 
          scaleY: 1,
          background: isHovered || touchInfo.isTouching ? 
            'linear-gradient(to bottom, var(--neon-blue), var(--neon-accent), transparent)' : 
            'linear-gradient(to bottom, var(--neon-blue), transparent 90%)'
        }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
      />
      
      {/* Enhanced AI-themed ring pulse effect with blue theme */}
      <AIPulseEffect 
        delay={index * 0.2} 
        size={index % 3 === 0 ? 'large' : index % 3 === 1 ? 'medium' : 'small'}
        color={index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'secondary' : 'accent'}
      />
      
      {/* Enhanced premium blue glow effect */}
      <motion.div 
        className={s.glowEffect}
        style={{ opacity: glowOpacity }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Enhanced premium glass shine effect */}
      <div className={s.holographicShine} />
      
      {/* Enhanced interactive blue-themed particles */}
      <motion.div 
        className={s.particleEffect}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered || touchInfo.isTouching ? 0.8 : 0.5 }}
        transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
      />
      
      {/* Enhanced reveal flash effect for premium feel */}
      <motion.div 
        className={s.revealFlash}
        initial={{ opacity: 0.8, x: direction === 'left' ? '-100%' : '100%' }}
        animate={{ opacity: 0, x: direction === 'left' ? '100%' : '-100%' }}
        transition={{ duration: 0.8, delay: index * 0.1 }}
      />
    </motion.div>
  );
};

const PremiumCard = ({ title, content, index, isMobile, isTablet, direction }) => {
  // Check if this is the primary card (first one without a title)
  const isPrimaryCard = index === 0 && !title;
  
  // Hooks and state management for advanced animations
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [touchMovePos, setTouchMovePos] = useState({ x: 0, y: 0 });
  const [scrollDirection, setScrollDirection] = useState(null);
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  // Enhanced inView detection with thresholds for better animation timing
  const isInView = useInView(cardRef, { 
    once: false, 
    amount: isPrimaryCard ? 0.2 : 0.3, // Primary card appears earlier
    rootMargin: isPrimaryCard ? "-5% 0px" : "-10% 0px" 
  });

  // Enhanced 3D rotation effect based on mouse position
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  
  // Enhanced particle system for premium effect
  const [particles, setParticles] = useState([]);
  
  // Generate particles on mount with more particles for primary card
  useEffect(() => {
    if (!isMobile) {
      const particleCount = isPrimaryCard ? 15 : 10;
      const newParticles = Array(particleCount).fill().map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (isPrimaryCard ? 4 : 3) + 1,
        opacity: Math.random() * 0.5 + (isPrimaryCard ? 0.2 : 0.1),
        speed: Math.random() * 0.5 + (isPrimaryCard ? 0.3 : 0.2)
      }));
      setParticles(newParticles);
    }
  }, [isMobile, isPrimaryCard]);

  // Handle mouse move for enhanced 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate rotation based on distance from center - more pronounced for primary card
    const rotateYValue = ((mouseX - centerX) / (rect.width / 2)) * (isPrimaryCard ? 6 : 5);
    const rotateXValue = ((centerY - mouseY) / (rect.height / 2)) * (isPrimaryCard ? 6 : 5);
    
    // Calculate glow position for dynamic lighting effect
    const glowX = ((mouseX - rect.left) / rect.width) * 100;
    const glowY = ((mouseY - rect.top) / rect.height) * 100;
    
    // Apply smooth transitions to rotations and glow
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setGlowPos({ x: glowX, y: glowY });
  };

  // Reset card on mouse leave
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlowPos({ x: 50, y: 50 });
    setIsHovered(false);
  };
  
  // Touch event handlers with enhanced fluid animations
  const handleTouchStart = (e) => {
    if (!cardRef.current) return;
    
    setIsTouching(true);
    setTouchStartPos({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
    setTouchMovePos({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };
  
  const handleTouchMove = (e) => {
    if (!cardRef.current || !isTouching) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    setTouchMovePos({
      x: touchX,
      y: touchY
    });
    
    // Dynamic 3D effect based on touch movement
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const touchPosX = touchX - rect.left;
    const touchPosY = touchY - rect.top;
    
    // Calculate rotation with dampened effect for smoother feel
    const rotateYValue = ((touchPosX - centerX) / centerX) * (isPrimaryCard ? 6 : 5);
    const rotateXValue = ((centerY - touchPosY) / centerY) * (isPrimaryCard ? 6 : 5);
    
    // Smoothly update rotations
    setRotateX(rotateXValue * 0.5); // Dampened for touch
    setRotateY(rotateYValue * 0.5); // Dampened for touch
    
    // Update glow position
    const glowX = (touchPosX / rect.width) * 100;
    const glowY = (touchPosY / rect.height) * 100;
    setGlowPos({ x: glowX, y: glowY });
  };
  
  const handleTouchEnd = () => {
    setIsTouching(false);
    // Smooth return to default position
    const resetAnimation = {
      rotateX: 0,
      rotateY: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 150
      }
    };
    
    // Use setTimeout to create a delayed reset effect
    setTimeout(() => {
      setRotateX(0);
      setRotateY(0);
      setGlowPos({ x: 50, y: 50 });
    }, 150);
  };
  
  // Toggle expanded state with smooth animations
  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Animation for particles
  useEffect(() => {
    if (isMobile || particles.length === 0) return;
    
    const animateParticles = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => ({
          ...particle,
          y: (particle.y - particle.speed) % 100,
          opacity: isHovered || isTouching ? 
            Math.min(particle.opacity * 1.05, isPrimaryCard ? 0.8 : 0.7) : 
            Math.max(particle.opacity * 0.98, isPrimaryCard ? 0.2 : 0.1)
        }))
      );
    };
    
    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [particles, isHovered, isTouching, isMobile, isPrimaryCard]);
  
  // Dynamic styles with enhanced premium effects
  const cardStyle = {
    transform: `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateZ(0)
      scale(${isHovered || isTouching ? (isPrimaryCard ? 1.03 : 1.02) : 1})
    `,
    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
  };
  
  // Dynamic glow effect style - enhanced for primary card
  const glowStyle = {
    background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, 
      rgba(0, 122, 255, ${isPrimaryCard ? 0.5 : 0.4}) 0%, 
      rgba(0, 0, 0, 0) ${isPrimaryCard ? 80 : 70}%)`,
    opacity: isHovered || isTouching ? 1 : (isPrimaryCard ? 0.3 : 0.2),
    transition: 'opacity 0.3s ease'
  };
  
  // Animation variants for scroll-based entrance
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: isPrimaryCard ? 20 : 30,
      rotateY: direction === 'left' ? 15 : -15,
      rotateX: isPrimaryCard ? 3 : 5
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: isPrimaryCard ? 12 : 15,
        stiffness: isPrimaryCard ? 45 : 50,
        delay: isPrimaryCard ? 0.1 : index * 0.1
      }
    }
  };
  
  // Content revealing animation
  const contentVariants = {
    collapsed: {
      height: isMobile ? 
        (isPrimaryCard ? "110px" : "85px") : 
        (isPrimaryCard ? "150px" : "120px"),
      overflow: "hidden"
    },
    expanded: {
      height: "auto",
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] // Custom curve for premium feel
      }
    }
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={cn(
        s.premiumCard,
        isPrimaryCard && s.primaryCard,
        isHovered && s.hovered,
        isTouching && s.touching,
        isExpanded && s.expanded,
        isInView && s.inView,
        direction === 'left' ? s.fromLeft : s.fromRight
      )}
      style={cardStyle}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Premium glow effect */}
      <div className={s.premiumGlow} style={glowStyle} />
      
      {/* Interactive particles */}
      {!isMobile && particles.map(particle => (
        <div
          key={particle.id}
          className={cn(s.particle, isPrimaryCard && s.primaryParticle)}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: isHovered || isTouching ? particle.opacity * 1.5 : particle.opacity
          }}
        />
      ))}
      
      {/* Premium decorative elements */}
      <div className={cn(s.decorativeCorner, isPrimaryCard && s.primaryCorner)} />
      <div className={cn(s.decorativeLine, isPrimaryCard && s.primaryLine)} />
      
      {/* Card content */}
      <div className={s.cardContent}>
        {isPrimaryCard ? (
          <div className={s.primaryCardContent}>
            <div className={s.companyLogo}>
              <motion.div 
                className={s.logoGlow}
                animate={{ 
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.1, 1] 
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
              <motion.span
                className={s.logoText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Necib Nexus
              </motion.span>
            </div>
            <motion.div 
              className={s.premiumDivider}
              initial={{ width: "30%" }}
              animate={{ width: isHovered || isTouching ? "80%" : "50%" }}
              transition={{ duration: 0.5 }}
            />
            <motion.p 
              className={s.premiumPrimaryContent}
              variants={contentVariants}
              initial="collapsed"
              animate={isExpanded ? "expanded" : "collapsed"}
            >
              {content}
            </motion.p>
          </div>
        ) : (
          <>
            <div className={s.titleWrapper}>
              <h3 className={s.premiumTitle}>{title}</h3>
              <motion.div 
                className={s.titleUnderline}
                initial={{ width: "30%" }}
                animate={{ width: isHovered || isTouching ? "70%" : "30%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
            
            <motion.div 
              className={s.contentWrapper}
              variants={contentVariants}
              initial="collapsed"
              animate={isExpanded ? "expanded" : "collapsed"}
              ref={contentRef}
            >
              <p className={s.premiumContent}>{content}</p>
            </motion.div>
          </>
        )}
        
        {/* Expansion control for mobile */}
        {isMobile && (
          <motion.div 
            className={cn(s.expandControl, isPrimaryCard && s.primaryExpandControl)}
            onClick={handleExpand}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? "−" : "+"}
            </motion.div>
          </motion.div>
        )}
      </div>
      
      {/* Premium accent decorations */}
      <div className={cn(s.accentCircle, isPrimaryCard && s.primaryAccent)} />
      <div className={cn(s.accentDot, isPrimaryCard && s.primaryDot)} />
      
      {/* Special decorations for primary card */}
      {isPrimaryCard && (
        <>
          <div className={s.cornerDecoration} />
          <motion.div 
            className={s.pulsingRing}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </>
      )}
    </motion.div>
  );
};

// Initialize Lenis for ultra-smooth scrolling
const initLenis = () => {
  if (typeof window === 'undefined') return null;
  
  // Use the imported Lenis package
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    // Add classes to match our CSS module naming
    smoothClass: s.lenisSmooth,
    smoothWheel: true,
  });
  
  // Integrate with RAF for smoother performance
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  
  requestAnimationFrame(raf);
  return lenis;
};

export const WhoWeAre = ({ features }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [lenisInstance, setLenisInstance] = useState(null);
  const existingLenis = useStore((state) => state.lenis); // Get existing Lenis instance if available
  
  // Initialize smooth scrolling with Lenis only if not already available
  useEffect(() => {
    // Only initialize a new Lenis instance if there isn't one already
    if (!existingLenis) {
      const lenis = initLenis();
      setLenisInstance(lenis);
      
      return () => {
        if (lenis) {
          lenis.destroy();
        }
      };
    } else {
      // Use the existing Lenis instance
      setLenisInstance(existingLenis);
    }
  }, [existingLenis]);
  
  // Scroll-linked section visibility
  const isInView = useInView(sectionRef, { once: false, amount: 0.05 });
  const titleInView = useInView(titleRef, { once: false, amount: 0.2 });
  const contentInView = useInView(contentRef, { once: false, amount: 0.1 });
  
  // Ultra-premium scroll-linked animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Enhanced smooth scroll physics for premium feel
  const smoothProgress = useSpring(scrollYProgress, { 
    damping: 10, // Lower damping for more bounce
    stiffness: 100, // Higher stiffness for faster response
    restDelta: 0.001
  });
  
  // Enhanced parallax values for premium blue theme
  const backgroundParallax = useTransform(smoothProgress, [0, 1], [0, -50]);
  const titleParallax = useTransform(smoothProgress, [0, 1], [0, -20]);
  const contentParallax = useTransform(smoothProgress, [0, 0.5, 1], [10, 0, -20]);
  const neuralParallax = useTransform(smoothProgress, [0, 1], [30, -30]);
  
  // Enhanced 3D rotation for blue theme
  const titleRotate = useTransform(smoothProgress, [0, 1], [1, -1]);
  
  // Advanced animation controls for ultra-premium scrolling effects
  const titleControls = useAnimation();
  const contentControls = useAnimation();
  
  // Animate title with blue theme
  useEffect(() => {
    titleControls.start({
      opacity: titleInView ? 1 : 0.8,
      y: titleInView ? 0 : 10,
      transition: { 
        type: "spring", 
        damping: 10,
        stiffness: 80,
        delay: 0.1 
      }
    });
  }, [titleInView, titleControls]);
  
  // Animate content with staggered blue theme effects
  useEffect(() => {
    contentControls.start({
      opacity: contentInView ? 1 : 0.8,
      y: contentInView ? 0 : 20,
      transition: { 
        type: "spring", 
        damping: 15,
        stiffness: 60,
        delay: 0.1
      }
    });
  }, [contentInView, contentControls]);

  return (
    <section className={s.whoWeAreSection} ref={sectionRef}>
      {/* Premium blue-themed neural network background */}
      <NeuralParticles />
      
      {/* Premium blue background gradient with enhanced transparency */}
      <div className={s.blueBackgroundGradient} />
      
      {/* Enhanced background elements with premium blue theme */}
      <motion.div 
        className={s.backgroundElements}
        style={{ y: backgroundParallax }}
      >
        <div className={s.gradientOrb} />
        <div className={s.blurredCircle} />
        <div className={s.subtleLine} />
        
        {/* Enhanced premium blue grid elements */}
        <div className={s.aiGrid}>
          <div className={s.gridLine} />
          <div className={s.gridLine} />
          <div className={s.gridLine} />
        </div>
        
        <motion.div 
          className={s.floatingElements}
          style={{ y: neuralParallax }}
        >
          <div className={s.floatingCircle} />
          <div className={s.floatingSquare} />
          <div className={s.floatingTriangle} />
        </motion.div>
      </motion.div>
      
      <div className={cn("layout-grid", s.content)}>
        {/* Section title with premium blue animation */}
        <motion.div 
          className={s.titleContainer}
          ref={titleRef}
          initial={{ opacity: 1, y: 0 }}
          animate={titleControls}
          style={{ 
            y: titleParallax,
            rotateX: titleRotate
          }}
        >
          <div className={s.titleBackground}>
            <div className={s.titleGlow} />
          </div>
          
          <h2 className={s.sectionTitle}>
            Who we <span className={s.accentText}>are</span>
          </h2>
          
          <motion.div 
            className={s.mainUnderline}
            initial={{ width: "80px" }}
            animate={titleInView ? { width: "120px" } : { width: "80px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          
          {/* Premium blue-themed decorative elements for title */}
          <motion.div 
            className={s.titleDecoration}
            initial={{ opacity: 0.8, scale: 0.9 }}
            animate={titleInView ? { opacity: 1, scale: 1 } : { opacity: 0.8, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className={s.circle} />
            <div className={s.circle} />
            <div className={s.circle} />
          </motion.div>
        </motion.div>
        
        {/* Features grid with ultra-premium directional card animations */}
        <motion.div 
          className={s.featuresGrid}
          ref={contentRef}
          initial={{ opacity: 1, y: 0 }}
          animate={contentControls}
          style={{ y: contentParallax }}
        >
          {features?.map((feature, index) => (
            <PremiumCard
              key={index}
              title={feature.title}
              content={feature.content}
              index={index}
              isMobile={isMobile}
              isTablet={isTablet}
              direction={index % 2 === 0 ? 'left' : 'right'} // Alternating directions for premium effect
            />
          )) || null}
        </motion.div>
      </div>
      
      {/* Premium blue-themed floating particles */}
      <motion.div 
        className={s.particles}
        initial={{ opacity: 0.5 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0.5 }}
        transition={{ duration: 1 }}
      />
      
      {/* Premium blue accent elements */}
      <div className={s.accentElements}>
        <motion.div 
          className={s.accentLine}
          initial={{ scaleX: 0.5 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0.5 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />
        <motion.div 
          className={s.accentDot}
          initial={{ scale: 0.5 }}
          animate={isInView ? { scale: [0.5, 1.5, 1] } : { scale: 0.5 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </div>
      
      {/* Ultra-premium scroll indicator with blue theme */}
      <motion.div 
        className={s.scrollIndicator}
        initial={{ opacity: 0.5, y: -10 }}
        animate={{ 
          opacity: [0.5, 0.8, 0.5], 
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatType: "loop" 
        }}
      >
        <svg width="30" height="48" viewBox="0 0 30 48" fill="none">
          <rect x="1" y="1" width="28" height="46" rx="14" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
          <motion.circle 
            cx="15" 
            cy="15" 
            r="6" 
            fill="var(--neon-blue)"
            animate={{ y: [0, 15, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </svg>
      </motion.div>
    </section>
  );
};

export default WhoWeAre; 