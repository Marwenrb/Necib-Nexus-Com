import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaHome, FaLongArrowAltLeft } from 'react-icons/fa'
import s from './back-to-home.module.scss'

export const BackToHome = ({ theme = 'light', position = 'top-left' }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  }

  const arrowVariants = {
    normal: { x: 0 },
    hover: { 
      x: -5,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 0.7
      }
    }
  }

  const circleVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: {
        duration: 0.3
      }
    }
  }

  const textVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.3,
        delay: 0.1
      }
    },
    hover: {
      x: -3,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <Link href="/" legacyBehavior>
      <a 
        className={`${s.backToHome} ${s[position]} ${s[theme]} ${scrolled ? s.scrolled : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Back to Home"
      >
        <motion.div 
          className={s.container}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <motion.div 
            className={s.iconCircle}
            variants={circleVariants}
          >
            <motion.div
              className={s.iconWrapper} 
              variants={arrowVariants}
              animate={isHovered ? "hover" : "normal"}
            >
              <FaLongArrowAltLeft className={s.icon} />
            </motion.div>
          </motion.div>
          
          <motion.span 
            className={s.text}
            variants={textVariants}
          >
            Back to Home
          </motion.span>
          
          <div className={s.glow}></div>
        </motion.div>
      </a>
    </Link>
  )
} 