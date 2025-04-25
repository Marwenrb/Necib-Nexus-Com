import { useRef, useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import emailjs from 'emailjs-com'
import cn from 'clsx'
import { Button } from 'components/button'
import s from './join-nexus-club.module.scss'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

export const JoinNexusClubSection = () => {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const textRef = useRef(null)
  const titleRef = useRef(null)
  const titleCharsRef = useRef([])
  const formRef = useRef(null)
  const parallaxLayers = useRef([])
  
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const isMobile = useMediaQuery({ maxWidth: 768 })
  
  // Split text animation setup
  useEffect(() => {
    if (!titleRef.current) return
    
    // Split the title into individual characters for advanced animation
    const title = titleRef.current
    const text = title.innerText
    title.innerHTML = ''
    
    // Create wrapper for better animation control
    const wrapper = document.createElement('span')
    wrapper.className = s.titleWrapper
    
    // Create spans for each character
    const chars = text.split('').map((char, i) => {
      const span = document.createElement('span')
      span.className = s.titleChar
      span.style.setProperty('--char-index', i)
      span.innerHTML = char === ' ' ? '&nbsp;' : char
      wrapper.appendChild(span)
      return span
    })
    
    title.appendChild(wrapper)
    titleCharsRef.current = chars
  }, [])
  
  useEffect(() => {
    // Entrance animation
    const section = sectionRef.current
    const image = imageRef.current
    const text = textRef.current
    const titleChars = titleCharsRef.current
    
    if (!section || !image || !text || titleChars.length === 0) return
    
    // Create parallax layers for the image
    if (image && parallaxLayers.current.length === 0) {
      // Create multiple image layers for depth effect
      const createLayer = (depth, scale) => {
        const layer = document.createElement('div')
        layer.className = s.parallaxLayer
        layer.style.setProperty('--depth', depth)
        layer.style.setProperty('--scale', scale)
        
        const img = document.createElement('img')
        img.src = "/images/Club-Enter.jpeg"
        img.alt = "Join NEXUS Club"
        img.className = s.layerImage
        
        layer.appendChild(img)
        image.appendChild(layer)
        
        return layer
      }
      
      // Create 3 layers with different depths for parallax effect
      parallaxLayers.current = [
        createLayer(0.2, 1.05),
        createLayer(0.5, 1),
        createLayer(0.8, 0.95)
      ]
    }
    
    // Initial state - hidden
    gsap.set([image, text], { 
      autoAlpha: 0,
      scale: 0.8
    })
    
    gsap.set(titleChars, {
      autoAlpha: 0,
      y: 100,
      rotateX: -90,
      transformOrigin: "50% 50% -20"
    })
    
    // Title animation - advanced 3D letter reveal
    gsap.to(titleChars, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      autoAlpha: 1,
      y: 0,
      rotateX: 0,
      stagger: 0.04,
      duration: 1.2,
      ease: "power4.out",
    })
    
    // Fade in and scale up for other elements
    gsap.to(text, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      autoAlpha: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.5
    })
    
    gsap.to(image, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      autoAlpha: 1,
      scale: 1,
      duration: 1.6,
      ease: 'expo.out',
    })
    
    // Advanced parallax effect with layers
    parallaxLayers.current.forEach(layer => {
      const depth = parseFloat(layer.style.getPropertyValue('--depth'))
      
      // Different movement for each layer
      gsap.to(layer, {
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: () => isMobile ? 50 * depth : 100 * depth,
        scale: () => 1 + (depth * 0.1),
        rotateY: () => isMobile ? 5 * depth : 15 * depth,
        rotateX: () => isMobile ? 3 * depth : 7 * depth,
        ease: 'none'
      })
    })
    
    // Create glitch effect on scroll
    const createGlitchTimeline = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 30%',
          end: 'bottom 70%',
          toggleActions: 'play none none reverse',
          onUpdate: (self) => {
            if (self.progress > 0.4 && self.progress < 0.6 && self.direction > 0) {
              if (!tl.isActive()) tl.play(0)
            }
          }
        },
        repeat: 0
      })
      
      tl.to(image, {
        duration: 0.1,
        clipPath: 'polygon(0 10%, 100% 0, 100% 95%, 0 100%)',
        filter: 'hue-rotate(90deg) contrast(150%)',
        ease: 'steps(1)'
      })
      .to(image, {
        duration: 0.1,
        clipPath: 'polygon(0 0, 100% 5%, 100% 100%, 0 90%)',
        filter: 'hue-rotate(0deg) contrast(100%)',
        ease: 'steps(1)'
      })
      .to(image, {
        duration: 0.05,
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        filter: 'none',
        ease: 'steps(1)'
      })
      
      return tl
    }
    
    const glitchTl = createGlitchTimeline()
    
    // Moving light effect
    const createLightEffect = () => {
      const light = document.createElement('div')
      light.className = s.lightEffect
      image.appendChild(light)
      
      gsap.to(light, {
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        left: '120%',
        top: '-20%',
        ease: 'power2.inOut'
      })
      
      return light
    }
    
    const lightEffect = createLightEffect()
    
    // Content parallax - different speeds for different elements
    gsap.to(text, {
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: -80,
      ease: 'none'
    })
    
    return () => {
      // Clean up animations
      const triggers = ScrollTrigger.getAll()
      triggers.forEach(trigger => trigger.kill())
      
      // Clean up added elements
      if (lightEffect && lightEffect.parentNode) {
        lightEffect.parentNode.removeChild(lightEffect)
      }
      
      parallaxLayers.current.forEach(layer => {
        if (layer && layer.parentNode) {
          layer.parentNode.removeChild(layer)
        }
      })
      parallaxLayers.current = []
    }
  }, [isMobile])
  
  const toggleForm = () => {
    setShowForm(prev => !prev)
    
    // If showing form, animate it
    if (!showForm && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { height: 0, opacity: 0, y: 50 },
        { 
          height: 'auto', 
          opacity: 1,
          y: 0,
          duration: 0.7, 
          ease: 'power3.out'
        }
      )
    } else if (showForm && formRef.current) {
      gsap.to(
        formRef.current,
        {
          opacity: 0,
          y: -20,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(formRef.current, { height: 0 })
          }
        }
      )
    }
  }
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    
    // Clear error when user starts typing again
    if (error) {
      setError('')
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address')
      gsap.fromTo('.errorMessage', 
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, ease: 'back.out' }
      )
      return
    }
    
    try {
      setSubmitting(true)
      setError('')
      
      // Replace with your actual EmailJS service, template and user IDs
      await emailjs.send(
        'your_service_id', // Replace with actual service ID
        'your_template_id', // Replace with actual template ID
        {
          to_email: 'join-club@necibnexus.com',
          from_email: email,
          message: `New club membership request from: ${email}`
        },
        'your_user_id' // Replace with actual user ID
      )
      
      setSubmitted(true)
      setEmail('')
      
      // Success animation
      if (formRef.current) {
        gsap.to(formRef.current.querySelector('form'), {
          y: -20,
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            const successMsg = formRef.current.querySelector(`.${s.successMessage}`)
            if (successMsg) {
              gsap.fromTo(successMsg,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
              )
            }
          }
        })
      }
    } catch (err) {
      console.error('Failed to send email:', err)
      setError('Failed to submit. Please try again later.')
      
      // Error animation
      gsap.fromTo(`.${s.errorMessage}`,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power1.out' }
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.container}>
        <div className={s.imageWrapper} ref={imageRef}>
          {/* Parallax layers are added dynamically in useEffect */}
        </div>
        
        <div className={s.textContent} ref={textRef}>
          <h2 className={s.title} ref={titleRef}>Join NEXUS Club</h2>
          
          <div className={s.buttonWrapper}>
            <Button 
              onClick={toggleForm} 
              className={s.joinButton}
              arrow
            >
              {showForm ? 'Hide Form' : 'Join Now'}
            </Button>
          </div>
          
          {showForm && (
            <div ref={formRef} className={s.formContainer}>
              {!submitted ? (
                <form onSubmit={handleSubmit} className={s.form}>
                  <div className={s.inputGroup}>
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Your email address"
                      className={cn(s.input, error && s.inputError)}
                      disabled={submitting}
                    />
                    {error && <p className={s.errorMessage}>{error}</p>}
                  </div>
                  
                  <Button 
                    onClick={handleSubmit}
                    className={s.submitButton}
                    arrow
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </form>
              ) : (
                <div className={s.successMessage}>
                  <p>Thank you for joining the NEXUS Club!</p>
                  <p>We'll be in touch soon.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default JoinNexusClubSection 