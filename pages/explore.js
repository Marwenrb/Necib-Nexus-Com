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
import ExploreBackground from '../components/webgl/ExploreBackground'

// Static imports for 3D elements & performance
const WebGL = dynamic(
  () => import('components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

// Advanced Parallax 3D Scene for the hero section
const ParallaxScene = dynamic(
  () => import('../components/ParallaxScene').then((mod) => mod.default),
  { ssr: false }
)

// Dynamic import for performance
const ScrollingGallery = dynamic(
  () => import('../components/ScrollingGallery').then((mod) => mod.default),
  { ssr: false }
)

// Dynamic import for 3D card component
const InteractiveCard = dynamic(
  () => import('../components/InteractiveCard').then((mod) => mod.default),
  { ssr: false }
)

export default function Explore() {
  return (
    <>
      <Head>
        <title>Explore | Necib Nexus</title>
        <meta name="description" content="Explore innovative solutions at Necib Nexus" />
      </Head>
      
      <Layout 
        title="Explore | NeciB Nexus"
        description="Discover cutting-edge digital experiences and innovations with NeciB Nexus"
        theme="dark"
        className={styles.explorePage}
      >
        <div className={styles.container}>
          <div className={styles.backgroundContainer}>
            <ExploreBackground />
          </div>
          
          <div className={styles.content}>
            <h1 className={styles.title}>Explore Our Solutions</h1>
            <p className={styles.description}>
              Discover innovative technologies and solutions designed to transform your business.
            </p>
            
            <div className={styles.cardGrid}>
              {/* Sample cards - replace with actual content */}
              <div className={styles.card}>
                <h3>AI Solutions</h3>
                <p>Leverage artificial intelligence to unlock insights and automate processes.</p>
              </div>
              <div className={styles.card}>
                <h3>Web Development</h3>
                <p>Custom web applications built with cutting-edge technologies.</p>
              </div>
              <div className={styles.card}>
                <h3>Mobile Apps</h3>
                <p>Cross-platform mobile solutions for iOS and Android.</p>
              </div>
              <div className={styles.card}>
                <h3>Blockchain</h3>
                <p>Decentralized applications and smart contract solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
} 