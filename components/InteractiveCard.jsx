import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import styles from './InteractiveCard.module.scss'

const InteractiveCard = ({ image, title, content, inView, delay = 0 }) => {
  const cardRef = useRef(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  
  // Card tilt effect on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current || !isHovered) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX
    const mouseY = e.clientY
    
    // Calculate rotation based on mouse position relative to card center
    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 10
    const rotateX = ((centerY - mouseY) / (rect.height / 2)) * 10
    
    setRotation({ x: rotateX, y: rotateY })
  }
  
  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotation({ x: 0, y: 0 })
  }
  
  // Card entry animation
  const animationVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 15,
        delay,
      },
    },
  }
  
  return (
    <motion.div
      className={styles.cardContainer}
      ref={cardRef}
      variants={animationVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onAnimationComplete={() => setAnimationComplete(true)}
      style={{
        transform: `perspective(1500px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <div className={styles.imageContainer}>
            <Image
              src={image}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              className={styles.cardImage}
            />
            <div className={styles.imageOverlay}></div>
          </div>
          
          <div className={styles.cardContent}>
            <motion.h3
              className={styles.cardTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: animationComplete ? 1 : 0, 
                y: animationComplete ? 0 : 20 
              }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
            >
              {title}
            </motion.h3>
            
            <motion.p
              className={styles.cardDescription}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: animationComplete ? 1 : 0, 
                y: animationComplete ? 0 : 20 
              }}
              transition={{ duration: 0.5, delay: delay + 0.3 }}
            >
              {content}
            </motion.p>
            
            <motion.div
              className={styles.cardButton}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: animationComplete ? 1 : 0, 
                scale: animationComplete ? 1 : 0.8
              }}
              transition={{ duration: 0.5, delay: delay + 0.4 }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              Explore
            </motion.div>
          </div>
        </div>
        
        {/* 3D lighting effects */}
        <div 
          className={`${styles.cardLight} ${isHovered ? styles.active : ''}`}
          style={{
            background: `radial-gradient(
              circle at ${(rotation.y + 10) * 5 + 50}% ${(rotation.x + 10) * 5 + 50}%, 
              rgba(255, 255, 255, 0.15), 
              rgba(255, 255, 255, 0)
            )`
          }}
        ></div>
      </div>
    </motion.div>
  )
}

export default InteractiveCard 