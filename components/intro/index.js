import { useMediaQuery } from '@darkroom.engineering/hamo'
import cn from 'clsx'
import { useStore } from 'lib/store'
import { useEffect, useState, useRef } from 'react'
import s from './intro.module.scss'
import Image from 'next/image'

export const Intro = () => {
  const isMobile = useMediaQuery('(max-width: 800px)')
  const [isLoaded, setIsLoaded] = useState(false)
  const [scroll, setScroll] = useState(false)
  const introOut = useStore(({ introOut }) => introOut)
  const setIntroOut = useStore(({ setIntroOut }) => setIntroOut)
  const lenis = useStore(({ lenis }) => lenis)
  const [typedText, setTypedText] = useState('')
  const fullText = "NECIB NEXUS"
  const typingSpeed = 100 // ms per character
  const typingRef = useRef(null)
  const cursorRef = useRef(null)
  const logoRef = useRef(null)

  // Typing animation
  useEffect(() => {
    let currentIndex = 0;
    if (typingRef.current) clearTimeout(typingRef.current);
    
    const typeNextChar = () => {
      if (currentIndex < fullText.length) {
        setTypedText(fullText.substring(0, currentIndex + 1));
        currentIndex++;
        typingRef.current = setTimeout(typeNextChar, typingSpeed);
      } else {
        // Animation complete, start 3D animation
        startLogoAnimation();
        
        // Then trigger loader completion after a delay
        setTimeout(() => {
          setIsLoaded(true);
        }, 1500);
      }
    };
    
    // Start typing after a small delay
    typingRef.current = setTimeout(typeNextChar, 500);
    
    // Cursor blink animation
    let isVisible = true;
    cursorRef.current = setInterval(() => {
      const cursor = document.querySelector(`.${s.cursor}`);
      if (cursor) {
        cursor.style.opacity = isVisible ? 1 : 0;
        isVisible = !isVisible;
      }
    }, 530);
    
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
      if (cursorRef.current) clearInterval(cursorRef.current);
    };
  }, []);
  
  // 3D Animation for logo
  const startLogoAnimation = () => {
    if (!logoRef.current) return;
    
    const logo = logoRef.current;
    logo.style.transform = 'scale(1)';
    logo.style.opacity = '1';
    
    // Add 3D rotation effect
    let frameId;
    let angle = 0;
    
    const animate = () => {
      angle += 0.5;
      
      // Create 3D rotation effect
      logo.style.transform = `scale(1) rotateY(${angle}deg) perspective(1000px)`;
      
      // Continue animation until component unmounts
      frameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  };

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
        <div className={s.typingContainer}>
          <div className={s.typingWrapper}>
            <span className={s.typedText}>{typedText}</span>
            <span className={s.cursor}>|</span>
          </div>
          <div 
            className={cn(s.logoWrapper, typedText === fullText && s.showLogo)}
            ref={logoRef}
          >
            <Image 
              src="/images/Black Minimal Necib Nexus Ads.png" 
              alt="Necib Nexus Logo" 
              width={300} 
              height={300}
              className={cn(s.logoImage, isLoaded && s.show)}
              priority 
              loading="eager"
              fetchPriority="high"
            />
          </div>
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
          src="/images/Black Minimal Necib Nexus Ads.png" 
          alt="Necib Nexus Logo" 
          width={200} 
          height={200}
          className={cn(s.logoImage, introOut && s.translate, s.mobile)}
          priority 
          loading="eager"
        />
      </div>
    </div>
  )
}

// Simplified header component with improved design
export const Header = () => {
  return (
    <header className={s.header}>
      <div className={s.headerLogo}>
        <Image 
          src="/images/Black Minimal Necib Nexus Ads.png" 
          alt="Necib Nexus Logo" 
          width={120} 
          height={40}
          className={s.headerLogoImage} 
        />
      </div>
      <div className={s.headerControls}>
        <button className={s.headerButton}>
          Explore
        </button>
        <button className={s.headerButton}>
          Connect
        </button>
      </div>
    </header>
  )
}

// Sponsors/Partners Section
export const SponsorsSection = () => {
  return (
    <section className={s.sponsorshipSection}>
      <h2 className={s.sponsorshipTitle}>Our Strategic Partners</h2>
      <div className={s.sponsorshipWrapper}>
        {/* This section will be replaced by the BrandMarquee in the footer */}
      </div>
    </section>
  );
};

// For backwards compatibility, keep these basic components but don't use unnecessary icons
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
