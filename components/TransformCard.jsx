import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TransformCard.module.scss';

const TransformCard = ({ 
  title, 
  description, 
  image, 
  link, 
  index = 0,
  glowColor = 'rgba(124, 58, 237, 0.5)'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  // Get card dimensions on mount and window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (cardRef.current) {
        const { width, height } = cardRef.current.getBoundingClientRect();
        setCardDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Small delay before starting animation for a staggered effect
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timeout);
    };
  }, [index]);
  
  // Handle mouse move to calculate rotation
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const { left, top } = cardRef.current.getBoundingClientRect();
    
    // Get mouse position relative to card center
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    // Calculate position as percentage from center
    const xPercent = (x / cardDimensions.width - 0.5) * 2; // -1 to 1
    const yPercent = (y / cardDimensions.height - 0.5) * 2; // -1 to 1
    
    setMousePosition({ x: xPercent, y: yPercent });
  };
  
  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };
  
  // Card variants for entry animation
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={styles.transformCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={cardVariants}
    >
      <motion.div 
        className={styles.cardInner}
        style={{
          rotateY: isHovered ? mousePosition.x * 10 : 0,
          rotateX: isHovered ? -mousePosition.y * 10 : 0,
          transformStyle: 'preserve-3d'
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Card Background with Image */}
        <div className={styles.cardBg}>
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className={styles.cardImage}
          />
          <div 
            className={styles.cardOverlay}
            style={{
              background: isHovered 
                ? `linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4))`
                : `linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.7))`
            }}
          ></div>
        </div>
        
        {/* Card Content */}
        <div className={styles.cardContent}>
          <motion.h3 
            className={styles.cardTitle}
            style={{
              transform: isHovered ? 'translateZ(40px)' : 'translateZ(0px)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {title}
          </motion.h3>
          
          <motion.p 
            className={styles.cardDescription}
            style={{
              transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)'
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {description}
          </motion.p>
          
          <motion.div 
            className={styles.cardButton}
            style={{
              transform: isHovered ? 'translateZ(50px)' : 'translateZ(0px)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <Link href={link || "#"}>
              <span>Explore</span>
            </Link>
          </motion.div>
        </div>
        
        {/* 3D Light Effect */}
        <div 
          className={`${styles.cardLight} ${isHovered ? styles.active : ''}`}
          style={{
            background: `radial-gradient(
              circle at ${50 + mousePosition.x * 50}% ${50 + mousePosition.y * 50}%, 
              ${glowColor}, 
              rgba(0, 0, 0, 0)
            )`
          }}
        ></div>
        
        {/* Edge Reflections */}
        <div
          className={`${styles.cardEdge} ${styles.cardEdgeLeft} ${isHovered ? styles.active : ''}`}
          style={{
            opacity: isHovered ? 0.5 + mousePosition.x * 0.5 : 0
          }}
        ></div>
        <div
          className={`${styles.cardEdge} ${styles.cardEdgeRight} ${isHovered ? styles.active : ''}`}
          style={{
            opacity: isHovered ? 0.5 - mousePosition.x * 0.5 : 0
          }}
        ></div>
        <div
          className={`${styles.cardEdge} ${styles.cardEdgeTop} ${isHovered ? styles.active : ''}`}
          style={{
            opacity: isHovered ? 0.5 + mousePosition.y * 0.5 : 0
          }}
        ></div>
        <div
          className={`${styles.cardEdge} ${styles.cardEdgeBottom} ${isHovered ? styles.active : ''}`}
          style={{
            opacity: isHovered ? 0.5 - mousePosition.y * 0.5 : 0
          }}
        ></div>
      </motion.div>
    </motion.div>
  );
};

export default TransformCard; 