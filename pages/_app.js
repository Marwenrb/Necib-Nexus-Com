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

// Loader component
const PageLoader = () => {
  return (
    <div className="page-loader">
      <div className="loader-circle"></div>
      <div className="loader-logo">
        <svg width="120" height="120" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="256" cy="256" r="200" fill="#5352ED" fillOpacity="0.05" />
          <path d="M175 170V342M175 170L230 342M175 170H230M230 170V342" stroke="#5352ED" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M280 170V342M280 170L335 342M280 170H335M335 170V342" stroke="#5352ED" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <style jsx>{`
        .page-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: var(--theme-primary);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .loader-circle {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 3px solid rgba(83, 82, 237, 0.1);
          border-top: 3px solid #5352ED;
          animation: spin 1s linear infinite;
        }
        .loader-logo {
          opacity: 0.95;
          animation: pulse 1.5s ease-in-out infinite alternate;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          100% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

function MyApp({ Component, pageProps, router }) {
  const lenis = useStore(({ lenis }) => lenis)
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [])

  ScrollTrigger.defaults({ markers: false })

  return (
    <>
      <Favicon 
        themeColor="#5352ED" 
        title="Necib Nexus" 
        description="Innovation et excellence en développement web"
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
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        <Component {...pageProps} key={router.route} />
      </div>
    </>
  )
}

export default MyApp
