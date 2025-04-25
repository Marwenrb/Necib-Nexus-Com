import Tempus from '@darkroom.engineering/tempus'
import { RealViewport } from 'components/real-viewport'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useScroll } from 'hooks/use-scroll'
import { GTM_ID } from 'lib/analytics'
import { useStore } from 'lib/store'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import 'styles/global.scss'
import Favicon from 'components/Favicon'
import { startTransition } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.defaults({ markers: false })

  // merge rafs
  gsap.ticker.lagSmoothing(0)
  gsap.ticker.remove(gsap.updateRoot)
  Tempus.add((time) => {
    startTransition(() => {
      gsap.updateRoot(time / 1000)
    })
  }, 0)
}

// Cube Loader component
const PageLoader = () => {
  const [progress, setProgress] = useState(15)

  // Simulate loading progress
  useEffect(() => {
    let startTime = performance.now()
    let animationFrame

    const simulateProgress = (timestamp) => {
      const elapsed = timestamp - startTime

      // Accelerate initial progress, then slow down
      let newProgress
      if (elapsed < 500) {
        // Start fast (15-50% in first 500ms)
        newProgress = 15 + Math.min(35, (elapsed / 500) * 35)
      } else if (elapsed < 1500) {
        // Slow down in middle (50-85% in next 1000ms)
        newProgress = 50 + Math.min(35, ((elapsed - 500) / 1000) * 35)
      } else {
        // Very slow at end (85-95% in remaining time)
        newProgress = 85 + Math.min(10, ((elapsed - 1500) / 1000) * 10)
      }

      setProgress(newProgress)

      // Continue animation until we hit 95%
      if (newProgress < 95) {
        animationFrame = requestAnimationFrame(simulateProgress)
      }
    }

    // Start progress animation
    animationFrame = requestAnimationFrame(simulateProgress)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className="page-loader">
      <div className="loader-content">
        <div className="cube-container">
          <div className="cube-loader">
            <div className="cube-top"></div>
            <div className="cube-wrapper">
              <span style={{ '--i': 0 }} className="cube-span"></span>
              <span style={{ '--i': 1 }} className="cube-span"></span>
              <span style={{ '--i': 2 }} className="cube-span"></span>
              <span style={{ '--i': 3 }} className="cube-span"></span>
            </div>
          </div>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="loading-text">Loading experience</p>
      </div>
      <style jsx>{`
        .page-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: var(--theme-primary, #000);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          transition: opacity 0.5s ease;
        }

        .loader-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .cube-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
        }

        .cube-loader {
          position: relative;
          width: 75px;
          height: 75px;
          transform-style: preserve-3d;
          transform: rotateX(-30deg);
          animation: animate 4s linear infinite;
        }

        @keyframes animate {
          0% {
            transform: rotateX(-30deg) rotateY(0);
          }
          100% {
            transform: rotateX(-30deg) rotateY(360deg);
          }
        }

        .cube-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .cube-span {
          position: absolute;
          width: 100%;
          height: 100%;
          transform: rotateY(calc(90deg * var(--i))) translateZ(37.5px);
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(83, 82, 237, 0.3) 5.5%,
            rgba(83, 82, 237, 0.4) 12.1%,
            rgba(83, 82, 237, 0.5) 19.6%,
            rgba(83, 82, 237, 0.6) 27.9%,
            rgba(83, 82, 237, 0.7) 36.6%,
            rgba(83, 82, 237, 0.75) 45.6%,
            rgba(83, 82, 237, 0.8) 54.6%,
            rgba(83, 82, 237, 0.85) 63.4%,
            rgba(83, 82, 237, 0.9) 71.7%,
            rgba(83, 82, 237, 0.95) 79.4%,
            rgba(83, 82, 237, 1) 86.2%,
            rgba(83, 82, 237, 1) 91.9%,
            rgba(83, 82, 237, 1) 96.3%,
            rgba(83, 82, 237, 1) 99%,
            rgba(83, 82, 237, 1) 100%
          );
        }

        .cube-top {
          position: absolute;
          width: 75px;
          height: 75px;
          background: #000;
          transform: rotateX(90deg) translateZ(37.5px);
          transform-style: preserve-3d;
        }

        .cube-top::before {
          content: '';
          position: absolute;
          width: 75px;
          height: 75px;
          background: #5352ed;
          transform: translateZ(-90px);
          filter: blur(10px);
          box-shadow: 0 0 10px #000, 0 0 20px #5352ed, 0 0 30px #000,
            0 0 40px rgba(83, 82, 237, 0.7);
        }

        .progress-container {
          width: 200px;
          height: 2px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(83, 82, 237, 0.7) 0%,
            rgba(83, 82, 237, 1) 100%
          );
          transition: width 0.3s ease;
          box-shadow: 0 0 8px rgba(83, 82, 237, 0.7);
        }

        .loading-text {
          font-size: 14px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #5352ed;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

function MyApp({ Component, pageProps, router }) {
  const lenis = useStore(({ lenis }) => lenis)
  const [loading, setLoading] = useState(true)

  useScroll((state) => {
    startTransition(() => {
      ScrollTrigger.update()
    })
  })

  useEffect(() => {
    if (lenis) {
      startTransition(() => {
        ScrollTrigger.refresh()
        lenis?.start()
      })
    }
  }, [lenis])

  useEffect(() => {
    window.history.scrollRestoration = 'manual'

    // Hide loader after a short delay to ensure all resources are loaded
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  ScrollTrigger.defaults({ markers: false })

  return (
    <>
      <Favicon
        themeColor="#5352ED"
        title="Necib Nexus"
        description="Innovation et excellence en développement web"
      />
      {/* Script to ensure favicon is refreshed */}
      <Script
        id="favicon-refresh"
        strategy="afterInteractive"
        src="/favicon-cache-refresh.js"
      />
      {/* Google Tag Manager - Global base code */}
      {process.env.NODE_ENV !== 'development' && (
        <>
          <Script
            async
            strategy="worker"
            src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
          />
          <Script
            id="gtm-base"
            strategy="worker"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GTM_ID}');`,
            }}
          />
        </>
      )}

      <RealViewport />
      {loading && <PageLoader />}
      <div
        style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease' }}
      >
        <Component {...pageProps} key={router.route} />
      </div>
    </>
  )
}

export default MyApp
