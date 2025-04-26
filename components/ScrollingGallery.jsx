import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import styles from './ScrollingGallery.module.scss'

const ScrollingGallery = ({ items, inView }) => {
  const galleryRef = useRef(null)
  const trackRef = useRef(null)
  
  // Horizontal scroll effect with mouse/touch
  useEffect(() => {
    if (!galleryRef.current || !trackRef.current) return
    
    const gallery = galleryRef.current
    const track = trackRef.current
    
    let isDown = false
    let startX
    let scrollLeft
    
    const handleMouseDown = (e) => {
      isDown = true
      gallery.classList.add(styles.active)
      startX = e.pageX - gallery.offsetLeft
      scrollLeft = gallery.scrollLeft
    }
    
    const handleMouseLeave = () => {
      isDown = false
      gallery.classList.remove(styles.active)
    }
    
    const handleMouseUp = () => {
      isDown = false
      gallery.classList.remove(styles.active)
    }
    
    const handleMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - gallery.offsetLeft
      const walk = (x - startX) * 2 // Scroll speed
      gallery.scrollLeft = scrollLeft - walk
    }
    
    gallery.addEventListener('mousedown', handleMouseDown)
    gallery.addEventListener('mouseleave', handleMouseLeave)
    gallery.addEventListener('mouseup', handleMouseUp)
    gallery.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      gallery.removeEventListener('mousedown', handleMouseDown)
      gallery.removeEventListener('mouseleave', handleMouseLeave)
      gallery.removeEventListener('mouseup', handleMouseUp)
      gallery.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  
  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryWrapper} ref={galleryRef}>
        <motion.div 
          className={styles.galleryTrack}
          ref={trackRef}
          initial={{ x: 100, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              className={styles.galleryItem}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              whileHover={{ y: -10 }}
            >
              <div className={styles.itemImageContainer}>
                <Image 
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className={styles.itemImage}
                />
                <div 
                  className={styles.itemOverlay} 
                  style={{ 
                    background: `linear-gradient(135deg, ${item.color}33, ${item.color}66)`
                  }}
                ></div>
              </div>
              <div className={styles.itemContent}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemDescription}>{item.description}</p>
              </div>
              <div className={styles.itemHoverEffect}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <div className={styles.galleryScrollIndicator}>
        <div className={styles.scrollText}>Scroll Horizontally</div>
        <div className={styles.scrollArrows}>
          <span>←</span>
          <span>→</span>
        </div>
      </div>
    </div>
  )
}

export default ScrollingGallery 