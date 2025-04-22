import React, { useEffect } from 'react';
import Head from 'next/head';

/**
 * Favicon component to standardize the brand identity across all devices and browsers
 * Ensures consistent Necib Nexus branding on all browser tabs and bookmarks
 */
const Favicon = ({ 
  // Logo path
  logoSvg = '/images/logo.svg',
  // Necib Nexus brand colors
  themeColor = '#5352ED',
  backgroundColor = '#ffffff',
  // Brand information
  title = 'Necib Nexus',
  // Description for the metadata
  description = 'Innovation et excellence en développement web'
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
      {/* Basic favicons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href={logoSvg} type="image/svg+xml" />
      
      {/* Apple Touch Icons for iOS devices */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color={themeColor} />
      
      {/* Android/PWA manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Windows/Microsoft specific */}
      <meta name="msapplication-TileColor" content={themeColor} />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Theme color for browser UI */}
      <meta name="theme-color" content={themeColor} />
      
      {/* SEO metadata */}
      <meta name="description" content={description} />
      
      {/* Open Graph for social sharing */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/og-image.png" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Necib Nexus" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="/og-image.png" />
      
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