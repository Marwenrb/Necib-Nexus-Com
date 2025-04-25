import { useState, useEffect } from 'react'
import { useWindowSize } from 'react-use'

/**
 * Custom hook to get the size of the window or a specific element
 * Returns width and height of the window if no ref is provided
 */
export function useSize(ref) {
  const windowSize = useWindowSize()
  const [size, setSize] = useState({
    width: windowSize.width || 0,
    height: windowSize.height || 0,
  })

  useEffect(() => {
    // If no ref is provided, return window size
    if (!ref) {
      setSize({
        width: windowSize.width || 0,
        height: windowSize.height || 0,
      })
      return
    }

    // Setup resize observer for the provided ref
    if (ref.current && typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect
        setSize({ width, height })
      })

      observer.observe(ref.current)

      return () => {
        observer.disconnect()
      }
    }

    // Fallback to manually measuring if ResizeObserver is not available
    const handleResize = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        setSize({
          width: rect.width,
          height: rect.height,
        })
      }
    }

    handleResize() // Initial measurement
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [ref, windowSize.width, windowSize.height])

  return size
}
