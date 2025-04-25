// This script helps ensure the browser loads the latest favicons by adding a cache-busting query parameter
document.addEventListener('DOMContentLoaded', function () {
  // Current timestamp to use as cache-buster
  const cacheBuster = Date.now()

  // Function to update favicon links with cache-busting parameter
  function updateFavicons() {
    // Select all favicon-related link elements
    const faviconLinks = document.querySelectorAll(
      'link[rel*="icon"], link[rel="apple-touch-icon"], link[rel="mask-icon"]'
    )

    // Update each link with a cache-busting query parameter
    faviconLinks.forEach((link) => {
      const currentHref = link.getAttribute('href')
      if (currentHref && !currentHref.includes('?v=')) {
        link.setAttribute('href', `${currentHref}?v=${cacheBuster}`)
      }
    })

    // Also update theme color meta tag
    const themeColorTag = document.querySelector('meta[name="theme-color"]')
    if (themeColorTag) {
      themeColorTag.setAttribute('content', '#5352ED')
    }

    console.log('Favicon cache refreshed with timestamp:', cacheBuster)
  }

  // Run the update
  updateFavicons()
})
