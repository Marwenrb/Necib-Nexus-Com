import { Layout } from 'layouts/default'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useMediaQuery } from 'react-responsive'
import { useInView } from 'react-intersection-observer'
import emailjs from '@emailjs/browser'
import MapGL, { Marker, NavigationControl, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import s from '../styles/contact.module.scss'

// Dynamic imports to avoid SSR issues
const WebGL = dynamic(
  () => import('components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

const AppearTitle = dynamic(
  () => import('components/appear-title').then((mod) => mod.AppearTitle),
  { ssr: false }
)

// Map token - should be moved to environment variables in production
const MAPBOX_TOKEN = 'pk.eyJ1IjoibmVjaWJuZXh1cyIsImEiOiJjbHYxZnhxMWUwMGdsMnFvNWZwOXY0aDBsIn0.yJNHYAEzUb_cZJM1ggLpGw';

export default function Contact() {
  // Form state management
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    submitted: false,
    submitting: false,
    error: null
  })

  // Animation references
  const formRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  // Map state
  const [viewport, setViewport] = useState({
    latitude: 36.7538,
    longitude: 3.0588,
    zoom: 13
  })
  
  const [showPopup, setShowPopup] = useState(true)
  
  // Intersection observers for animations
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const [formContentRef, formContentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const [mapRef, mapInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Check if mobile on client side
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])
  
  // Handle parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Handle form submission with EmailJS
  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState(prev => ({ ...prev, submitting: true, error: null }))
    
    try {
      // EmailJS configuration - replace with your service ID, template ID, and public key
      await emailjs.sendForm(
        'service_necibnexus', 
        'template_contact_form', 
        formRef.current, 
        'YOUR_PUBLIC_KEY'
      )
      
      setFormState(prev => ({ 
        ...prev, 
        submitted: true,
        submitting: false 
      }))
    } catch (error) {
      console.error('Email sending failed:', error)
      setFormState(prev => ({ 
        ...prev, 
        submitting: false,
        error: 'Failed to send your message. Please try again.'
      }))
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const resetForm = () => {
    setFormState({
      name: '',
      email: '',
      subject: '',
      message: '',
      submitted: false,
      submitting: false,
      error: null
    })
  }
  
  // Calculate animation values based on scroll position
  const parallaxOffset = scrollY * 0.25
  const opacityValue = 1 - Math.min(1, Math.max(0, scrollY / 800))
  
  return (
    <Layout
      seo={{
        title: 'Contact Necib Nexus | Premium Digital Experiences',
        description: 'Get in touch with our team to discuss your next digital project. Let's create something extraordinary together.',
      }}
      theme="dark"
      className={s.contactPage}
    >
      <div className={s.canvasContainer}>
        <WebGL />
      </div>
      
      <div 
        className={s.heroSection}
        style={{ 
          transform: `translateY(${parallaxOffset}px)`,
          opacity: opacityValue
        }}
      >
        <motion.div 
          className={s.heroContent}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <h1 className={s.heroTitle}>
            <span className={s.lineOne}>Let's Create</span>
            <span className={s.lineTwo}>Together</span>
          </h1>
          <p className={s.heroSubtitle}>
            Reach out and see your vision transform into reality
          </p>
        </motion.div>
        
        <motion.div 
          className={s.scrollIndicator}
          animate={{ 
            y: [0, 12, 0],
            opacity: [0.8, 0.4, 0.8]
          }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut", 
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <span className={s.scrollText}>Scroll</span>
          <span className={s.scrollIcon}></span>
        </motion.div>
      </div>
      
      <section 
        className={s.contactSection}
        ref={headerRef}
      >
        <div className={s.sectionHeader}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.1
            }}
          >
            <h2 className={s.sectionTitle}>
              <AppearTitle>Get in Touch</AppearTitle>
            </h2>
            <p className={s.sectionSubtitle}>
              Let's discuss your project and create something extraordinary together
            </p>
          </motion.div>
        </div>
        
        <div className={s.contactContainer}>
          <div 
            className={s.contactContent}
            ref={formContentRef}
          >
            <motion.div 
              className={s.contactInfo}
              initial={{ opacity: 0, x: -50 }}
              animate={formContentInView ? { opacity: 1, x: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.3
              }}
            >
              <div className={s.infoItem}>
                <div className={s.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12C22 10.6868 21.7413 9.38647 21.2388 8.1732C20.7362 6.95994 19.9997 5.85742 19.0711 4.92893C18.1425 4.00043 17.04 3.26392 15.8268 2.7614C14.6135 2.25888 13.3132 2 12 2C10.6868 2 9.38647 2.25888 8.1732 2.7614C6.95994 3.26392 5.85742 4.00043 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C6.8043 20.9464 9.34784 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12ZM12 6C12.5304 6 13.0391 6.21071 13.4142 6.58579C13.7893 6.96086 14 7.46957 14 8C14 8.53043 13.7893 9.03914 13.4142 9.41421C13.0391 9.78929 12.5304 10 12 10C11.4696 10 10.9609 9.78929 10.5858 9.41421C10.2107 9.03914 10 8.53043 10 8C10 7.46957 10.2107 6.96086 10.5858 6.58579C10.9609 6.21071 11.4696 6 12 6ZM16 17H8C7.73478 17 7.48043 16.8946 7.29289 16.7071C7.10536 16.5196 7 16.2652 7 16C7 15.7348 7.10536 15.4804 7.29289 15.2929C7.48043 15.1054 7.73478 15 8 15H16C16.2652 15 16.5196 15.1054 16.7071 15.2929C16.8946 15.4804 17 15.7348 17 16C17 16.2652 16.8946 16.5196 16.7071 16.7071C16.5196 16.8946 16.2652 17 16 17Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={s.infoContent}>
                  <h3>Email Us</h3>
                  <p><a href="mailto:contact@necibnexus.com">contact@necibnexus.com</a></p>
                </div>
              </div>
              
              <div className={s.infoItem}>
                <div className={s.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.23 15.26L16.69 14.97C16.0893 14.9033 15.4952 15.0744 15.05 15.44L13.11 17.08C10.36 15.65 8.13 13.39 6.71 10.61L8.39 8.68C8.75554 8.23953 8.92295 7.64897 8.85 7.05L8.54 4.46C8.44993 3.69582 8.04585 3.0074 7.41525 2.5659C6.78466 2.12441 5.9846 1.97683 5.23 2.16L2.92 2.82C2.14444 3.01741 1.47727 3.51883 1.08132 4.21668C0.685373 4.91453 0.589937 5.75628 0.82 6.53C2.15345 11.6052 5.09449 16.0812 9.16 19.21C10.3231 20.1304 11.6001 20.9172 12.96 21.55C13.3585 21.7296 13.791 21.8209 14.23 21.82C14.9349 21.8156 15.6179 21.5681 16.16 21.12L17.95 19.08C18.3923 18.4497 18.5412 17.6497 18.3519 16.8933C18.1626 16.1368 17.6536 15.5014 16.96 15.15L19.23 15.26Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={s.infoContent}>
                  <h3>Call Us</h3>
                  <p><a href="tel:+213079696895">+213 07 96 96 98 95</a></p>
                </div>
              </div>
              
              <div className={s.infoItem}>
                <div className={s.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 13.5C12.8284 13.5 13.5 12.8284 13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5Z" fill="currentColor"/>
                    <path d="M12 2C10.5166 2 9.0666 2.43987 7.83321 3.26398C6.59983 4.08809 5.63856 5.25943 5.07091 6.62987C4.50325 8.00032 4.35472 9.50777 4.64411 10.9599C4.9335 12.412 5.64781 13.7544 6.6967 14.8033C7.20266 15.3093 8.1291 16.3101 9.36501 17.5705C10.2292 18.4529 11.1505 19.3732 12 20.2295C12.8505 19.3721 13.7736 18.4501 14.6389 17.5667C15.8752 16.3058 16.802 15.3047 17.3033 14.8033C18.3522 13.7544 19.0665 12.412 19.3559 10.9599C19.6453 9.50777 19.4968 8.00032 18.9291 6.62987C18.3614 5.25943 17.4002 4.08809 16.1668 3.26398C14.9334 2.43987 13.4834 2 12 2ZM12 15.5C11.0111 15.5 10.0444 15.2068 9.22215 14.6573C8.39991 14.1079 7.75904 13.3271 7.3806 12.4134C7.00217 11.4998 6.90315 10.4945 7.09608 9.52722C7.289 8.55995 7.76521 7.68351 8.46447 6.98426C9.16373 6.28501 10.0401 5.80879 11.0074 5.61586C11.9747 5.42294 12.9799 5.52195 13.8936 5.90039C14.8073 6.27883 15.588 6.9197 16.1375 7.74194C16.687 8.56418 16.9802 9.53086 16.9802 10.5198C16.9802 11.8414 16.4548 13.0985 15.5201 14.0332C14.5855 14.9678 13.3283 15.4933 12.0067 15.4933L12 15.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={s.infoContent}>
                  <h3>Visit Us</h3>
                  <p>Alger, Algeria</p>
                </div>
              </div>
              
              <div className={s.infoItem}>
                <div className={s.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22C9.34784 22 6.8043 20.9464 4.92893 19.0711C3.05357 17.1957 2 14.6522 2 12C2 9.34784 3.05357 6.8043 4.92893 4.92893C6.8043 3.05357 9.34784 2 12 2C14.6522 2 17.1957 3.05357 19.0711 4.92893C20.9464 6.8043 22 9.34784 22 12ZM17 13.5C17.3978 13.5 17.7794 13.342 18.0607 13.0607C18.342 12.7794 18.5 12.3978 18.5 12C18.5 11.6022 18.342 11.2206 18.0607 10.9393C17.7794 10.658 17.3978 10.5 17 10.5C16.6022 10.5 16.2206 10.658 15.9393 10.9393C15.658 11.2206 15.5 11.6022 15.5 12C15.5 12.3978 15.658 12.7794 15.9393 13.0607C16.2206 13.342 16.6022 13.5 17 13.5ZM12 13.5C12.3978 13.5 12.7794 13.342 13.0607 13.0607C13.342 12.7794 13.5 12.3978 13.5 12C13.5 11.6022 13.342 11.2206 13.0607 10.9393C12.7794 10.658 12.3978 10.5 12 10.5C11.6022 10.5 11.2206 10.658 10.9393 10.9393C10.658 11.2206 10.5 11.6022 10.5 12C10.5 12.3978 10.658 12.7794 10.9393 13.0607C11.2206 13.342 11.6022 13.5 12 13.5ZM7 13.5C7.39782 13.5 7.77936 13.342 8.06066 13.0607C8.34196 12.7794 8.5 12.3978 8.5 12C8.5 11.6022 8.34196 11.2206 8.06066 10.9393C7.77936 10.658 7.39782 10.5 7 10.5C6.60218 10.5 6.22064 10.658 5.93934 10.9393C5.65804 11.2206 5.5 11.6022 5.5 12C5.5 12.3978 5.65804 12.7794 5.93934 13.0607C6.22064 13.342 6.60218 13.5 7 13.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className={s.infoContent}>
                  <h3>Follow Us</h3>
                  <div className={s.socialLinks}>
                    <a href="https://twitter.com/necibnexus" target="_blank" rel="noreferrer">Twitter</a>
                    <a href="https://linkedin.com/company/necibnexus" target="_blank" rel="noreferrer">LinkedIn</a>
                    <a href="https://instagram.com/necibnexus" target="_blank" rel="noreferrer">Instagram</a>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={s.contactForm}
              initial={{ opacity: 0, x: 50 }}
              animate={formContentInView ? { opacity: 1, x: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.5
              }}
            >
              <AnimatePresence mode="wait">
                {formState.submitted ? (
                  <motion.div 
                    className={s.thankYouMessage}
                    key="thank-you"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={s.checkmarkContainer}>
                      <svg className={s.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className={s.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                        <path className={s.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                      </svg>
                    </div>
                    <h2>Thank you!</h2>
                    <p>We've received your message and will get back to you soon.</p>
                    <button 
                      onClick={resetForm} 
                      className={s.sendAnotherButton}
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    ref={formRef}
                    onSubmit={handleSubmit}
                    key="contact-form"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={s.formRow}>
                      <div className={s.formGroup}>
                        <label htmlFor="name">Your Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          value={formState.name}
                          onChange={handleInputChange}
                          required 
                          className={s.formControl}
                        />
                      </div>
                      
                      <div className={s.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          value={formState.email}
                          onChange={handleInputChange}
                          required 
                          className={s.formControl}
                        />
                      </div>
                    </div>
                    
                    <div className={s.formGroup}>
                      <label htmlFor="subject">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        value={formState.subject}
                        onChange={handleInputChange}
                        required 
                        className={s.formControl}
                      />
                    </div>
                    
                    <div className={s.formGroup}>
                      <label htmlFor="message">Your Message</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        rows="5"
                        value={formState.message}
                        onChange={handleInputChange}
                        required
                        className={s.formControl}
                      ></textarea>
                    </div>
                    
                    {formState.error && (
                      <div className={s.errorMessage}>
                        {formState.error}
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      className={s.submitButton}
                      disabled={formState.submitting}
                    >
                      {formState.submitting ? (
                        <span className={s.loadingIndicator}>
                          <span className={s.loadingDot}></span>
                          <span className={s.loadingDot}></span>
                          <span className={s.loadingDot}></span>
                        </span>
                      ) : 'Send Message'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section 
        className={s.mapSection}
        ref={mapRef}
      >
        <motion.div
          className={s.mapWrapper}
          initial={{ opacity: 0, y: 50 }}
          animate={mapInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <MapGL
            {...viewport}
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/dark-v10"
            onViewportChange={setViewport}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            className={s.mapContainer}
          >
            <Marker 
              latitude={36.7538} 
              longitude={3.0588} 
              offsetTop={-20}
              offsetLeft={-10}
            >
              <div className={s.markerPin}></div>
            </Marker>
            
            {showPopup && (
              <Popup
                latitude={36.7538}
                longitude={3.0588}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setShowPopup(false)}
                anchor="top"
                className={s.mapPopup}
              >
                <div className={s.popupContent}>
                  <h3>Necib Nexus</h3>
                  <p>Digital Innovation Hub</p>
                </div>
              </Popup>
            )}
            
            <div className={s.navControls}>
              <NavigationControl showCompass={false} />
            </div>
          </MapGL>
        </motion.div>
      </section>
    </Layout>
  )
} 