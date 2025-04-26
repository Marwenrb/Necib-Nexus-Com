import { Layout } from 'layouts/default'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useInView } from 'react-intersection-observer'
import emailjs from '@emailjs/browser'
import 'mapbox-gl/dist/mapbox-gl.css'
import styles from '../styles/contact.module.scss'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle, FaArrowRight, FaLinkedin, FaTwitter, FaInstagram, FaBuilding } from 'react-icons/fa'
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

  // Algiers, Algeria coordinates
  const [viewState, setViewState] = useState({
    longitude: 3.0588,
    latitude: 36.7538,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  })

  // InView hooks for section animations
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  })

  const { ref: contactInfoRef, inView: contactInfoInView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  })

  const { ref: formRef1, inView: formInView } = useInView({
    threshold: 0.2,
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

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 15 
      }
    }
  }

  return (
    <Layout
      title="Contact Us | NeciB Nexus"
      description="Let's connect and explore possibilities together. Reach out to NeciB Nexus for collaborations, inquiries or feedback."
      theme="dark"
      className={styles.contactPage}
    >
      {/* WebGL background with preserved animations */}
      <div className={styles.canvasContainer} ref={webglRef}>
        <WebGL />
      </div>

      {/* Premium hero section */}
      <motion.div 
        className={styles.heroSection}
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          {/* Ultra-Premium Welcome Message */}
          <motion.div 
            className={styles.premiumWelcome}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
          >
            <div className={styles.welcomeBadge}>
              <span className={styles.badgeIcon}>⚡</span>
              <motion.span 
                className={styles.badgeText}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                NEXUS EXPERIENCE
              </motion.span>
            </div>
            
            <motion.h2 
              className={styles.welcomeHeadline}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <span className={styles.gradientText}>Elevate</span> Your Digital Vision
            </motion.h2>
            
            <motion.div 
              className={styles.welcomeDivider}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div className={styles.dividerLine}></div>
              <div className={styles.dividerDot}></div>
              <div className={styles.dividerLine}></div>
            </motion.div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.glowText}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Let's build something extraordinary together
          </motion.p>
          <motion.div
            className={styles.scrollIndicator}
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className={styles.scrollDown}></div>
          </motion.div>
        </div>
      </motion.div>

      {/* Ultra-premium contact container */}
      <div className={styles.contactContainer}>
        {/* "Reach Out" section */}
        <motion.div 
          className={styles.contactInfo}
          ref={contactInfoRef}
          variants={staggerContainer}
          initial="hidden"
          animate={contactInfoInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className={styles.sectionTitle}
            variants={fadeIn}
          >
            Reach Out
          </motion.h2>
          
          <motion.div className={styles.infoCards} variants={staggerContainer}>
            <motion.div className={styles.infoCard} variants={cardVariants}>
              <div className={styles.iconWrapper}>
                <FaMapMarkerAlt />
              </div>
              <div className={styles.infoContent}>
                <h3>Location</h3>
                <p>Alger, Algeria</p>
              </div>
              <div className={styles.cardGlow}></div>
            </motion.div>

            <motion.div className={styles.infoCard} variants={cardVariants}>
              <div className={styles.iconWrapper}>
                <FaPhone />
              </div>
              <div className={styles.infoContent}>
                <h3>Phone</h3>
                <p>+213 7 96 96 98 95</p>
              </div>
              <div className={styles.cardGlow}></div>
            </motion.div>

            <motion.div className={styles.infoCard} variants={cardVariants}>
              <div className={styles.iconWrapper}>
                <FaEnvelope />
              </div>
              <div className={styles.infoContent}>
                <h3>Email</h3>
                <p>contact@necibnexus.com</p>
              </div>
              <div className={styles.cardGlow}></div>
            </motion.div>

            <motion.div className={styles.infoCard} variants={cardVariants}>
              <div className={styles.iconWrapper}>
                <FaBuilding />
              </div>
              <div className={styles.infoContent}>
                <h3>Office</h3>
                <p>Alger, Algeria</p>
                <a href="#" className={styles.visitLink}>Visit our office <FaArrowRight /></a>
              </div>
              <div className={styles.cardGlow}></div>
            </motion.div>
          </motion.div>

          <motion.div className={styles.socialLinks} variants={fadeIn}>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </motion.div>

          <motion.div 
            className={styles.mapContainer}
            variants={fadeIn}
          >
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
                    borderRadius: '16px',
                    overflow: 'hidden',
                  }}
                />
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* "Send a Message" form with premium design */}
        <motion.div 
          className={styles.contactForm}
          ref={formRef1}
          variants={fadeIn}
          initial="hidden"
          animate={formInView ? "visible" : "hidden"}
          id="contact-form"
        >
          <div className={styles.formContainer}>
            <motion.h2 
              className={styles.sectionTitle}
              variants={fadeIn}
            >
              Send a Message
            </motion.h2>
            
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
                    <div className={styles.successRipple}></div>
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
                  className={styles.formWrapper}
                >
                  {errors.submit && (
                    <motion.div 
                      className={styles.errorMessage}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p>{errors.submit}</p>
                    </motion.div>
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
                          aria-invalid={errors.name ? "true" : "false"}
                          aria-describedby={errors.name ? "name-error" : undefined}
                        />
                        {errors.name && <span className={styles.errorText} id="name-error">{errors.name}</span>}
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
                          aria-invalid={errors.email ? "true" : "false"}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                        {errors.email && <span className={styles.errorText} id="email-error">{errors.email}</span>}
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
                        aria-invalid={errors.subject ? "true" : "false"}
                        aria-describedby={errors.subject ? "subject-error" : undefined}
                      />
                      {errors.subject && <span className={styles.errorText} id="subject-error">{errors.subject}</span>}
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
                        aria-invalid={errors.message ? "true" : "false"}
                        aria-describedby={errors.message ? "message-error" : undefined}
                      />
                      {errors.message && <span className={styles.errorText} id="message-error">{errors.message}</span>}
                    </div>
                    
                    <motion.button 
                      type="submit" 
                      className={styles.submitButton}
                      disabled={submitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                    </motion.button>
                  </form>
                  
                  {/* Premium Futuristic Typing Animation */}
                  <motion.div 
                    className={styles.futuristicAnimationContainer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <div className={styles.animationInnerWrapper}>
                      <div className={styles.futuristicLabel}>
                        <span className={styles.pulseDot}></span>
                        NeciB Nexus <span className={styles.highlight}>AI</span>
                      </div>
                      <div className={styles.typingContainer}>
                        <TypewriterEffect />
                      </div>
                      <div className={styles.intersectingLines}>
                        <div className={styles.horizontalLine}></div>
                        <div className={styles.verticalLine}></div>
                        <div className={styles.horizontalLine}></div>
                      </div>
                      
                      {/* System Telemetry Display - PREMIUM UPGRADE */}
                      <div className={styles.futuristicMetricsDisplay}>
                        <div className={styles.metricsHeader}>
                          <div className={styles.metricLabel}>
                            <div className={styles.luxuryBadge}>
                              <div className={styles.badgeInner}>
                                <div className={styles.badgeDot}></div>
                              </div>
                            </div>
                            <span className={styles.telemetryLabel}>System Telemetry</span>
                          </div>
                          
                          <div className={styles.statusIndicator}>
                            <div className={styles.liveStatus}>LIVE</div>
                            <div className={styles.timestamp}>{new Date().toISOString().split('T')[0]}</div>
                          </div>
                        </div>
                        
                        <div className={styles.compactMetricsGrid}>
                          {[
                            { name: 'Innovation', value: 99, color: 'rgba(124, 58, 237, 0.8)' },
                            { name: 'Design', value: 98, color: 'rgba(236, 72, 153, 0.8)' },
                            { name: 'Experience', value: 97, color: 'rgba(79, 70, 229, 0.8)' },
                            { name: 'Performance', value: 96, color: 'rgba(16, 185, 129, 0.8)' }
                          ].map((metric, i) => (
                            <CompactMetric 
                              key={i}
                              name={metric.name}
                              value={metric.value}
                              color={metric.color}
                              delay={i * 0.1}
                            />
                          ))}
                        </div>
                        
                        <div className={styles.dataVisualizerCompact}>
                          <div className={styles.waveVisualization}>
                            {Array.from({ length: 24 }).map((_, i) => (
                              <div 
                                key={i} 
                                className={styles.waveBar} 
                                style={{ 
                                  height: `${Math.random() * 30 + 10}px`,
                                  animationDelay: `${i * 0.08}s`
                                }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}

// Futuristic Typewriter Effect Component
const TypewriterEffect = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);
  
  const inspirationalTexts = [
    "Crafting digital experiences that transcend imagination.",
    "Transforming visions into digital reality.",
    "Building tomorrow's interfaces today.",
    "Where creativity meets technical excellence.",
    "Designing the future, one pixel at a time."
  ];

  useEffect(() => {
    const text = inspirationalTexts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(text.substring(0, displayText.length + 1));
        
        // If we've typed the full text
        if (displayText.length === text.length) {
          // Pause at the end
          setTypingSpeed(2000);
          setIsDeleting(true);
        } else {
          // Vary speed slightly for natural effect
          setTypingSpeed(80 + Math.random() * 40);
        }
      } else {
        setDisplayText(text.substring(0, displayText.length - 1));
        
        // If we've deleted everything
        if (displayText.length === 0) {
          setIsDeleting(false);
          setCurrentTextIndex((currentTextIndex + 1) % inspirationalTexts.length);
          setTypingSpeed(300); // Pause before typing next text
        } else {
          // Delete slightly faster than typing
          setTypingSpeed(30 + Math.random() * 20);
        }
      }
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [displayText, currentTextIndex, isDeleting, typingSpeed]);

  return (
    <div className={styles.typewriterText}>
      <span>{displayText}</span>
      <span className={styles.cursor}></span>
    </div>
  );
};

// Premium Compact Metric Component
const CompactMetric = ({ name, value, color, delay = 0 }) => {
  const [currentValue, setCurrentValue] = useState(0);
  
  useEffect(() => {
    const startAnimation = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentValue(prev => {
          const nextValue = prev + 1;
          if (nextValue >= value) {
            clearInterval(interval);
            return value;
          }
          return nextValue;
        });
      }, 15);
      
      return () => clearInterval(interval);
    }, delay * 1000);
    
    return () => clearTimeout(startAnimation);
  }, [value, delay]);
  
  return (
    <motion.div 
      className={styles.compactMetricContainer}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay + 0.2 }}
    >
      <div className={styles.metricLabelValue}>
        <div className={styles.compactMetricName}>{name}</div>
        <div className={styles.compactMetricValue} style={{ color }}>
          {currentValue}
        </div>
      </div>
      <div className={styles.compactMetricBar}>
        <motion.div 
          className={styles.compactMetricProgress}
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${currentValue}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
    </motion.div>
  );
};
