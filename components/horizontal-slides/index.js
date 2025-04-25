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
  const [visibleCardIndex, setVisibleCardIndex] = useState(-1)
  const [fullyVisibleCards, setFullyVisibleCards] = useState([])

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

    // Advanced sequential revealing of cards as user scrolls
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      cardRefs.current.forEach((card, index) => {
        if (!card) return

        const rect = card.getBoundingClientRect()
        const cardTop = rect.top
        const cardHeight = rect.height

        // Calculate how far the card is in the viewport
        const visiblePercentage = 1 - cardTop / windowHeight

        // Make card visibility sequential but more independent for text to show properly
        if (index === 0 || (index > 0 && index <= visibleCardIndex + 1)) {
          if (visiblePercentage > 0.15) {
            if (!card.classList.contains('in-view')) {
              card.classList.add('in-view')
              card.classList.add(s['in-view'])
              setVisibleCardIndex(Math.max(visibleCardIndex, index))

              // Add fully-visible class for floating animation after reveal
              setTimeout(() => {
                if (card.classList.contains('in-view')) {
                  card.classList.add(s['fully-visible'])
                  card.classList.add('fully-visible')
                  setFullyVisibleCards((prev) => [...new Set([...prev, index])])
                }
              }, 1000) // Delay adding floating effect
            }
          } else if (visiblePercentage < 0.05) {
            // Only hide cards if scrolling back up significantly
            card.classList.remove('in-view')
            card.classList.remove(s['in-view'])
            card.classList.remove(s['fully-visible'])
            card.classList.remove('fully-visible')

            if (visibleCardIndex === index) {
              setVisibleCardIndex(index - 1)
            }
            setFullyVisibleCards((prev) => prev.filter((i) => i !== index))
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile, visibleCardIndex, fullyVisibleCards])

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
          {Array.isArray(children) ? (
            children.map((child, i) => (
              <div
                key={i}
                ref={(el) => setCardRef(el, i)}
                className="card-wrapper"
              >
                {child}
              </div>
            ))
          ) : (
            <div ref={(el) => setCardRef(el, 0)} className="card-wrapper">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
