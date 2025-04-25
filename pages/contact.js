import { Layout } from 'layouts/default'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useMediaQuery } from 'react-responsive'
import { useInView } from 'react-intersection-observer'
import emailjs from '@emailjs/browser'
import 'mapbox-gl/dist/mapbox-gl.css'
import styles from '../styles/contact.module.scss'
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import { FaCheckCircle } from 'react-icons/fa'

// Dynamic imports to avoid SSR issues
const WebGL = dynamic(
  () => import('components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

const AppearTitle = dynamic(
  () => import('components/appear-title').then((mod) => mod.AppearTitle),
  { ssr: false }
)

// Use dynamic import with SSR disabled for MapboxMap component
const MapboxMap = dynamic(() => import('../components/MapboxMap'), { ssr: false })

// Map token - should be moved to environment variables in production
const MAPBOX_TOKEN =
  'pk.eyJ1IjoibmVjaWJuZXh1cyIsImEiOiJjbHYxZnhxMWUwMGdsMnFvNWZwOXY0aDBsIn0.yJNHYAEzUb_cZJM1ggLpGw'

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
  const [mapLoaded, setMapLoaded] = useState(false)

  // Replace viewport with viewState for newer react-map-gl versions
  const [viewState, setViewState] = useState({
    longitude: 2.3522, // Paris coordinates
    latitude: 48.8566,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  })

  // Use ref for parallax effect but set to 0 initially to avoid wait
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true, // Changed to true to trigger once and remain
  })

  // Check if window is defined before mounting map
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMapLoaded(true)
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setParallaxOffset(scrollPosition * 0.3) // Adjust speed as needed
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  return (
    <Layout
      title="Contact Us | NeciB Nexus"
      description="Let's connect and explore possibilities together. Reach out to NeciB Nexus for collaborations, inquiries or feedback."
      theme="dark"
      className={styles.contactPage}
    >
      <div className={styles.canvasContainer} ref={webglRef}>
        <WebGL />
      </div>

      <div
        className={styles.heroSection}
        style={{
          transform: `translateY(${parallaxOffset}px)`,
        }}
      >
        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1>Contact Us</h1>
          <p>Let's connect and explore possibilities together</p>
        </motion.div>
      </div>

      <div className={styles.contactContainer} ref={inViewRef}>
        <motion.div
          className={styles.contactInfo}
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Get In Touch</h2>

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

        <motion.div
          className={styles.contactForm}
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {!submitted ? (
            <>
              <h2>Send a Message</h2>

              <form ref={formRef} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? styles.error : ''}
                  />
                  {errors.name && (
                    <span className={styles.errorText}>{errors.name}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? styles.error : ''}
                  />
                  {errors.email && (
                    <span className={styles.errorText}>{errors.email}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? styles.error : ''}
                  />
                  {errors.subject && (
                    <span className={styles.errorText}>{errors.subject}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? styles.error : ''}
                  ></textarea>
                  {errors.message && (
                    <span className={styles.errorText}>{errors.message}</span>
                  )}
                </div>

                {errors.submit && (
                  <div className={styles.submitError}>{errors.submit}</div>
                )}

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.successMessage}>
              <FaCheckCircle />
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We'll get back to you shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className={styles.sendAnotherBtn}
              >
                Send Another Message
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  )
}
