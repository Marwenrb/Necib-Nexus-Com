import { useMediaQuery, useRect } from '@darkroom.engineering/hamo'
import cn from 'clsx'
import gsap from 'gsap'
import { useScroll } from 'hooks/use-scroll'
import { clamp, mapRange } from 'lib/maths'
import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'

import s from './horizontal-slides.module.scss'

export const HorizontalSlides = ({ children }) => {
  const elementRef = useRef(null)
  const cardRefs = useRef([])
  const isMobile = useMediaQuery('(max-width: 800px)')
  const [wrapperRectRef, wrapperRect] = useRect()
  const [elementRectRef, elementRect] = useRect()

  const { height: windowHeight } = useWindowSize()

  const [windowWidth, setWindowWidth] = useState()

  useScroll(({ scroll }) => {
    if (!elementRect || !elementRef.current) return

    const start = wrapperRect.top - windowHeight
    const end = wrapperRect.top + wrapperRect.height - windowHeight

    let progress = mapRange(start, end, scroll, 0, 1)
    progress = clamp(0, progress, 1)

    const x = progress * (elementRect.width - windowWidth)

    const cards = [...elementRef.current.children]

    gsap.to(cards, {
      x: -x,
      stagger: 0.033,
      ease: 'none',
      duration: 0,
    })
  })

  useEffect(() => {
    const onResize = () => {
      setWindowWidth(
        Math.min(window.innerWidth, document.documentElement.offsetWidth)
      )
    }

    window.addEventListener('resize', onResize, false)
    onResize()

    return () => {
      window.removeEventListener('resize', onResize, false)
    }
  }, [])

  useEffect(() => {
    if (!isMobile) return

    // Set up intersection observer for mobile cards
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(s['in-view'])
        } else {
          entry.target.classList.remove(s['in-view'])
        }
      })
    }, options)

    // Observe all card elements
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => {
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card)
      })
    }
  }, [isMobile])

  const setCardRef = (el, index) => {
    cardRefs.current[index] = el
  }

  return (
    <div
      className={s.wrapper}
      ref={wrapperRectRef}
      style={
        elementRect && isMobile === false
          ? { height: elementRect.width + 'px' }
          : {}
      }
    >
      <div className={s.inner}>
        <div
          ref={(node) => {
            elementRef.current = node
            elementRectRef(node)
          }}
          className={cn(s.overflow, 'hide-on-mobile')}
        >
          {children}
        </div>
        <div className={cn(s.cards, 'hide-on-desktop')}>
          {Array.isArray(children) ? 
            children.map((child, i) => (
              <div key={i} ref={(el) => setCardRef(el, i)}>
                {child}
              </div>
            )) : 
            <div ref={(el) => setCardRef(el, 0)}>
              {children}
            </div>
          }
        </div>
      </div>
    </div>
  )
}
