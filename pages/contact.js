import { Layout } from 'layouts/default'
import { motion } from 'framer-motion'
import s from '../styles/contact.module.scss'
import { useEffect, useState } from 'react'

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    submitted: false,
    submitting: false,
    error: null
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState(prev => ({ ...prev, submitting: true }))
    
    // Simulate form submission
    setTimeout(() => {
      setFormState(prev => ({ 
        ...prev, 
        submitted: true,
        submitting: false 
      }))
    }, 1500)
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  return (
    <Layout
      seo={{
        title: 'Contact | Necib Nexus',
        description: 'Get in touch with us for your next project',
      }}
      theme="dark"
    >
      <motion.section 
        className={s.contactSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={s.contactContainer}>
          <motion.div 
            className={s.contactHeader}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className={s.contactTitle}>Get in Touch</h1>
            <p className={s.contactSubtitle}>Let's create something extraordinary together</p>
          </motion.div>
          
          <div className={s.contactContent}>
            <motion.div 
              className={s.contactInfo}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className={s.infoItem}>
                <h3>Email</h3>
                <p>contact@necibnexus.com</p>
              </div>
              <div className={s.infoItem}>
                <h3>Phone</h3>
                <p>+213 07 96 96 98 95</p>
              </div>
              <div className={s.infoItem}>
                <h3>Follow Us</h3>
                <div className={s.socialLinks}>
                  <a href="https://twitter.com/necibnexus" target="_blank" rel="noreferrer">Twitter</a>
                  <a href="https://linkedin.com/company/necibnexus" target="_blank" rel="noreferrer">LinkedIn</a>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className={s.contactForm}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {formState.submitted ? (
                <motion.div 
                  className={s.thankYouMessage}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2>Thank you!</h2>
                  <p>We've received your message and will get back to you soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className={s.formGroup}>
                    <label htmlFor="name">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formState.name}
                      onChange={handleInputChange}
                      required 
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
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className={s.submitButton}
                    disabled={formState.submitting}
                  >
                    {formState.submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </Layout>
  )
} 