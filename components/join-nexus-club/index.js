import { useRef, useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import emailjs from 'emailjs-com'
import cn from 'clsx'
import { Button } from 'components/button'
import s from './join-nexus-club.module.scss'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const JoinNexusClubSection = () => {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const textRef = useRef(null)
  const formRef = useRef(null)
  
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const isMobile = useMediaQuery({ maxWidth: 768 })
  
  useEffect(() => {
    // Entrance animation
    const section = sectionRef.current
    const image = imageRef.current
    const text = textRef.current
    
    if (!section || !image || !text) return
    
    // Initial state - hidden
    gsap.set([image, text], { 
      autoAlpha: 0,
      scale: 0.8
    })
    
    // Fade in and scale up when section enters viewport
    gsap.to([image, text], {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      autoAlpha: 1,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.2
    })
    
    // Parallax effect
    gsap.to(image, {
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      rotationY: isMobile ? 10 : 30,
      ease: 'none'
    })
    
    // Text parallax
    gsap.to(text, {
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: -50,
      ease: 'none'
    })
    
    return () => {
      // Clean up animations
      const triggers = ScrollTrigger.getAll()
      triggers.forEach(trigger => trigger.kill())
    }
  }, [isMobile])
  
  const toggleForm = () => {
    setShowForm(prev => !prev)
    
    // If showing form, animate it
    if (!showForm && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { height: 0, opacity: 0 },
        { 
          height: 'auto', 
          opacity: 1, 
          duration: 0.5, 
          ease: 'power2.out'
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
    } catch (err) {
      console.error('Failed to send email:', err)
      setError('Failed to submit. Please try again later.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.container}>
        <div className={s.imageWrapper} ref={imageRef}>
          <img
            src="/images/Club-Enter.jpeg"
            alt="Join NEXUS Club"
            className={s.image}
          />
        </div>
        
        <div className={s.textContent} ref={textRef}>
          <h2 className={s.title}>Join NEXUS Club</h2>
          
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