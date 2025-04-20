import cn from 'clsx'
import Image from 'next/image'
import s from './enhanced-card.module.scss'

export const EnhancedCard = ({
  number,
  text,
  className,
  inverted,
  background = 'rgba(14, 14, 14, 0.15)',
  imageSrc,
}) => {
  return (
    <div
      className={cn(className, s.wrapper, inverted && s.inverted)}
      style={{ '--background': background }}
    >
      <div className={s.imageContainer}>
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={text}
            fill
            className={s.image}
            sizes="(max-width: 800px) 343px, 400px"
          />
        )}
        <div className={s.overlay}></div>
      </div>
      <div className={s.content}>
        {number && (
          <p className={s.number}>{number.toString().padStart(2, '0')}</p>
        )}
        {text && <p className={s.text}>{text}</p>}
      </div>
    </div>
  )
} 