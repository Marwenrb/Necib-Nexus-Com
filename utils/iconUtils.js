/**
 * Icon Utility Functions
 * Provides helper functions for the premium icon system
 */

/**
 * Generate a uniqueID for icons
 * @returns {string} Unique identifier
 */
export const generateIconId = () => {
  return `icon_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create a copy to clipboard function
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy: ', err)
    return false
  }
}

/**
 * Generate usage example code for icons
 * @param {string} iconName - Name of the icon
 * @param {string} size - Size of the icon
 * @param {string} color - Color of the icon
 * @returns {string} Example code
 */
export const generateIconUsageExample = (
  iconName,
  size = '24',
  color = 'currentColor'
) => {
  return `<Icon name="${iconName}" size={${size}} color="${color}" />`
}

/**
 * Filter icons based on search term
 * @param {Object} icons - Icons object
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered icons
 */
export const filterIcons = (icons, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return Object.keys(icons)
  }

  const term = searchTerm.toLowerCase().trim()
  return Object.keys(icons).filter((name) => name.toLowerCase().includes(term))
}

/**
 * Add haptic feedback for mobile devices
 * @param {string} type - Type of haptic feedback
 */
export const hapticFeedback = (type = 'medium') => {
  if (!window.navigator.vibrate) return

  switch (type) {
    case 'light':
      window.navigator.vibrate(10)
      break
    case 'medium':
      window.navigator.vibrate(15)
      break
    case 'strong':
      window.navigator.vibrate([10, 30, 10])
      break
    default:
      window.navigator.vibrate(15)
  }
}

/**
 * Create animation variants for icons
 * @param {number} delay - Animation delay
 * @returns {Object} Animation variants
 */
export const createIconAnimationVariants = (delay = 0) => {
  return {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1],
        delay: 0.1 + delay * 0.03,
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: 'easeIn',
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  }
}

/**
 * Format icon name for display
 * @param {string} name - Icon name
 * @returns {string} Formatted name
 */
export const formatIconName = (name) => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}
