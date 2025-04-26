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

// TypingText component for the animated typing effect with scroll synchronization
const TypingText = ({ text, className, delay = 0, speed = 0.035, onComplete }) => {
  const textRef = useRef(null)
  const cursorRef = useRef(null)
  const containerRef = useRef(null)
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

    const totalChars = text.length
    const textElement = textRef.current
    const cursorElement = cursorRef.current
    const container = containerRef.current

    if (!textElement || !cursorElement || !container) return

    // Reset
    setDisplayedText('')
    
    // Create advanced typing timeline with scroll synchronization
    const typingTl = gsap.timeline({ 
      delay,
      onComplete: () => {
        setIsTyping(false)
        if (onComplete) setTimeout(onComplete, 200)
      }
    })

    // Type each character with a scroll-aware implementation
    typingTl.to(textElement, {
      duration: speed * totalChars,
      onUpdate: function() {
        const progress = this.progress()
        const charIndex = Math.floor(progress * totalChars)
        setDisplayedText(text.substring(0, charIndex + 1))
      },
      ease: "none"
    })

    // Add scroll-reactive cursor animation
    typingTl.add(() => {
      gsap.to(cursorElement, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      })
    })

    // Add scroll trigger to synchronize with page scrolling
    ScrollTrigger.create({
      trigger: container,
      start: "top 80%",
      onEnter: () => {
        if (typingTl.progress() === 0) {
          typingTl.play(0)
        }
      },
      onLeaveBack: () => {
        if (typingTl.progress() > 0 && typingTl.progress() < 1) {
          typingTl.pause()
        }
      }
    })

    return () => {
      typingTl.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === container) {
          st.kill()
        }
      })
    }
  }, [text, delay, speed, onComplete])

  return (
    <div ref={containerRef} className={cn(s.typingContainer, className)} aria-live="polite">
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
      duration: 0.8,
      ease: "power2.out",
      delay: 0.2
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
    
    // Make sure typing text is visible initially
    gsap.set(textContent, { opacity: 1, y: 0 })
    
    // Create a timeline for typing text exit to ensure it completes before the form appears
    const typingExitTl = gsap.timeline({
      paused: true,
      defaults: {ease: "power2.inOut"}
    })
    
    typingExitTl.to(textContent, {
      y: "-30%",
      opacity: 0,
      duration: 0.4,
    })
    
    // Set up scroll-based animation with improved performance
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 0.1, // Smoother scrubbing for better performance
        pin: true,
        anticipatePin: 1,
        fastScrollEnd: true, // Improve performance during fast scrolling
        onUpdate: (self) => {
          // Update scroll phase based on progress with smoother transitions
          const progress = self.progress
          if (progress < 0.1) {
            if (scrollPhase !== 0) {
              setScrollPhase(0)
            }
          } else if (progress < 0.3) {
            // Trigger the exit animation at exactly this point for consistency
            if (scrollPhase !== 1) {
              setScrollPhase(1)
              typingExitTl.progress(Math.min((progress - 0.1) * 5, 1))
            } else {
              typingExitTl.progress(Math.min((progress - 0.1) * 5, 1))
            }
          } else {
            if (scrollPhase !== 2) {
              setScrollPhase(2)
              typingExitTl.progress(1)
            }
          }
        }
      },
    })
    
    // Scale and rotate the image as user scrolls - smoother with less extreme values
    scrollTl.to(image, {
      scale: 1.15,
      rotationZ: 1.5,
      filter: "brightness(0.85)",
      ease: "none",
    }, 0)
    
    // Improved form reveal - comes in from bottom with better timing
    scrollTl.fromTo(formContent, 
      { y: "30%", opacity: 0 },
      { y: "0%", opacity: 1, ease: "power1.out", duration: 0.6 },
      0.2 // Slightly later start for better sequence
    )
    
    // Fix scroll icon and message overlap with form
    if (scrollPromptRef.current) {
      scrollTl.to(scrollPromptRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.25,
        ease: "power1.in"
      }, 0.05)
    }
    
    // Clean up animations on unmount
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
      typingExitTl.kill()
    }
  }, [scrollPhase])

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
              className={s.textContent}
            >
              <TypingText 
                text="Propel Into Digital Tomorrow | NEXUS" 
                className={s.mainTitle}
                delay={0.3}
                speed={0.035}
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
                    lines={["Quantum Innovations for the Visionaries of Tomorrow"]} 
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
                    <div className={s.formInner}>
                      <div className={s.formDetails}>
                        <div className={s.formHeader}>
                          <div className={s.formBadge}>Exclusive Access</div>
                          <h2 className={s.clubTitle}>Join NEXUS Club</h2>
                          <p className={s.clubDescription}>
                            Access the future's edge where innovation meets exclusivity. 
                            NEXUS Club connects you with pioneering minds and cutting-edge 
                            digital solutions that redefine tomorrow.
                          </p>
                        </div>
                        
                        <div className={s.formBenefits}>
                          <div className={s.benefitItem}>
                            <div className={s.benefitIcon}>
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                            <span>Premium Events & Networking</span>
                          </div>
                          <div className={s.benefitItem}>
                            <div className={s.benefitIcon}>
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                            <span>Personalized Digital Solutions</span>
                          </div>
                          <div className={s.benefitItem}>
                            <div className={s.benefitIcon}>
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </div>
                            <span>Early Access to New Features</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={s.formFields}>
                        <div className={s.formGroup}>
                          <label htmlFor="email">Company Email</label>
                          <input
                            type="email"
                            id="email"
                            placeholder="yourname@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-label="Company Email address"
                          />
                        </div>
                        <div className={s.formGroup}>
                          <label htmlFor="message">How can we elevate your business?</label>
                          <textarea
                            id="message"
                            placeholder="Tell us about your goals..."
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
                          <span>Join Now</span>
                          <svg className={s.buttonArrow} viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <p className={s.formDisclaimer}>
                          By joining, you agree to our <a href="#">Terms of Service</a>
                        </p>
                      </div>
                    </div>
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
                <div className={s.formGlow}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JoinNexusClubSection 