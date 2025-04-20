import { useFrame, useRect } from '@darkroom.engineering/hamo'
import cn from 'clsx'

import { Button } from 'components/button'
import { Card } from 'components/card'
import { Title } from 'components/intro'
import { Link } from 'components/link'
import { ListItem } from 'components/list-item'
import { projects } from 'content/projects'
import { useScroll } from 'hooks/use-scroll'
import { Layout } from 'layouts/default'
import { clamp, mapRange } from 'lib/maths'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useIntersection, useWindowSize } from 'react-use'
import s from './home.module.scss'
import { Modal } from 'components/modal'

// const SFDR = dynamic(() => import('icons/sfdr.svg'), { ssr: false })
const GitHub = dynamic(() => import('icons/github.svg'), { ssr: false })
const Sponsor = dynamic(() => import('icons/sponsor.svg'), { ssr: false })

const Parallax = dynamic(
  () => import('components/parallax').then((mod) => mod.Parallax),
  { ssr: false }
)

const AppearTitle = dynamic(
  () => import('components/appear-title').then((mod) => mod.AppearTitle),
  { ssr: false }
)

const HorizontalSlides = dynamic(
  () =>
    import('components/horizontal-slides').then((mod) => mod.HorizontalSlides),
  { ssr: false }
)

const FeatureCards = dynamic(
  () => import('components/feature-cards').then((mod) => mod.FeatureCards),
  { ssr: false }
)

const WebGL = dynamic(
  () => import('components/webgl').then(({ WebGL }) => WebGL),
  { ssr: false }
)

const HeroTextIn = ({ children, introOut }) => {
  return (
    <div className={cn(s['hide-text'], introOut && s['show-text'])}>
      {children}
    </div>
  )
}

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
}

