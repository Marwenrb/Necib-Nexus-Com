import { useRef, useState, useEffect } from 'react'
import { Layout } from 'layouts/default'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import styles from '../styles/explore.module.scss'
import { FaChevronDown, FaArrowRight } from 'react-icons/fa'
import { Button } from 'components/button'
import Head from 'next/head'

// Dynamic import for 3D background
const ExploreBackground = dynamic(
  () => import('../components/webgl/ExploreBackground'),
  { ssr: false, loading: () => <div className={styles.loadingBackground} /> }
)

// Dynamic import for parallax image section
const ParallaxImageSection = dynamic(
  () => import('../components/ParallaxImageSection'),
  { ssr: false }
)

// Dynamic import for 3D transform cards
const TransformCard = dynamic(
  () => import('../components/TransformCard'),
  { ssr: false }
)

export default function Explore() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  
  // Transform values for parallax scrolling effects
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, 100])
  
  // Intersection observer for section animations
  const [sectionRef1, inView1] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })
  
  const [sectionRef2, inView2] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })
  
  // Update scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Example data for image galleries
  const innovationImages = [
    {
      src: '/images/digital-marketing.jpg',
      alt: 'Digital Marketing',
      width: 600,
      height: 400,
      caption: 'Advanced Digital Marketing Solutions'
    },
    {
      src: '/images/Futuristic Visors.jpeg',
      alt: 'Futuristic Technology',
      width: 600,
      height: 400,
      caption: 'Next-Gen Hardware Integration'
    },
    {
      src: '/images/immersion-ar-vr.jpeg',
      alt: 'VR Experience',
      width: 600,
      height: 400,
      caption: 'Immersive AR/VR Experiences'
    },
    {
      src: '/images/Diverse Hands Showcasing HD Technology Display.jpeg',
      alt: 'Collaborative Tech',
      width: 600,
      height: 400,
      caption: 'Collaborative Solutions'
    },
    {
      src: '/images/photo-1634492599187-b89b0dfd1e50.jpeg',
      alt: 'Tech Innovation',
      width: 600,
      height: 400,
      caption: 'Cutting-edge Innovation'
    }
  ]
  
  const digitalImages = [
    {
      src: '/images/virtual-experience.jpeg',
      alt: 'Virtual Experience',
      width: 600,
      height: 400,
      caption: 'Virtual Experiences'
    },
    {
      src: '/images/digital-culture.jpeg',
      alt: 'Digital Culture',
      width: 600,
      height: 400,
      caption: 'Digital Culture Transformation'
    },
    {
      src: '/images/e-tourism.jpeg',
      alt: 'E-Tourism',
      width: 600,
      height: 400,
      caption: 'E-Tourism Solutions'
    },
    {
      src: '/images/street-influence.jpeg',
      alt: 'Street Influence',
      width: 600, 
      height: 400,
      caption: 'Cultural Impact'
    }
  ]
  
  // Solution cards data
  const solutionCards = [
    {
      title: 'AI & Machine Learning',
      description: 'Leverage artificial intelligence to unlock insights and automate processes, driving business innovation and operational efficiency.',
      image: '/images/Futuristic Visors.jpeg',
      link: '/solutions/ai',
      glowColor: 'rgba(124, 58, 237, 0.5)'
    },
    {
      title: 'Web Development',
      description: 'Custom web applications built with cutting-edge technologies, delivering seamless user experiences across all devices.',
      image: '/images/Digital-10.jpeg',
      link: '/solutions/web',
      glowColor: 'rgba(72, 149, 239, 0.5)'
    },
    {
      title: 'AR/VR Experiences',
      description: 'Immersive augmented and virtual reality solutions that transform how users interact with digital content.',
      image: '/images/immersion-ar-vr.jpeg',
      link: '/solutions/ar-vr',
      glowColor: 'rgba(59, 130, 246, 0.5)'
    },
    {
      title: 'Digital Marketing',
      description: 'Strategic digital marketing campaigns that combine data analytics with creative storytelling to reach and engage your target audience.',
      image: '/images/digital-marketing.jpg',
      link: '/solutions/marketing',
      glowColor: 'rgba(147, 51, 234, 0.5)'
    },
    {
      title: 'Mobile Applications',
      description: 'Cross-platform mobile solutions that deliver native-like performance and exceptional user experiences on iOS and Android devices.',
      image: '/images/Diverse Hands Showcasing HD Technology Display.jpeg',
      link: '/solutions/mobile',
      glowColor: 'rgba(79, 70, 229, 0.5)'
    },
    {
      title: 'Blockchain Solutions',
      description: 'Decentralized applications and smart contract solutions that leverage blockchain technology for enhanced security and transparency.',
      image: '/images/virtual-experience.jpeg',
      link: '/solutions/blockchain',
      glowColor: 'rgba(109, 40, 217, 0.5)'
    }
  ]
  
  return (
    <>
      <Head>
        <title>Explore | Necib Nexus</title>
        <meta name="description" content="Explore innovative digital solutions and cutting-edge technologies with Necib Nexus, your partner in digital transformation." />
      </Head>
      
      <Layout 
        title="Explore | NeciB Nexus"
        description="Discover cutting-edge digital experiences and innovations with NeciB Nexus"
        theme="dark"
        className={styles.explorePage}
      >
        {/* Hero Section with 3D Background */}
        <section className={styles.heroSection} ref={heroRef}>
          <div className={styles.backgroundContainer}>
            <ExploreBackground />
          </div>
          
          <motion.div 
            className={styles.heroContent}
            style={{ opacity, y, scale }}
          >
            <motion.div 
              className={styles.headingContainer}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            >
              <h1 className={styles.heroTitle}>
                Explore <span className={styles.gradientText}>Digital Frontiers</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Discover innovative technologies and solutions designed 
                to transform your business in the digital age.
              </p>
            </motion.div>
            
            <motion.div
              className={styles.scrollPrompt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <span>Scroll to explore</span>
              <FaChevronDown className={styles.scrollIcon} />
            </motion.div>
          </motion.div>
        </section>
        
        {/* Solutions Section */}
        <section className={styles.cardsSection} ref={sectionRef1}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleDecoration}>
              <div className={styles.line}></div>
              <div className={styles.dot}></div>
              <div className={styles.line}></div>
            </div>
            <h2 className={styles.sectionTitle}>Our Solutions</h2>
            <p className={styles.sectionSubtitle}>
              Explore our range of cutting-edge solutions designed to drive digital innovation
              and transform your business landscape.
            </p>
          </div>
          
          <div className={styles.cardsGrid}>
            {solutionCards.map((card, index) => (
              <TransformCard 
                key={index}
                title={card.title}
                description={card.description}
                image={card.image}
                link={card.link}
                index={index}
                glowColor={card.glowColor}
              />
            ))}
          </div>
        </section>
        
        {/* Innovation Images Gallery */}
        <ParallaxImageSection 
          images={innovationImages}
          title="Technological Innovation"
          subtitle="Discover how our cutting-edge technologies are shaping the digital landscape and transforming industries."
        />
        
        {/* Digital Transformation Gallery */}
        <ParallaxImageSection 
          images={digitalImages}
          title="Digital Transformation"
          subtitle="See how we help businesses evolve in the digital age, adopting new technologies and processes to stay competitive."
        />
        
        {/* Final CTA Section */}
        <section className={styles.ctaSection} ref={sectionRef2}>
          <motion.div 
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 50 }}
            animate={inView2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={styles.ctaTitle}>Ready to Transform Your Digital Experience?</h2>
            <p className={styles.ctaSubtitle}>
              Let's collaborate to create innovative solutions that drive your business forward.
            </p>
            
            <motion.a 
              href="/contact" 
              className={styles.ctaButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <span>Get Started</span>
              <FaArrowRight className={styles.ctaIcon} />
            </motion.a>
          </motion.div>
        </section>
      </Layout>
    </>
  )
} 