import { useMediaQuery } from '@darkroom.engineering/hamo'
import cn from 'clsx'
import { useStore } from 'lib/store'
import { useEffect, useState } from 'react'
import s from './intro.module.scss'
import Image from 'next/image'

export const Intro = () => {
  const isMobile = useMediaQuery('(max-width: 800px)')
  const [isLoaded, setIsLoaded] = useState(false)
  const [scroll, setScroll] = useState(false)
  const introOut = useStore(({ introOut }) => introOut)
  const setIntroOut = useStore(({ setIntroOut }) => setIntroOut)
  const lenis = useStore(({ lenis }) => lenis)

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 1000)
  }, [])

  useEffect(() => {
    if (isMobile) {
      lenis.start()
      document.documentElement.classList.toggle('intro', false)
      return
    }

    if (!scroll) {
      document.documentElement.classList.toggle('intro', true)
    }

    if (!lenis) return
    if (scroll) {
      lenis.start()
      document.documentElement.classList.toggle('intro', false)
    } else {
      setTimeout(() => {
        lenis.stop()
      }, 0)

      document.documentElement.classList.toggle('intro', true)
    }
  }, [scroll, lenis, isMobile])

  return (
    <div
      className={cn(s.wrapper, isLoaded && s.out)}
      onTransitionEnd={(e) => {
        e.target.classList.forEach((value) => {
          if (value.includes('out')) {
            setScroll(true)
          }
          if (value.includes('show')) {
            setIntroOut(true)
          }
        })
      }}
    >
      <div className={cn(isLoaded && s.relative)}>
        <div className={s.logo}>
          <Image 
            src="/images/Minimalist Pink Silhouette Globe on Black Stand Necib Nexus Logo.jpeg" 
            alt="Necib Nexus Logo" 
            width={300} 
            height={300}
            className={cn(s.logoImage, isLoaded && s.show)} 
          />
        </div>
      </div>
    </div>
  )
}

export const Title = ({ className }) => {
  const introOut = useStore(({ introOut }) => introOut)

  return (
    <div className={className}>
      <div className={s.logo}>
        <Image 
          src="/images/Minimalist Pink Silhouette Globe on Black Stand Necib Nexus Logo.jpeg" 
          alt="Necib Nexus Logo" 
          width={200} 
          height={200}
          className={cn(s.logoImage, introOut && s.translate, s.mobile)} 
        />
      </div>
    </div>
  )
}

// Keep these for compatibility, but they won't be used
const LNS = ({ isLoaded, className, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1360 336"
      className={cn(s.lns, className)}
    >
      {/* Existing SVG content */}
    </svg>
  )
}

const EI = ({ isLoaded, className, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 1360 336"
      className={cn(s.ei, className)}
    >
      {/* Existing SVG content */}
    </svg>
  )
}
