import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { useStore } from 'lib/store'
import cn from 'clsx'
import Image from 'next/image'
import { Button } from 'components/button'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, Environment, Float } from '@react-three/drei'
import { Suspense } from 'react'
import * as THREE from 'three'
import s from './entry-experience.module.scss'
import Loading from './loading'

// Images for the 3D animation
const backgroundImages = [
  '/images/photo-1519608220182-b0ee9d0f54d6.jpeg',
  '/images/photo-1519608487953-e999c86e7455.jpeg',
  '/images/photo-1529089377585-0da2bfe38f8d.jpeg',
  '/images/photo-1534076355207-1717511180ba.jpeg',
  '/images/photo-1535078035266-a0fa7d3b8f65.jpeg',
  '/images/photo-1599394407175-b6da85464b90.jpeg',
  '/images/photo-1603347729548-6844517490c7.jpeg',
  '/images/photo-1604818640599-71bda0165d53.jpeg',
  '/images/photo-1615307250409-be3bc317121c.jpeg',
  '/images/photo-1633182203832-76ede0337ca2.jpeg',
  '/images/photo-1634492599187-b89b0dfd1e50.jpeg',
  '/images/photo-1636347172071-6d17b1139816.jpeg',
  '/images/photo-1637166185518-058f5896a2e9.jpeg',
]

// Storytelling messages that will appear during the animation
const impactMessages = [
  'Step into Innovation',
  'Experience Premium',
  'Explore Next-Gen Design',
  'Welcome to the Future',
]

// 3D floating sphere component
const FloatingSphere = ({ position, imageUrl, scale = 1, speed = 1 }) => {
  const texture = useTexture(imageUrl)
  const meshRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.2
      meshRef.current.rotation.y = time * 0.2 * speed
      meshRef.current.rotation.z = time * 0.1 * speed
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.4}
          metalness={0.8}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  )
}

