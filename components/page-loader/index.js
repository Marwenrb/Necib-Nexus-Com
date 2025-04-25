import { useEffect, useState } from 'react'
import s from './page-loader.module.scss'

export function PageLoader() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  // Optimize loader with faster initial appearance and smoother progress
  useEffect(() => {
    let startTime = performance.now()
    let animationFrame
    let timeoutId

    // Immediately show initial progress
    setProgress(15)

    // Simulate load progress with optimized animation
    const simulateProgress = (timestamp) => {
      const elapsed = timestamp - startTime

      // Accelerate initial progress, then slow down
      let newProgress
      if (elapsed < 500) {
        // Start fast (0-50% in first 500ms)
        newProgress = Math.min(50, (elapsed / 500) * 50)
      } else if (elapsed < 1500) {
        // Slow down in middle (50-85% in next 1000ms)
        newProgress = 50 + Math.min(35, ((elapsed - 500) / 1000) * 35)
      } else {
        // Very slow at end (85-95% in remaining time)
        newProgress = 85 + Math.min(10, ((elapsed - 1500) / 2000) * 10)
      }

      setProgress(newProgress)

      // Continue animation until we hit 95%
      if (newProgress < 95) {
        animationFrame = requestAnimationFrame(simulateProgress)
      }
    }

    // Start progress animation
    animationFrame = requestAnimationFrame(simulateProgress)

    // Force complete after maximum loading time (3.5s)
    timeoutId = setTimeout(() => {
      cancelAnimationFrame(animationFrame)

      // Complete progress and fade out
      setProgress(100)

      // Hide after animation completes
      setTimeout(() => {
        setVisible(false)
      }, 500)
    }, 3500)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(timeoutId)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={s.loader} style={{ opacity: progress === 100 ? 0 : 1 }}>
      <div className={s.content}>
        <div className={s.cubeContainer}>
          <div className={s.cubeLoader}>
            <div className={s.cubeTop}></div>
            <div className={s.cubeWrapper}>
              <span style={{ '--i': 0 }} className={s.cubeSpan}></span>
              <span style={{ '--i': 1 }} className={s.cubeSpan}></span>
              <span style={{ '--i': 2 }} className={s.cubeSpan}></span>
              <span style={{ '--i': 3 }} className={s.cubeSpan}></span>
            </div>
          </div>
        </div>
        <div className={s.progressContainer}>
          <div className={s.progressBar} style={{ width: `${progress}%` }} />
        </div>
        <p className={s.loadingText}>Loading experience</p>
      </div>
    </div>
  )
}
