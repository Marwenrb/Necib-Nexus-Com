import React, { useState, useEffect, useRef } from 'react'
import cn from 'clsx'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Button } from 'components/button'
import { useInView } from 'react-intersection-observer'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import s from './join-nexus-club.module.scss'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const JoinNexusClubSection = () => {
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  // 3D effect variables
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  
  // Refs for elements
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const textRef = useRef(null)
  const formContainerRef = useRef(null)
  const titleRef = useRef(null)
  const parallaxRef = useRef(null)
  
  // Intersection observer
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  })
  
  // Scroll animation values
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  // Smooth spring animations
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [100, -100]), { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  })
  
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [0.9, 1.05]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 5]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0.6, 1, 1, 0.6])
  
  // Handlers
  const toggleForm = () => {
    setShowForm(prev => !prev)
  }
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (error) setError('')
  }
  
  const handleMouseMove = (e) => {
    if (!imageRef.current) return
    
    const rect = imageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setMousePosition({
      x: (x / rect.width - 0.5) * 20,
      y: (y / rect.height - 0.5) * 20
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    
    try {
      setSubmitting(true)
      setError('')
      
      // For testing purposes, simulate success without actual email sending
      setTimeout(() => {
        setSubmitted(true)
        setEmail('')
        setSubmitting(false)
        
        // Add success animation
        if (formContainerRef.current) {
          gsap.to(formContainerRef.current, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(formContainerRef.current, {
                scale: 1,
                duration: 0.3,
                ease: "elastic.out(1, 0.5)"
              })
            }
          })
        }
      }, 1000)
      
    } catch (err) {
      console.error('Failed to send email:', err)
      setError('Failed to submit. Please try again later.')
      setSubmitting(false)
    }
  }

  // Setup advanced GSAP animations
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const section = sectionRef.current
    const image = imageRef.current
    const text = textRef.current
    const title = titleRef.current
    
    if (!section || !image || !text || !title) return
    
    // Title animation using standard GSAP
    gsap.from(title.querySelectorAll('.char'), {
      opacity: 0,
      y: 80,
      stagger: 0.02,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    })
    
    // 3D parallax effect on scroll
    gsap.to(image, {
      rotateY: 15,
      rotateX: -10,
      scale: 1.1,
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "center center",
        scrub: true,
      }
    })
    
    // Floating animation for the image
    const floatingAnimation = gsap.timeline({ repeat: -1, yoyo: true })
    floatingAnimation.to(image, {
      y: "-=15",
      duration: 2,
      ease: "sine.inOut"
    }).to(image, {
      y: "+=15",
      duration: 2,
      ease: "sine.inOut"
    })
    
    // Create parallax layers
    if (parallaxRef.current) {
      const layers = parallaxRef.current.querySelectorAll(`.${s.parallaxLayer}`)
      layers.forEach((layer, index) => {
        const depth = index + 1
        const movement = -(depth * 10)
        
        gsap.to(layer, {
          y: movement,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        })
      })
    }
    
    // Particle effect
    const createParticles = () => {
      const particleContainer = document.createElement("div")
      particleContainer.className = s.particleContainer
      section.appendChild(particleContainer)
      
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement("div")
        particle.className = s.particle
        
        // Randomize particle properties
        const size = Math.random() * 6 + 2
        const posX = Math.random() * 100
        const posY = Math.random() * 100
        const delay = Math.random() * 2
        const duration = Math.random() * 10 + 10
        
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`
        particle.style.left = `${posX}%`
        particle.style.top = `${posY}%`
        particle.style.animationDelay = `${delay}s`
        particle.style.animationDuration = `${duration}s`
        
        particleContainer.appendChild(particle)
      }
    }
    
    createParticles()
    
    // Cleanup
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
      
      floatingAnimation.kill()
    }
  }, [])

  // Text variants for Framer Motion
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  }
  
  // Form animation variants
  const formVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: { duration: 0.2 }
    }
  }
  
  // 3D hover effect for image
  const imageTransform = isHovering ? {
    rotateX: mousePosition.y,
    rotateY: -mousePosition.x,
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" }
  } : {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }

  return (
    <section className={s.section} ref={sectionRef}>
      <div className={s.container} ref={ref}>
        <motion.div 
          className={s.content}
          style={{ opacity }}
        >
          <div className={s.parallaxContainer} ref={parallaxRef}>
            {/* Parallax Depth Layers */}
            <div className={`${s.parallaxLayer} ${s.parallaxBg}`}></div>
            <div className={`${s.parallaxLayer} ${s.parallaxGlow}`}></div>
            <div className={`${s.parallaxLayer} ${s.parallaxStars}`}></div>
            
            <motion.div 
              className={s.imageWrapper}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{ y, perspective: 1000 }}
            >
              <motion.div 
                className={s.imageOverlay}
                initial={{ scaleY: 1, originY: 0 }}
                animate={inView ? { scaleY: 0 } : { scaleY: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
              />
              
              <motion.div 
                className={s.image3DContainer}
                style={{
                  ...imageTransform,
                  transformStyle: "preserve-3d",
                }}
              >
                <img 
                  src="/images/Club-Enter.jpeg" 
                  alt="Join NEXUS Club"
                  className={s.mainImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/favicon-32x32.png";
                  }}
                />
                <div className={s.imageDepthLayer}></div>
                <div className={s.imageCaption}>
                  <span>EXPLORE</span>
                  <span>NEXUS</span>
                </div>
              </motion.div>
              
              <motion.div 
                className={s.glowEffect}
                animate={{ 
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <div className={s.imageShadow}></div>
            </motion.div>
          </div>
          
          <motion.div 
            className={s.textContent}
            ref={textRef}
            variants={textVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <h2 className={s.title} ref={titleRef}>
              <span className="char-wrapper">
                {Array.from("Join NEXUS Club").map((char, i) => (
                  <span key={i} className="char">
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            </h2>
            
            <motion.p 
              className={s.description}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Become part of an exclusive community where innovation meets luxury. 
              The NEXUS Club offers unprecedented access to premium events, 
              personalized services, and a network of industry pioneers.
            </motion.p>
            
            <motion.div 
              className={s.buttonWrapper}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={toggleForm} 
                className={s.joinButton}
              >
                <span className={s.buttonText}>{showForm ? 'Hide Form' : 'Join Now'}</span>
                <div className={s.buttonHighlight}></div>
              </Button>
            </motion.div>
            
            <AnimatePresence mode="wait">
              {showForm && (
                <motion.div 
                  className={s.formContainer}
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  ref={formContainerRef}
                >
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className={s.form}>
                      <div className={s.formHeader}>
                        <motion.span
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Enter Your Details
                        </motion.span>
                      </div>
                      
                      <div className={s.inputGroup}>
                        <motion.input
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="Your email address"
                          className={cn(s.input, error && s.inputError)}
                          disabled={submitting}
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        />
                        <AnimatePresence>
                          {error && (
                            <motion.p 
                              className={s.errorMessage}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {error}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Button 
                          onClick={handleSubmit}
                          className={s.submitButton}
                          disabled={submitting}
                        >
                          {submitting ? (
                            <motion.span 
                              className={s.loadingIndicator}
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              ⟳
                            </motion.span>
                          ) : 'Submit'}
                        </Button>
                      </motion.div>
                    </form>
                  ) : (
                    <motion.div 
                      className={s.successMessage}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 500,
                        damping: 25
                      }}
                    >
                      <motion.div className={s.successIcon}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 500,
                          damping: 25,
                          delay: 0.2
                        }}
                      >
                        <svg viewBox="0 0 24 24">
                          <motion.path
                            d="M3,12 L9,18 L21,6"
                            fill="transparent"
                            strokeWidth="2"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          />
                        </svg>
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        Thank you for joining the NEXUS Club!
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        We'll be in touch soon with exclusive access.
                      </motion.p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default JoinNexusClubSection 