// Portal effect component
const PortalEffect = ({ active, imageUrl }) => {
  const { gl, scene, camera } = useThree()
  const portalRef = useRef()
  const texture = useTexture(imageUrl)

  useEffect(() => {
    if (active && portalRef.current) {
      gsap.to(portalRef.current.scale, {
        x: 4,
        y: 4,
        z: 4,
        duration: 1.5,
        ease: 'power3.in',
      })

      gsap.to(portalRef.current.rotation, {
        y: Math.PI * 2,
        duration: 1.5,
        ease: 'power2.inOut',
      })

      gsap.to(portalRef.current.material, {
        opacity: 0,
        duration: 1,
        delay: 0.8,
        ease: 'power2.in',
      })
    }
  }, [active])

  return (
    <mesh ref={portalRef} position={[0, 0, -3]}>
      <torusGeometry args={[2, 0.5, 16, 100]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
        emissive="#5352ED"
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}

// Scene component to hold all 3D objects
const Scene = ({ activeImage, portalActive }) => {
  return (
    <Suspense fallback={null}>
      <Environment preset="night" />

      <FloatingSphere
        position={[-3, 0, -5]}
        imageUrl={backgroundImages[0]}
        scale={1.2}
        speed={0.8}
      />

      <FloatingSphere
        position={[3, 1, -7]}
        imageUrl={backgroundImages[1]}
        scale={1.5}
        speed={1.2}
      />

      <FloatingSphere
        position={[-2, -2, -4]}
        imageUrl={backgroundImages[2]}
        scale={0.8}
        speed={1.5}
      />

      <PortalEffect active={portalActive} imageUrl={activeImage} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
    </Suspense>
  )
}

const EntryExperience = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  const [activeMessageIndex, setActiveMessageIndex] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [portalActive, setPortalActive] = useState(false)
  const containerRef = useRef(null)
  const imagesRef = useRef([])
  const messageRef = useRef(null)
  const buttonRef = useRef(null)
  const canvasRef = useRef(null)
  const lenis = useStore(({ lenis }) => lenis)
  const introOut = useStore(({ introOut }) => introOut)
  const setIntroOut = useStore(({ setIntroOut }) => setIntroOut)

  // Debug to ensure component is mounting and reset introOut if needed
  useEffect(() => {
    console.log('EntryExperience mounted', { showLoading, isLoaded, introOut })

    // Force introOut to false on mount to ensure the component stays visible
    if (introOut) {
      console.log('Resetting introOut to false')
      setIntroOut(false)
    }

    // Ensure we're not accidentally starting lenis
    if (lenis) {
      lenis.stop()
      document.documentElement.classList.toggle('intro', true)
    }

    return () => {
      console.log('EntryExperience unmounted')
    }
  }, [])

  // Initialize the animations on load
  useEffect(() => {
    if (!isLoaded) return

    console.log('EntryExperience loaded, initializing animations')

    // Stop scrolling while in entry experience
    if (lenis) {
      lenis.stop()
      document.documentElement.classList.toggle('intro', true)
    }

    // Setup GSAP animations
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Enable button interaction after intro animation
        if (buttonRef.current) {
          gsap.to(buttonRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
          })
        }
      },
    })

    // Animate the first image to show
    tl.to(imagesRef.current[0], {
      opacity: 1,
      scale: 1.05,
      duration: 1.5,
      delay: 0.5,
    })

    // Animate the first message
    tl.to(
      messageRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
      },
      '-=0.5'
    )

    // Setup 3D Canvas
    if (canvasRef.current) {
      gsap.to(canvasRef.current, {
        opacity: 1,
        duration: 1.5,
      })
    }

    // Setup image rotation interval
    const imageInterval = setInterval(() => {
      if (hasEntered) {
        clearInterval(imageInterval)
        return
      }

      const nextIndex = (currentImageIndex + 1) % backgroundImages.length
      setCurrentImageIndex(nextIndex)

      // Crossfade to next image
      gsap.to(imagesRef.current[currentImageIndex], {
        opacity: 0,
        scale: 1,
        duration: 1,
      })

      gsap.to(imagesRef.current[nextIndex], {
        opacity: 1,
        scale: 1.05,
        duration: 1.5,
      })

      // Change message text
      const nextMessageIndex = (activeMessageIndex + 1) % impactMessages.length

      gsap.to(messageRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        onComplete: () => {
          setActiveMessageIndex(nextMessageIndex)
          gsap.to(messageRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
          })
        },
      })
    }, 4000)

    return () => {
      clearInterval(imageInterval)
    }
  }, [isLoaded, currentImageIndex, activeMessageIndex, hasEntered, lenis])

  // Handle tap to enter
  const handleEnter = () => {
    setHasEntered(true)
    setPortalActive(true)

    // Play audio cue if available - comment out until a real audio file is added
    /*
    try {
      const audio = new Audio('/audio/portal-sound.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {
        // Silent fallback if audio can't play
      })
    } catch (e) {
      // Handle browser audio restrictions
    }
    */

    // Animate elements out
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 1.5,
      delay: 0.5,
      onComplete: () => {
        // Enable scrolling and remove the component
        if (lenis) {
          lenis.start()
          document.documentElement.classList.toggle('intro', false)
        }
        setIntroOut(true)
      },
    })

    // Create portal effect
    gsap.to(imagesRef.current[currentImageIndex], {
      scale: 1.5,
      opacity: 0,
      duration: 1.2,
    })

    gsap.to(buttonRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 0.5,
    })

    gsap.to(messageRef.current, {
      y: -50,
      opacity: 0,
      duration: 0.5,
    })
  }

  return (
    <>
      {showLoading ? (
        <Loading
          onComplete={() => {
            console.log('Loading complete, showing main experience')
            setShowLoading(false)
            setIsLoaded(true)
          }}
        />
      ) : (
        <div className={s.container} ref={containerRef}>
          {/* Background Images */}
          <div className={s.imagesContainer}>
            {backgroundImages.map((src, index) => (
              <div
                key={index}
                className={s.imageWrapper}
                ref={(el) => (imagesRef.current[index] = el)}
                style={{
                  opacity: index === 0 ? 0.5 : 0,
                  zIndex: backgroundImages.length - index,
                }}
              >
                <Image
                  src={src}
                  alt="Background Visual"
                  fill
                  priority={index < 3}
                  sizes="100vw"
                  className={s.backgroundImage}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>

          {/* 3D Canvas Overlay */}
          <div className={s.canvasContainer} ref={canvasRef}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <Scene
                activeImage={backgroundImages[currentImageIndex]}
                portalActive={portalActive}
              />
            </Canvas>
          </div>

          {/* Message Overlay */}
          <div className={s.messageContainer}>
            <div className={s.message} ref={messageRef}>
              {impactMessages[activeMessageIndex]}
            </div>
          </div>

          {/* Tap to Enter Button */}
          <div className={s.buttonContainer} ref={buttonRef}>
            <Button className={s.enterButton} onClick={handleEnter}>
              Tap to Enter
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default EntryExperience
