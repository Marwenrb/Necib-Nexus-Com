import React, { useEffect } from 'react';
import Head from 'next/head';

/**
 * Premium Favicon component to standardize the brand identity across all devices and browsers
 * Ensures consistent Necib Nexus branding on all browser tabs and bookmarks with modern design
 */
const Favicon = ({ 
  // Logo path
  logoSvg = '/favicon.svg',
  // Necib Nexus premium brand colors
  themeColor = '#6441A5',
  backgroundColor = '#ffffff',
  // Brand information
  title = 'Necib Nexus',
  // Description for the metadata
  description = 'Global digital innovation transforming visions into immersive realities'
}) => {
  // Add favicon link elements dynamically
  useEffect(() => {
    // Create dynamic link for favicon that updates when theme changes
    const faviconLink = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    if (faviconLink) {
      faviconLink.href = logoSvg;
    }
  }, [logoSvg]);

  return (
    <Head>
      {/* Standard Favicon */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href={logoSvg} type="image/svg+xml" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Apple Touch Icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color={themeColor} />
      
      {/* Android/PWA manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Windows/Microsoft specific */}
      <meta name="msapplication-TileColor" content={themeColor} />
      <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Theme color for browser UI */}
      <meta name="theme-color" content={themeColor} />
      
      {/* SEO metadata */}
      <meta name="description" content={description} />
      
      {/* Open Graph for social sharing */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/og.png" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Necib Nexus" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/og.png" />
      
      {/* Mobile app capability for both iOS and Android */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={title} />
      
      {/* Additional iOS specific settings */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-touch-fullscreen" content="yes" />
    </Head>
  );
};

export default Favicon; 