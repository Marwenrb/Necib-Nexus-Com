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
  const { height: windowHeight } = useWindowSize()

  const [current, setCurrent] = useState()

  useScroll(
    ({ scroll }) => {
      const start = rect.top - windowHeight * 2
      const end = rect.top + rect.height - windowHeight

      const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)

      element.current.style.setProperty(
        '--progress',
        clamp(0, mapRange(rect.top, end, scroll, 0, 1), 1)
      )
      const step = Math.floor(progress * 10)
      setCurrent(step)
    },
    [rect]
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
        <div ref={element}>
          {cards.map((card, index) => (
            <SingleCard
              key={index}
              index={index}
              text={card.text}
              image={card.image}
              current={index <= current - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const SingleCard = ({ text, image, index, current }) => {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateY = (x - centerX) / 20
    const rotateX = (centerY - y) / 20

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform =
      'perspective(1000px) rotateX(0) rotateY(0)'
  }, [])

  return (
    <div
      ref={cardRef}
      className={cn(s.card, current && s.current)}
      style={{ '--i': index }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card background="rgba(239, 239, 239, 0.8)" text={text} image={image} />
    </div>
  )
}
