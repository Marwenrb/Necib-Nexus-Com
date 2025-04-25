import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import cn from 'clsx'
import s from './join-nexus-club.module.scss'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// TypingText component for the animated typing effect
const TypingText = ({ text, className, delay = 0, speed = 0.04, onComplete }) => {
  const textRef = useRef(null)
  const cursorRef = useRef(null)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false
  )

  useEffect(() => {
    if (prefersReducedMotion.current) {
      setDisplayedText(text)
      setIsTyping(false)
      if (onComplete) onComplete()
      return
    }

    let currentIndex = 0
    const totalChars = text.length
    const textElement = textRef.current
    const cursorElement = cursorRef.current

    if (!textElement || !cursorElement) return

    // Reset
    setDisplayedText('')
    
    // Create typing timeline
    const typingTl = gsap.timeline({ 
      delay,
      onComplete: () => {
        setIsTyping(false)
        if (onComplete) setTimeout(onComplete, 300)
      }
    })

    // Type each character with a slight delay
    for (let i = 0; i < totalChars; i++) {
      typingTl.add(() => {
        currentIndex = i + 1
        setDisplayedText(text.substring(0, currentIndex))
      }, i * speed)
    }

    // Add blinking cursor after typing is complete
    typingTl.add(() => {
      gsap.to(cursorElement, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      })
    })

    return () => typingTl.kill()
  }, [text, delay, speed, onComplete])

  return (
    <div className={cn(s.typingContainer, className)}>
      {/* Accessible text for screen readers */}
      <span className={s.srOnly}>{text}</span>
      
      {/* Visible animated text */}
      <span ref={textRef} aria-hidden="true" className={s.typingText}>
        {displayedText}
        <span ref={cursorRef} className={cn(s.cursor, !isTyping && s.blinking)}>|</span>
      </span>
    </div>
  )
}

// Parallax text lines component
const ParallaxTextLines = ({ lines, className }) => {
  const containerRef = useRef(null)
  const linesRef = useRef([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const container = containerRef.current
    if (!container) return
    
    linesRef.current.forEach((line, index) => {
      if (!line) return
      
      const speed = 0.1 + (index * 0.05)
      
      gsap.to(line, {
        y: `${-30 * speed}%`,
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      })
    })
  }, [lines])

  return (
    <div ref={containerRef} className={cn(s.parallaxTextContainer, className)}>
      {lines.map((line, index) => (
        <div 
          key={index}
          ref={el => (linesRef.current[index] = el)}
          className={s.parallaxTextLine}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          {line}
        </div>
      ))}
    </div>
  )
}

// 3D tilt effect component
const TiltEffect = ({ children, className }) => {
  const tiltRef = useRef(null)
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const tiltElement = tiltRef.current
    if (!tiltElement) return
    
    let tiltX = 0
    let tiltY = 0
    let tiltAmount = 15 // Max tilt in degrees
    
    const handleMouseMove = (e) => {
      const rect = tiltElement.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Calculate tilt based on mouse position
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY
      
      tiltX = (mouseY / rect.height) * tiltAmount
      tiltY = (mouseX / rect.width) * -tiltAmount
      
      gsap.to(tiltElement, {
        rotationX: tiltX,
        rotationY: tiltY,
        duration: 0.5,
        ease: "power2.out"
      })
    }
    
    const handleMouseLeave = () => {
      gsap.to(tiltElement, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: "power2.out"
      })
    }
    
    tiltElement.addEventListener('mousemove', handleMouseMove)
    tiltElement.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      tiltElement.removeEventListener('mousemove', handleMouseMove)
      tiltElement.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])
  
  return (
    <div ref={tiltRef} className={cn(s.tiltContainer, className)}>
      {children}
    </div>
  )
}

