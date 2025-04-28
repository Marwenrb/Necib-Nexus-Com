import { useRect } from '@darkroom.engineering/hamo'
import cn from 'clsx'

import { Card } from 'components/card'
import { useScroll } from 'hooks/use-scroll'
import { clamp, mapRange } from 'lib/maths'
import dynamic from 'next/dynamic'
import { useRef, useState, useCallback } from 'react'
import { useWindowSize } from 'react-use'

const AppearTitle = dynamic(
  () => import('components/appear-title').then((mod) => mod.AppearTitle),
  { ssr: false }
)

import s from './feature-cards.module.scss'

const cards = [
  {
    text: 'Digital Culture Immersion',
    image: '/images/FeatureCards-Images/Digital Culture Immersion.jpeg',
  },
  {
    text: 'E-Tourism Solutions',
    image: '/images/FeatureCards-Images/E-Tourism-sOLUTIONS.jpeg',
  },
  {
    text: (
      <>
        Audiovisual <br />
        Production
      </>
    ),
    image: '/images/FeatureCards-Images/AUDIOVISUAL PRODUCTION.jpeg',
  },
  {
    text: 'Web & App Development',
    image: '/images/FeatureCards-Images/WEB & APP DEVLOPMENT.jpeg',
  },
  {
    text: 'DIGITAL MARKETING STRATEGIES',
    image: '/images/FeatureCards-Images/DIGITAL MARKETING STRATEGIES.jpeg',
  },
  {
    text: 'Innovation Lab & AR/VR Experiences',
    image: '/images/FeatureCards-Images/Innovation Lab & ARVR Experiences.jpeg',
  },
  {
    text: 'Events Organization',
    image: '/images/FeatureCards-Images/Events-F3.jpeg',
  },
  {
    text: 'Cultural Heritage Preservation',
    image: '/images/FeatureCards-Images/Cultural Heritage Preservation.jpg',
  },
  {
    text: 'Immersive storytelling',
    image: '/images/FeatureCards-Images/Immersive storytelling.jpeg',
  },
]

export const FeatureCards = () => {
  const element = useRef()
  const [setRef, rect] = useRect()
  const { width: windowWidth, height: windowHeight } = useWindowSize()

  const [current, setCurrent] = useState()
  const [rotation, setRotation] = useState(0)
  const isMobile = windowWidth < 768

  useScroll(
    ({ scroll }) => {
      if (isMobile) {
        const startOffset = rect.top - windowHeight
        const visibleHeight = windowHeight * cards.length
        const scrollProgress = clamp(0, mapRange(startOffset, startOffset + visibleHeight, scroll, 0, 1), 1)
        
        const newRotation = scrollProgress * 360
        setRotation(newRotation)
      } else {
        const start = rect.top - windowHeight * 2
        const end = rect.top + rect.height - windowHeight

        const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)

        element.current.style.setProperty(
          '--progress',
          clamp(0, mapRange(rect.top, end, scroll, 0, 1), 1)
        )
        const step = Math.floor(progress * 10)
        setCurrent(step)
      }
    },
    [rect, windowWidth]
  )

  return (
    <div
      ref={(node) => {
        setRef(node)
      }}
      className={s.features}
    >
      <div className={cn('layout-block-inner', s.sticky)}>
        <aside className={s.title}>
          <p className="h3">
            <AppearTitle>
              Necib Nexus
              <br />
              <span className="grey">services</span>
            </AppearTitle>
          </p>
        </aside>
        <div ref={element} className={s.cardsWrapper}>
          {cards.map((card, index) => (
            <SingleCard
              key={index}
              index={index}
              text={card.text}
              image={card.image}
              rotation={isMobile ? rotation : 0}
              current={!isMobile && index <= current - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const SingleCard = ({ text, image, index, rotation, current }) => {
  const cardRef = useRef(null)
  const { width: windowWidth } = useWindowSize()
  const isMobile = windowWidth < 768

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || isMobile) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateY = (x - centerX) / 20
    const rotateX = (centerY - y) / 20

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [isMobile])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current || isMobile) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)'
  }, [isMobile])

  let style = {}
  if (isMobile) {
    const cardPosition = (index * (360 / cards.length)) % 360
    
    const rotationDiff = ((cardPosition - rotation) % 360 + 360) % 360
    const normalizedDiff = rotationDiff > 180 ? 360 - rotationDiff : rotationDiff
    
    const opacity = Math.max(0, 1 - (normalizedDiff / 90))
    
    style = {
      transform: `translate(-50%, -50%) rotateY(${cardPosition - rotation}deg) translateZ(500px)`,
      opacity: opacity,
    }
  }

  return (
    <div
      ref={cardRef}
      className={cn(s.card, { [s.current]: current })}
      style={isMobile ? style : { '--i': index }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card background="rgba(239, 239, 239, 0.8)" text={text} image={image} />
    </div>
  )
}
