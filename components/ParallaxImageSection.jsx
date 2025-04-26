import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import styles from './ParallaxImageSection.module.scss';

const ParallaxImageSection = ({ images, title, subtitle }) => {
  const containerRef = useRef(null);
  
  // Scroll-based animations using Framer Motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });
  
  // Transform values for parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -10]);
  const rotate3 = useTransform(scrollYProgress, [0, 1], [0, 5]);
  
  return (
    <div className={styles.section} ref={containerRef}>
      <motion.div 
        className={styles.textContent}
        style={{ opacity }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </motion.div>
      
      <div className={styles.imageContainer}>
        {images.map((image, index) => {
          // Choose different transform values based on index
          const yValue = index % 3 === 0 ? y1 : (index % 3 === 1 ? y2 : y3);
          const rotateValue = index % 3 === 0 ? rotate1 : (index % 3 === 1 ? rotate2 : rotate3);
          const delay = index * 0.1;
          
          return (
            <motion.div
              key={image.src}
              className={styles.imageWrapper}
              style={{ 
                y: yValue, 
                rotate: rotateValue,
                zIndex: images.length - index
              }}
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay }}
              viewport={{ once: true, margin: "-20%" }}
              whileHover={{ 
                scale: 1.05,
                rotate: 0,
                zIndex: 10,
                transition: { duration: 0.3 }
              }}
            >
              <div className={styles.imageInner}>
                <Image
                  src={image.src}
                  alt={image.alt || "Image"}
                  width={image.width || 500}
                  height={image.height || 300}
                  className={styles.image}
                />
                {image.caption && (
                  <div className={styles.caption}>{image.caption}</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ParallaxImageSection; 