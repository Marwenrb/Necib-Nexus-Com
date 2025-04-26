import React, { useEffect, useState } from 'react'
import Head from 'next/head'

/**
 * Premium Favicon component with interactive features for modern devices and browsers
 * Provides dynamic theming, preloading for performance, and interactive color changes based on user preference
 */
const Favicon = ({
  // Logo paths
  logoSvg = '/favicon.svg',
  // Necib Nexus premium brand colors
  themeColor = '#5352ED',
  backgroundColor = '#ffffff',
  // Brand information
  title = 'Necib Nexus',
  // Description for the metadata
  description = 'Global digital innovation transforming visions into immersive realities',
}) => {
  const [prefersDark, setPrefersDark] = useState(false)
  const [isPageActive, setIsPageActive] = useState(true)

  // Handle system theme preference changes
  useEffect(() => {
    // Check system preference for dark mode
    if (typeof window !== 'undefined') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setPrefersDark(darkModeMediaQuery.matches)

      // Update when preference changes
      const handleChange = (e) => setPrefersDark(e.matches)
      darkModeMediaQuery.addEventListener('change', handleChange)
      
      return () => darkModeMediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Handle page visibility changes for tab switching experience
  useEffect(() => {
    if (typeof document === 'undefined') return

    const handleVisibilityChange = () => {
      setIsPageActive(document.visibilityState === 'visible')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Add favicon link elements dynamically
  useEffect(() => {
    // Create dynamic link for favicon that updates when theme changes
    const faviconLink = document.querySelector(
      'link[rel="icon"][type="image/svg+xml"]'
    )
    if (faviconLink) {
      faviconLink.href = logoSvg
    }

    // If page becomes inactive, update title to remind user of open tab
    if (!isPageActive) {
      document.title = `🔔 ${title} is still open`
    } else {
      document.title = title
    }

  }, [logoSvg, prefersDark, isPageActive, title])

  // Set appropriate theme color based on user's preference
  const adaptiveThemeColor = prefersDark ? '#2a2a5e' : themeColor

  return (
    <Head>
      {/* Standard Favicon with preloading for faster loading */}
      <link rel="preload" href="/favicon.ico" as="image" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href={logoSvg} type="image/svg+xml" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />

      {/* Apple Touch Icons with preloading for key sizes */}
      <link rel="preload" href="/apple-touch-icon.png" as="image" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/apple-touch-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/apple-touch-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/apple-touch-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/apple-touch-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href="/apple-touch-icon-76x76.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href="/apple-touch-icon-72x72.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="60x60"
        href="/apple-touch-icon-60x60.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href="/apple-touch-icon-57x57.png"
      />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color={adaptiveThemeColor} />

      {/* Android/PWA manifest with preloading */}
      <link rel="preload" href="/site.webmanifest" as="fetch" crossOrigin="anonymous" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Windows/Microsoft specific */}
      <meta name="msapplication-TileColor" content={adaptiveThemeColor} />
      <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
      <meta name="msapplication-config" content="/browserconfig.xml" />

      {/* Theme color for browser UI - adaptive based on user preference */}
      <meta name="theme-color" content={adaptiveThemeColor} />

      {/* SEO metadata */}
      <meta name="description" content={description} />

      {/* Open Graph for social sharing */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/og.png" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Necib Nexus" />

      {/* Twitter Card with preloading for image */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/og.png" />

      {/* Mobile app capability for both iOS and Android with improved UX */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content={prefersDark ? "black" : "black-translucent"}
      />
      <meta name="apple-mobile-web-app-title" content={title} />

      {/* Additional iOS specific settings for better user experience */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-touch-fullscreen" content="yes" />
    </Head>
  )
}

export default Favicon