// Main component
export const JoinNexusClubSection = () => {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const imageRef = useRef(null)
  const textContentRef = useRef(null)
  const formContentRef = useRef(null)
  const ctaButtonRef = useRef(null)
  const scrollPromptRef = useRef(null)
  const [scrollPhase, setScrollPhase] = useState(0)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      gsap.to(e.currentTarget, {
        scale: 0.95,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setSubmitted(true)
        }
      })
    }
  }
  
  // Handle typing animation completion
  const handleTypingComplete = () => {
    setTypingComplete(true)
    
    gsap.to(scrollPromptRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.5
    })
  }

  // Initialize smooth scrolling with Lenis (if available)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Initialize Lenis smooth scrolling if available in the project
    let lenis
    try {
      const Lenis = require('@studio-freight/lenis').default
      if (Lenis) {
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothTouch: false
        })
        
        // Integration with GSAP
        function raf(time) {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }
        
        requestAnimationFrame(raf)
      }
    } catch (err) {
      console.log('Lenis not available, using native scroll')
    }
    
    return () => {
      if (lenis) lenis.destroy()
    }
  }, [])

  // Setup 3D scrolling animations and effects
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const section = sectionRef.current
    const content = contentRef.current
    const image = imageRef.current
    const textContent = textContentRef.current
    const formContent = formContentRef.current
    
    if (!section || !content || !image || !textContent || !formContent) return

    // Initial animation: Fade in the image with scale effect
    gsap.fromTo(image, 
      { opacity: 0, scale: 1.2 },
      { 
        opacity: 1, 
        scale: 1.05,
        duration: 1.5, 
        ease: "power3.out",
        delay: 0.2 
      }
    )
    
    // Set up scroll-based animation
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Update scroll phase based on progress
          const progress = self.progress
          if (progress < 0.25) {
            setScrollPhase(0)
          } else if (progress < 0.6) {
            setScrollPhase(1)
          } else {
            setScrollPhase(2)
          }
        }
      },
    })
    
    // Scale and rotate the image as user scrolls
    scrollTl.to(image, {
      scale: 1.3,
      rotationZ: 3,
      y: "5%",
      filter: "brightness(0.7)",
      ease: "none",
    }, 0)
    
    // Parallax effect for text content - fade out earlier to prevent overlap
    scrollTl.to(textContent, {
      y: "-35%",
      opacity: 0,
      ease: "power2.in",
    }, 0.1)
    
    // Reveal form/club content as user scrolls down
    scrollTl.fromTo(formContent, 
      { y: "50%", opacity: 0 },
      { y: "0%", opacity: 1, ease: "power2.out" },
      0.25
    )
    
    // Clean up animations on unmount
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.container}>
        {/* 3D Image container with parallax effect */}
        <div className={s.sceneContainer}>
          <div ref={imageRef} className={s.imageWrapper}>
            <Image 
              src="/images/Club-Enter.jpeg" 
              alt="Join NEXUS Club - Digital Innovation Portal"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 100vw"
              className={s.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/favicon-32x32.png";
              }}
            />
            <div className={s.imageOverlay} />
            <div className={s.imageGradient} />
          </div>
          
          {/* Content container */}
          <div ref={contentRef} className={s.contentContainer}>
            {/* Initial text content (visible first) */}
            <div 
              ref={textContentRef} 
              className={cn(s.textContent, scrollPhase > 0 && s.hidden)}
            >
              <TypingText 
                text="Elevate Your Digital Presence | NEXUS" 
                className={s.mainTitle}
                delay={0.5}
                speed={0.04}
                onComplete={handleTypingComplete}
              />
              
              {typingComplete && (
                <div ref={scrollPromptRef} className={s.scrollPrompt}>
                  <div className={s.scrollIcon}>
                    <div className={s.chevron}></div>
                    <div className={s.chevron}></div>
                    <div className={s.chevron}></div>
                  </div>
                  <ParallaxTextLines 
                    lines={["Redefining Tomorrow's Digital Landscape"]} 
                    className={s.scrollTagline}
                  />
                </div>
              )}
            </div>
            
            {/* Join Nexus Club content (appears with scroll) */}
            <div 
              ref={formContentRef} 
              className={cn(s.formContent, scrollPhase > 0 && s.visible)}
            >
              <div className={s.formContainer}>
                {!submitted ? (
                  <form className={s.form} onSubmit={handleSubmit}>
                    <div className={s.formHeader}>
                      <h2 className={s.clubTitle}>Join NEXUS Club</h2>
                      <p className={s.clubDescription}>
                        Become part of an exclusive community where innovation meets luxury. 
                        The NEXUS Club offers unprecedented access to premium events, 
                        personalized services, and a network of industry pioneers.
                      </p>
                    </div>
                    <div className={s.formGroup}>
                      <label htmlFor="email">Company Email</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Email address"
                      />
                    </div>
                    <div className={s.formGroup}>
                      <label htmlFor="message">How can we elevate your business?</label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="3"
                      ></textarea>
                    </div>
                    <button 
                      ref={ctaButtonRef}
                      type="submit" 
                      className={s.formSubmitBtn}
                    >
                      Join Now
                    </button>
                  </form>
                ) : (
                  <div className={s.successMessage}>
                    <div className={s.successIcon}>
                      <svg viewBox="0 0 24 24">
                        <path 
                          d="M3,12 L9,18 L21,6" 
                          fill="none" 
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className={s.successContent}>
                      <h3>Thank you for joining the NEXUS Club!</h3>
                      <p>We'll be in touch soon with exclusive access to our premium services.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JoinNexusClubSection 