import { Layout } from 'layouts/default'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useInView } from 'react-intersection-observer'
import emailjs from '@emailjs/browser'
import 'mapbox-gl/dist/mapbox-gl.css'
import styles from '../styles/contact.module.scss'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaArrowRight, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

// Static import of WebGL for better performance
const WebGL = dynamic(
  () => import('components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

// Use dynamic import with SSR disabled for MapboxMap component
const MapboxMap = dynamic(() => import('../components/MapboxMap'), { ssr: false })

// Map token - should be moved to environment variables in production
const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibmVjaWJuZXh1cyIsImEiOiJjbHYxZnhxMWUwMGdsMnFvNWZwOXY0aDBsIn0.yJNHYAEzUb_cZJM1ggLpGw'

export default function Contact() {
  const formRef = useRef(null)
  const mapRef = useRef(null)
  const webglRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(true)

  // Replace viewport with viewState for newer react-map-gl versions
  const [viewState, setViewState] = useState({
    longitude: 2.3522, // Paris coordinates
    latitude: 48.8566,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  })

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  // Check if window is defined before mounting map
  useEffect(() => {
    setMapLoaded(true)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validate required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'

    // Validate email format
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      )

      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })

      setSubmitted(true)
    } catch (error) {
      console.error('Email send failed:', error)
      setErrors({
        ...errors,
        submit: 'Failed to send message. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Animation variants for elements
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <Layout
      title="Contact Us | NeciB Nexus"
      description="Let's connect and explore possibilities together. Reach out to NeciB Nexus for collaborations, inquiries or feedback."
      theme="dark"
      className={styles.contactPage}
    >
      {/* Preserve WebGL background */}
      <div className={styles.canvasContainer} ref={webglRef}>
        <WebGL />
      </div>

      {/* Enhanced hero section */}
      <motion.div 
        className={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={styles.heroContent}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Let's build something extraordinary together
          </motion.p>
        </div>
      </motion.div>

      {/* Premium contact container */}
      <motion.div 
        className={styles.contactContainer} 
        ref={inViewRef}
        variants={fadeIn}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <div className={styles.contactContent}>
          {/* Left column: Contact info */}
          <motion.div 
            className={styles.contactInfo}
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
          >
            <h2 className={styles.contactInfoTitle}>Reach Out</h2>
            
            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3>Location</h3>
                <p>Paris, France</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <FaPhone />
              </div>
              <div>
                <h3>Phone</h3>
                <p>+33 (0) 123 456 789</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrapper}>
                <FaEnvelope />
              </div>
              <div>
                <h3>Email</h3>
                <p>contact@necibnexus.com</p>
              </div>
            </div>

            <div className={styles.socialLinks}>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            </div>

            <div className={styles.mapContainer}>
              {mapLoaded && (
                <div className={styles.mapWrapper}>
                  <MapboxMap
                    initialViewState={viewState}
                    onMove={(evt) => setViewState(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/dark-v10"
                    mapboxAccessToken={MAPBOX_TOKEN}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px',
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Right column: Contact form */}
          <motion.div 
            className={styles.contactForm}
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.formContainer}>
              <h2 className={styles.formTitle}>Send a Message</h2>
              
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={styles.successMessage}
                  >
                    <div className={styles.checkmarkWrapper}>
                      <FaCheckCircle className={styles.checkIcon} />
                    </div>
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. We'll get back to you shortly.</p>
                    <button 
                      className={styles.resetButton}
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {errors.submit && (
                      <div className={styles.errorMessage}>
                        <p>{errors.submit}</p>
                      </div>
                    )}
                    <form ref={formRef} onSubmit={handleSubmit}>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="name">Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className={errors.name ? styles.error : styles.formControl}
                            disabled={submitting}
                          />
                          {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your email address"
                            className={errors.email ? styles.error : styles.formControl}
                            disabled={submitting}
                          />
                          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                        </div>
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="subject">Subject</label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Message subject"
                          className={errors.subject ? styles.error : styles.formControl}
                          disabled={submitting}
                        />
                        {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="message">Message</label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Your message"
                          className={errors.message ? styles.error : styles.formControl}
                          disabled={submitting}
                          rows={5}
                        />
                        {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                      </div>
                      
                      <button 
                        type="submit" 
                        className={styles.submitButton}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className={styles.loadingIndicator}>
                            <span className={styles.loadingDot}></span>
                            <span className={styles.loadingDot}></span>
                            <span className={styles.loadingDot}></span>
                          </span>
                        ) : (
                          <>
                            Send Message
                            <FaArrowRight className={styles.buttonIcon} />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  )
}
