import { useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import styles from './ParallaxScene.module.scss'

const ParallaxScene = ({ cursorPosition }) => {
  const sceneRef = useRef(null)
  
  // Elements with different parallax speeds
  const layers = [
    { src: '/images/e-tourism.jpeg', depth: 0.2, className: styles.layerBack },
    { src: '/images/Diverse Hands Showcasing HD Technology Display.jpeg', depth: 0.5, className: styles.layerMiddle },
    { src: '/images/Futuristic Visors.jpeg', depth: 0.8, className: styles.layerFront },
  ]
  
  const calculateParallax = (depth) => {
    const x = cursorPosition.x * depth * 50
    const y = cursorPosition.y * depth * 50
    return { x, y }
  }
  
  return (
    <div className={styles.scene} ref={sceneRef}>
      <div className={styles.sceneContent}>
        {layers.map((layer, index) => (
          <motion.div
            key={index}
            className={`${styles.parallaxLayer} ${layer.className}`}
            animate={{
              x: calculateParallax(layer.depth).x,
              y: calculateParallax(layer.depth).y,
            }}
            transition={{
              type: 'spring',
              stiffness: 60,
              damping: 20,
              mass: 0.5,
            }}
          >
            <div className={styles.layerImageContainer}>
              <Image
                src={layer.src}
                fill
                style={{ objectFit: 'cover' }}
                alt={`Parallax layer ${index + 1}`}
                priority={index === 2}
                className={styles.layerImage}
              />
            </div>
          </motion.div>
        ))}
        
        {/* Light effects */}
        <div className={styles.lightEffects}>
          <div className={styles.lightRay}></div>
          <div className={styles.lightRay}></div>
          <div className={styles.lightRay}></div>
        </div>
        
        {/* Floating particles */}
        <div className={styles.particles}>
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className={styles.particle}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 5 + 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ParallaxScene 