export default function Home() {
  const [hasScrolled, setHasScrolled] = useState()
  const zoomRef = useRef(null)
  const [zoomWrapperRectRef, zoomWrapperRect] = useRect()
  const { height: windowHeight } = useWindowSize()
  const introOut = useStore(({ introOut }) => introOut)

  const [theme, setTheme] = useState('dark')
  const lenis = useStore(({ lenis }) => lenis)

  useEffect(() => {
    if (!lenis) return

    function onClassNameChange(lenis) {
      // Class name change handler
    }

    lenis.on('className change', onClassNameChange)

    return () => {
      lenis.off('className change', onClassNameChange)
    }
  }, [lenis])

  useScroll(({ scroll }) => {
    setHasScrolled(scroll > 10)
    if (!zoomWrapperRect.top) return

    const start = zoomWrapperRect.top + windowHeight * 0.5
    const end = zoomWrapperRect.top + zoomWrapperRect.height - windowHeight

    const progress = clamp(0, mapRange(start, end, scroll, 0, 1), 1)
    const center = 0.6
    const progress1 = clamp(0, mapRange(0, center, progress, 0, 1), 1)
    const progress2 = clamp(0, mapRange(center - 0.055, 1, progress, 0, 1), 1)
    setTheme(progress2 === 1 ? 'light' : 'dark')

    zoomRef.current.style.setProperty('--progress1', progress1)
    zoomRef.current.style.setProperty('--progress2', progress2)

    if (progress === 1) {
      zoomRef.current.style.setProperty('background-color', 'currentColor')
    } else {
      zoomRef.current.style.removeProperty('background-color')
    }
  })

  const [whyRectRef, whyRect] = useRect()
  const [cardsRectRef, cardsRect] = useRect()
  const [whiteRectRef, whiteRect] = useRect()
  const [featuresRectRef, featuresRect] = useRect()
  const [inuseRectRef, inuseRect] = useRect()

  const addThreshold = useStore(({ addThreshold }) => addThreshold)

  useEffect(() => {
    addThreshold({ id: 'top', value: 0 })
  }, [])

  useEffect(() => {
    const top = whyRect.top - windowHeight / 2
    addThreshold({ id: 'why-start', value: top })
    addThreshold({
      id: 'why-end',
      value: top + whyRect.height,
    })
    
    // Add more thresholds for the advanced 3D model transitions
    addThreshold({ id: 'model-transition-1', value: top + (whyRect.height * 0.2) })
    addThreshold({ id: 'model-transition-2', value: top + (whyRect.height * 0.4) })
    addThreshold({ id: 'model-transition-3', value: top + (whyRect.height * 0.6) })
    addThreshold({ id: 'model-transition-4', value: top + (whyRect.height * 0.8) })
  }, [whyRect])

  useEffect(() => {
    const top = cardsRect.top - windowHeight / 2
    addThreshold({ id: 'cards-start', value: top })
    addThreshold({ id: 'cards-end', value: top + cardsRect.height })
    addThreshold({
      id: 'red-end',
      value: top + cardsRect.height + windowHeight,
    })
    
    // Add more thresholds for the advanced 3D model transitions
    addThreshold({ id: 'model-transition-5', value: top + (cardsRect.height * 0.25) })
    addThreshold({ id: 'model-transition-6', value: top + (cardsRect.height * 0.5) })
    addThreshold({ id: 'model-transition-7', value: top + (cardsRect.height * 0.75) })
  }, [cardsRect])

  useEffect(() => {
    const top = whiteRect.top - windowHeight
    addThreshold({ id: 'light-start', value: top })
    
    // Add more thresholds for the advanced 3D model transitions
    addThreshold({ id: 'model-transition-8', value: top + (windowHeight * 0.5) })
  }, [whiteRect])

  useEffect(() => {
    const top = featuresRect.top
    addThreshold({ id: 'features', value: top })
    
    // Add more thresholds for the final 3D model transitions
    addThreshold({ id: 'model-transition-9', value: top + (featuresRect.height * 0.5) })
  }, [featuresRect])

  useEffect(() => {
    const top = inuseRect.top
    addThreshold({ id: 'in-use', value: top })
  }, [inuseRect])

  useEffect(() => {
    const top = lenis?.limit
    addThreshold({ id: 'end', value: top })
  }, [lenis?.limit])

  const inUseRef = useRef()

  const [visible, setIsVisible] = useState(false)
  const intersection = useIntersection(inUseRef, {
    threshold: 0.2,
  })
  useEffect(() => {
    if (intersection?.isIntersecting) {
      setIsVisible(true)
    }
  }, [intersection])

  return (
    <Layout
      theme={theme}
      seo={{
        title: 'Necib Nexus | Redefining Digital Experiences',
        description:
          'Necib Nexus transforms your vision into immersive digital realities, offering expertise in digital culture, e-tourism, audiovisual production, web/app development, and digital marketing.',
      }}
      className={s.home}
    >
      <div className={s.canvas}>
        <WebGL />
      </div>

      <Modal />

      <section className={s.hero}>
        <div className="layout-grid-inner">
          <Title className={s.title} />
          {/* <SFDR className={cn(s.icon, introOut && s.show)} /> */}
          <span className={cn(s.sub)}>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('h3', s.subtitle)}>Digital Innovation</h2>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <h2 className={cn('p-xs', s.tm)}>
                <span>©</span> {new Date().getFullYear()} Necib Nexus
              </h2>
            </HeroTextIn>
          </span>
        </div>

        <div className={cn(s.bottom, 'layout-grid')}>
          <div
            className={cn(
              'hide-on-mobile',
              s['scroll-hint'],
              hasScrolled && s.hide,
              introOut && s.show
            )}
          >
            <div className={s.text}>
              <HeroTextIn introOut={introOut}>
                <p>scroll</p>
              </HeroTextIn>
              <HeroTextIn introOut={introOut}>
                <p> to explore</p>
              </HeroTextIn>
            </div>
          </div>
          <h1 className={cn(s.description, 'p-s')}>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">Pull people in.</p>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">Make them feel.</p>
            </HeroTextIn>
            <HeroTextIn introOut={introOut}>
              <p className="p-s">Leave them thinking.</p>
            </HeroTextIn>
          </h1>
          <Button
            className={cn(s.cta, s.documentation, introOut && s.in)}
            arrow
            href="/services"
          >
            our services
          </Button>
          <Button
            className={cn(s.cta, s.sponsor, introOut && s.in)}
            arrow
            href="/contact"
          >
            get in touch
          </Button>
        </div>
      </section>

      <section className={s.why}>
        <div className="layout-grid">
          <h2 className={cn(s.sticky, 'h2')}>
            <AppearTitle>Who we are</AppearTitle>
          </h2>
          <aside className={s.features} ref={whyRectRef}>
            <div className={s.feature}>
              <p className="p">
                Necib Nexus is a global digital innovation company that transforms visions into immersive realities. With creative brilliance and technical expertise, we deliver unforgettable experiences for leading brands worldwide.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
                Create immersive digital experiences
              </h3>
              <p className="p">
                Unlock the creative potential and impact of your digital presence. Our innovative approach pulls users into an immersive flow that transforms ordinary interactions into extraordinary experiences.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
                Tailor solutions for every platform
              </h3>
              <p className="p">
                Give all your users the same exceptional experience whether they're on desktop, mobile, or immersive platforms. With our expertise, you control how engaging, intuitive, and responsive your digital presence becomes.
              </p>
            </div>
            <div className={s.feature}>
              <h3 className={cn(s.title, 'h4')}>
                Seamless integration of technology
              </h3>
              <p className="p">
                We seamlessly blend cutting-edge technologies with creative design to create flawless digital experiences. Our team ensures perfect synchronization between visuals, interactions, and performance across all platforms.
              </p>
            </div>
          </aside>
        </div>
      </section>
      <section className={s.rethink}>
        <div className={cn('layout-grid', s.pre)}>
          <div className={s.highlight}>
            <Parallax speed={-0.5}>
              <p className="h2">
                <AppearTitle>Our Services</AppearTitle>
              </p>
            </Parallax>
          </div>
          <div className={s.comparison}>
            <Parallax speed={0.5}>
              <p className="p">
                At Necib Nexus, we offer a comprehensive range of digital services designed to transform your vision into reality. From cultural immersion to cutting-edge technology, we have the expertise to elevate your digital presence.
              </p>
            </Parallax>
          </div>
        </div>
        <div className={s.cards} ref={cardsRectRef}>
          <HorizontalSlides>
            <Card
              className={s.card}
              number="01"
              text="Digital Culture: Crafting immersive digital narratives that celebrate and preserve cultural heritage."
            />
            <Card
              className={s.card}
              number="02"
              text="E-Tourism: Revolutionizing travel experiences with cutting-edge digital solutions."
            />
            <Card
              className={s.card}
              number="03"
              text="Audiovisual Production: Producing stunning visuals and soundscapes that captivate audiences."
            />
            <Card
              className={s.card}
              number="04"
              text="Web & App Development: Building robust, user-centric websites and applications."
            />
            <Card
              className={s.card}
              number="05"
              text="Digital Marketing: Driving engagement and growth through strategic digital campaigns."
            />
            <Card
              className={s.card}
              number="06"
              text="Innovation Lab: Pioneering the future with AR, VR, and experimental technologies."
            />
          </HorizontalSlides>
        </div>
      </section>
      <section
        ref={(node) => {
          zoomWrapperRectRef(node)
          zoomRef.current = node
        }}
        className={s.solution}
      >
        <div className={s.inner}>
          <div className={s.zoom}>
            <h2 className={cn(s.first, 'h1 vh')}>
              digital solutions <br />
              <span className="contrast">that inspire</span>
            </h2>
            <h2 className={cn(s.enter, 'h3 vh')}>
              Necib <br /> Nexus
            </h2>
            <h2 className={cn(s.second, 'h1 vh')}>Immersive innovation</h2>
          </div>
        </div>
      </section>
      <section className={cn('theme-light', s.featuring)} ref={whiteRectRef}>
        <div className={s.inner}>
          <div className={cn('layout-block', s.intro)}>
            <p className="p-l">
              Necib Nexus is committed to pushing the boundaries of digital innovation. Our multidisciplinary team combines technical expertise with creative vision to deliver solutions that stand out in today's crowded digital landscape.
            </p>
          </div>
        </div>
        <section ref={featuresRectRef}>
          <FeatureCards />
        </section>
      </section>
      <section
        ref={(node) => {
          inuseRectRef(node)
          inUseRef.current = node
        }}
        className={cn('theme-light', s['in-use'], visible && s.visible)}
      >
        <div className="layout-grid">
          <aside className={s.title}>
            <p className="h3">
              <AppearTitle>
                Our
                <br />
                <span className="grey">clients</span>
              </AppearTitle>
            </p>
          </aside>
          <ul className={s.list}>
            <li>
              <ListItem
                title="TechCorp"
                source="Tech Industry"
                href="#"
                index={0}
                visible={visible}
              />
            </li>
            <li>
              <ListItem
                title="TravelNow"
                source="Tourism Sector"
                href="#"
                index={1}
                visible={visible}
              />
            </li>
            <li>
              <ListItem
                title="CultureHub"
                source="Cultural Institution"
                href="#"
                index={2}
                visible={visible}
              />
            </li>
            <li>
              <ListItem
                title="MediaVibe"
                source="Entertainment"
                href="#"
                index={3}
                visible={visible}
              />
            </li>
          </ul>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {
      id: 'home',
    },
  }
}
