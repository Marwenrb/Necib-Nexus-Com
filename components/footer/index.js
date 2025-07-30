import React, { useRef, useState, useEffect } from 'react'
import cn from 'clsx'
import { Button } from 'components/button'
import { Link } from 'components/link'
import Icon from 'components/icons/Icon'
import { FiMail, FiPhone } from 'react-icons/fi'
import {
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaInstagram,
  FaTiktok,
  FaGithub,
} from 'react-icons/fa'
import { RiRocketLine } from 'react-icons/ri'
import { FaHeart } from 'react-icons/fa'
import s from './footer.module.scss'
import { BrandMarquee } from './components/BrandMarquee'
import { ParticleBackground } from './components/ParticleBackground'
import FooterCursor from './components/FooterCursor'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { useStore } from 'lib/store'

export const Footer = () => {
  const lenis = useStore(({ lenis }) => lenis)
  const footerRef = useRef(null)
  const [showCustomCursor, setShowCustomCursor] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state on client-side to prevent hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Detect mouse enter on footer to show custom cursor
  useEffect(() => {
    const handleMouseEnter = () => setShowCustomCursor(true)
    const handleMouseLeave = () => setShowCustomCursor(false)

    const footerElement = footerRef.current
    if (footerElement) {
      footerElement.addEventListener('mouseenter', handleMouseEnter)
      footerElement.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (footerElement) {
        footerElement.removeEventListener('mouseenter', handleMouseEnter)
        footerElement.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [footerRef.current])

  // Scroll-triggered animations with layoutEffect: false to prevent hydration issues
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
    layoutEffect: false, // Prevent hydration warnings
  })

  // Spring animations for smoother motion
  const springY = useSpring(useMotionValue(0), {
    stiffness: 100,
    damping: 30,
  })

  // Transform values based on scroll
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const titleY = useTransform(scrollYProgress, [0, 0.2], [30, 0])
  const marqueeOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
  const contentY = useTransform(scrollYProgress, [0.3, 0.5], [50, 0])

  // Animation variants
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const staggerChildrenVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const logoVariants = {
    hover: {
      scale: 1.15,
      y: -5,
      filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))',
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 15,
      },
    },
  }

  return (
    <motion.footer
      ref={footerRef}
      className={cn('theme-dark', s.footer)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <ParticleBackground />
      {showCustomCursor && <FooterCursor />}

      <motion.div
        className={s.partners}
        style={{ opacity: isMounted ? marqueeOpacity : 0 }}
      >
        <motion.h2
          className={s.partnersTitle}
          style={{
            opacity: isMounted ? titleOpacity : 0,
            y: isMounted ? titleY : 30,
          }}
        >
          Our Strategic Partners
        </motion.h2>
        <BrandMarquee />
      </motion.div>

      <motion.div
        className={cn(s.top, 'layout-grid hide-on-mobile')}
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.p
          className={cn(s['first-line'], 'h1')}
          variants={childVariants}
        >
          Necib Nexus <br />
          <motion.span
            className="contrast"
            whileHover={{
              textShadow: '0 0 8px var(--neon-blue-glow)',
              transition: { duration: 0.3 },
            }}
          >
            Innovation
          </motion.span>
        </motion.p>
        <motion.p className={cn(s['last-line'], 'h1')} variants={childVariants}>
          Ready to create <span className="hide-on-desktop">&nbsp;</span>{' '}
          something <br /> extraordinary
        </motion.p>
        <motion.div
          variants={childVariants}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          <Button className={s.cta} arrow href="/contact">
            Let's connect
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className={cn(s.top, 'layout-block hide-on-desktop')}
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.p
          className={cn(s['first-line'], 'h1')}
          variants={childVariants}
        >
          Necib Nexus <br />
          <motion.span
            className="contrast"
            whileHover={{
              textShadow: '0 0 8px var(--neon-blue-glow)',
              transition: { duration: 0.3 },
            }}
          >
            Innovation
          </motion.span>
          <br /> Ready to create <br /> something extraordinary
        </motion.p>
      </motion.div>

      <motion.div
        className={s.mainFooter}
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          className={s.contactInfo}
          variants={staggerChildrenVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div
            className={s.contactItem}
            variants={childVariants}
            whileHover={{
              x: 8,
              transition: { type: 'spring', stiffness: 400, damping: 10 },
            }}
          >
            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: 15,
                transition: { duration: 0.3 },
              }}
            >
              <Icon name="fi:mail" className={s.contactIcon} />
            </motion.div>
            <a href="mailto:contact@necibnexus.com" className={s.contactText}>
              contact@necibnexus.com
            </a>
          </motion.div>
          <motion.div
            className={s.contactItem}
            variants={childVariants}
            whileHover={{
              x: 8,
              transition: { type: 'spring', stiffness: 400, damping: 10 },
            }}
          >
            <motion.div
              whileHover={{
                scale: 1.2,
                rotate: 15,
                transition: { duration: 0.3 },
              }}
            >
              <Icon name="fi:phone" className={s.contactIcon} />
            </motion.div>
            <a href="tel:+213079696895" className={s.contactText}>
              +213 07 96 96 98 95
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className={s.socialLinks}
          variants={staggerChildrenVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.a
            href="https://twitter.com/necibnexus"
            target="_blank"
            rel="noreferrer"
            className={s.socialIcon}
            variants={childVariants}
            whileHover={{
              scale: 1.2,
              y: -8,
              boxShadow: '0 10px 20px rgba(29, 161, 242, 0.4)',
              backgroundColor: '#1DA1F2',
              color: '#ffffff',
              transition: { type: 'spring', stiffness: 500, damping: 10 },
            }}
          >
            <Icon name="ri:twitter-x-fill" animated={true} />
            <motion.span
              className={s.socialTooltip}
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              X (Twitter)
            </motion.span>
          </motion.a>
          <motion.a
            href="https://linkedin.com/company/necibnexus"
            target="_blank"
            rel="noreferrer"
            className={s.socialIcon}
            variants={childVariants}
            whileHover={{
              scale: 1.2,
              y: -8,
              boxShadow: '0 10px 20px rgba(0, 119, 181, 0.4)',
              backgroundColor: '#0077B5',
              color: '#ffffff',
              transition: { type: 'spring', stiffness: 500, damping: 10 },
            }}
          >
            <Icon name="ri:linkedin-fill" animated={true} />
            <motion.span
              className={s.socialTooltip}
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              LinkedIn
            </motion.span>
          </motion.a>
          <motion.a
            href="https://instagram.com/necibnexus"
            target="_blank"
            rel="noreferrer"
            className={s.socialIcon}
            variants={childVariants}
            whileHover={{
              scale: 1.2,
              y: -8,
              boxShadow: '0 10px 20px rgba(225, 48, 108, 0.4)',
              background:
                'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)',
              color: '#ffffff',
              transition: { type: 'spring', stiffness: 500, damping: 10 },
            }}
          >
            <Icon name="ri:instagram-fill" animated={true} />
            <motion.span
              className={s.socialTooltip}
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              Instagram
            </motion.span>
          </motion.a>
          <motion.a
            href="https://necibnexus.com"
            target="_blank"
            rel="noreferrer"
            className={s.socialIcon}
            variants={childVariants}
            whileHover={{
              scale: 1.2,
              y: -8,
              boxShadow: '0 10px 20px rgba(83, 82, 237, 0.4)',
              backgroundColor: '#5352ED',
              color: '#ffffff',
              transition: { type: 'spring', stiffness: 500, damping: 10 },
            }}
          >
            <Icon name="ri:rocket-2-fill" animated={true} />
            <motion.span
              className={s.socialTooltip}
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              Website
            </motion.span>
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div
        className={s.bottom}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className={s.copyright}>
          <p className={cn('p-xs', s.tm)}>
            <span>©</span> {new Date().getFullYear()} Necib Nexus
          </p>
        </div>

        <motion.div
          className={s.developerCredit}
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 500, damping: 10 }}
        >
          <div className={s.devCreditInline}>
            <span className={s.madeWithText}>Made with</span>
            <div className={s.heartContainer}>
              <motion.div
                animate={{
                  scale: [1, 1.25, 1, 1.15, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                <FaHeart className={s.heartAnimation} />
              </motion.div>
            </div>
            <span className={s.byText}>by</span>
            <motion.a
              href="https://marwen-rabai.netlify.app"
              target="_blank"
              rel="noreferrer"
              className={s.devCreditLink}
              whileHover={{ scale: 1.05 }}
            >
              <span className={s.devName}>Marwen Rabai</span>
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </motion.footer>
  )
}
