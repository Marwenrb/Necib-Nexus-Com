import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import cn from 'clsx'
import s from './entry-experience.module.scss'

const Loading = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const progressBarRef = useRef(null)
  const counterRef = useRef(null)
  const loadingTextRef = useRef(null)
  const containerRef = useRef(null)

  // Log for debugging
  useEffect(() => {
    console.log('Loading component mounted')
    return () => console.log('Loading component unmounted')
  }, [])

  useEffect(() => {
    // Simulating asset loading with a timed progress
    const startLoading = () => {
      console.log('Starting loading animation')
      // Setup initial animations
      gsap.set(progressBarRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
      })

      gsap.set(counterRef.current, {
        opacity: 1,
      })

      gsap.set(loadingTextRef.current, {
        opacity: 1,
      })

      // Progress from 0 to 100 with randomized pauses
      let currentProgress = 0

      const incrementProgress = () => {
        // Random progress increment between 1 and 5
        const increment = Math.floor(Math.random() * 5) + 1

        // Calculate new progress value
        currentProgress = Math.min(100, currentProgress + increment)

        // Update UI
        setProgress(currentProgress)

        // Update progress bar width
        gsap.to(progressBarRef.current, {
          duration: 0.3,
          scaleX: currentProgress / 100,
          ease: 'power1.out',
        })

        // Continue until 100%
        if (currentProgress < 100) {
          // Random pause between increments (100-300ms)
          const delay = Math.random() * 200 + 100
          setTimeout(incrementProgress, delay)
        } else {
          // Complete animation once we reach 100%
          finishLoading()
        }
      }

      const finishLoading = () => {
        console.log('Finishing loading animation')
        // Finish animation
        gsap.to(progressBarRef.current, {
          duration: 0.5,
          scaleX: 1,
          ease: 'power2.inOut',
        })

        gsap.to([counterRef.current, loadingTextRef.current], {
          duration: 0.5,
          opacity: 0,
          y: -20,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            // Fade out entire loading screen
            gsap.to(containerRef.current, {
              duration: 0.8,
              opacity: 0,
              ease: 'power2.inOut',
              onComplete: () => {
                console.log('Loading animation complete, calling onComplete')
                if (onComplete) onComplete()
              },
            })
          },
        })
      }

      // Start progress animation after a slight delay
      setTimeout(incrementProgress, 500)
    }

    startLoading()
  }, [onComplete])

  return (
    <div
      className={cn(s.loadingContainer, 'loading-container')}
      ref={containerRef}
    >
      <div className={s.loadingContent}>
        <div className={s.loadingText} ref={loadingTextRef}>
          Initializing Experience
        </div>

        <div className={s.progressContainer}>
          <div className={s.progressBar}>
            <div className={s.progressFill} ref={progressBarRef}></div>
          </div>
          <div className={s.progressCounter} ref={counterRef}>
            {progress}%
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading
