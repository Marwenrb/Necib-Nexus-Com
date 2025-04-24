import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@darkroom.engineering/hamo';
import s from './who-we-are.module.scss';
import Image from 'next/image';

export const WhoWeAre = ({ features }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const paragraphRefs = useRef([]);
  const bgParallaxRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [scrollY, setScrollY] = useState(0);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply parallax effect to background
  useEffect(() => {
    if (bgParallaxRef.current) {
      // Use CSS animations for mobile instead of JS parallax
      if (isMobile) {
        bgParallaxRef.current.style.transform = '';
        return;
      }
      
      const translateY = scrollY * 0.15; // Parallax coefficient
      bgParallaxRef.current.style.transform = `translateY(${translateY}px)`;
    }
  }, [scrollY, isMobile]);

  // Initialize ScrollMagic and GSAP animations
  useEffect(() => {
    if (animationsInitialized) return;

    // Dynamically import dependencies to avoid SSR issues
    const importDependencies = async () => {
      try {
        // Check if libraries are already loaded globally
        if (typeof window !== 'undefined') {
          // Make sure we have access to the window object (client-side only)
          if (window.gsap && window.ScrollMagic) {
            // Ensure TextPlugin is registered correctly
            if (window.gsap.TextPlugin) {
              window.gsap.registerPlugin(window.gsap.TextPlugin);
              initAnimations(window.gsap, window.ScrollMagic);
              return;
            }
          }
          
          // If libraries not available or TextPlugin not registered, wait a bit
          // to ensure scripts from _document.js have loaded
          setTimeout(() => {
            if (window.gsap && window.ScrollMagic) {
              // Safe registration of TextPlugin
              try {
                if (window.gsap.TextPlugin) {
                  window.gsap.registerPlugin(window.gsap.TextPlugin);
                }
                initAnimations(window.gsap, window.ScrollMagic);
              } catch (err) {
                console.warn("Could not register TextPlugin:", err);
                // Still try to initialize with basic animations
                initAnimations(window.gsap, window.ScrollMagic);
              }
            }
          }, 500); // Increased timeout for script loading
        }
      } catch (error) {
        console.error('Error loading animation dependencies:', error);
      }
    };

    importDependencies();
  }, [animationsInitialized]);

  // Initialize all animations
  const initAnimations = (gsap, ScrollMagic) => {
    if (!sectionRef.current || !titleRef.current) return;
    
    // Create ScrollMagic controller
    const controller = new ScrollMagic.Controller();
    
    // 3D Title Animation
    const titleTimeline = gsap.timeline();
    titleTimeline
      .fromTo(
        titleRef.current,
        { 
          y: -30, 
          opacity: 0,
          rotationX: isMobile ? 15 : 45,
          transformPerspective: 800,
          transformOrigin: "center bottom"
        },
        { 
          y: 0, 
          opacity: 1,
          rotationX: 0,
          duration: isMobile ? 0.8 : 1.2,
          ease: "power3.out" 
        }
      );
    
    // Title Scene with adjusted trigger hook for mobile
    new ScrollMagic.Scene({
      triggerElement: titleRef.current,
      triggerHook: isMobile ? 0.9 : 0.85,
      reverse: false
    })
    .setTween(titleTimeline)
    .addTo(controller);
    
    // Animate each paragraph with typing effect 
    paragraphRefs.current.forEach((para, index) => {
      if (!para) return;
      
      // Store original text
      const originalText = para.textContent;
      
      // Create basic fade-in animation that works without TextPlugin
      const paraTimeline = gsap.timeline();
      
      // Initial reveal animation - faster on mobile
      paraTimeline.fromTo(
        para,
        { 
          y: isMobile ? 10 : 20, 
          opacity: 0,
          filter: isMobile ? 'blur(2px)' : 'blur(4px)'
        },
        { 
          y: 0, 
          opacity: 1,
          filter: 'blur(0px)',
          duration: isMobile ? 0.4 : 0.6,
          ease: "power2.out"
        }
      );
      
      // If TextPlugin is available, add typing effect
      if (gsap.TextPlugin && !isMobile) {
        // Only use typing effect on non-mobile devices
        // First clear the text
        para.textContent = '';
        
        // Then add typing effect
        paraTimeline.to(
          para,
          {
            duration: 1.8 - (index * 0.1),
            text: {
              value: originalText,
              delimiter: ""
            },
            ease: "none"
          },
          "-=0.2"
        );
      }
      
      // Create scene for each paragraph
      new ScrollMagic.Scene({
        triggerElement: para,
        triggerHook: isMobile ? 0.8 : 0.75,
        reverse: false
      })
      .setTween(paraTimeline)
      .addTo(controller);
      
      // Add feature highlight effect
      if (para.parentNode) {
        const featureItem = para.parentNode;
        
        new ScrollMagic.Scene({
          triggerElement: featureItem,
          triggerHook: isMobile ? 0.75 : 0.7,
          reverse: false
        })
        .setTween(
          gsap.fromTo(
            featureItem,
            { 
              x: isMobile ? 0 : (index % 2 === 0 ? -20 : 20),
              y: isMobile ? 20 : 0,
              opacity: 0,
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
            },
            { 
              x: 0,
              y: 0,
              opacity: 1,
              boxShadow: '0 15px 40px rgba(83, 82, 237, 0.15)',
              duration: isMobile ? 0.6 : 0.8,
              ease: "power2.out",
              delay: isMobile ? index * 0.1 : index * 0.15
            }
          )
        )
        .addTo(controller);
      }
    });
    
    // Mark animations as initialized
    setAnimationsInitialized(true);
  };

  return (
    <section id="who-we-are" className={s.whoWeAre} ref={sectionRef}>
      {/* Enhanced parallax background elements */}
      <div className={s.parallaxBackground} ref={bgParallaxRef}>
        <div className={s.bgCircle1}></div>
        <div className={s.bgCircle2}></div>
        <div className={s.bgGrid}></div>
        
        {/* Background image with overlay */}
        <div className={s.backgroundImage}>
          <Image 
            src="/images/FeatureCards-Images/Immersive storytelling.jpeg" 
            alt="Immersive storytelling"
            layout="fill"
            objectFit="cover"
            quality={95}
            priority
          />
        </div>
        
        {/* New premium design elements */}
        <div className={s.designElements}></div>
      </div>
      
      <div className={s.container}>
        <h2 id="section-title" className={s.sectionTitle} ref={titleRef}>
          <span className={s.titleFirstPart}>Who</span> 
          <span className={s.titleSecondPart}>We Are</span>
        </h2>
        
        <div id="content" className={s.content}>
          {features && features.map((feature, index) => (
            <div key={index} className={`${s.featureItem} ${index === 0 ? s.mainFeature : ''}`}>
              {feature.title && <h3 className={s.featureTitle}>{feature.title}</h3>}
              <p 
                id={`paragraph${index+1}`} 
                className={s.featureContent}
                ref={el => paragraphRefs.current[index] = el}
              >
                {feature.content}
              </p>
              <div className={s.featureDecoration}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre; 