import cn from 'clsx'
import s from './card.module.scss'
import Image from 'next/image'

export const Card = ({
  number,
  text,
  className,
  inverted,
  background = 'rgba(14, 14, 14, 0.15)',
  image,
}) => {
  return (
    <div
      className={cn(className, s.wrapper, inverted && s.inverted)}
      style={{ '--background': background }}
    >
      {image && (
        <div className={s.imageContainer}>
          <Image 
            src={image} 
            alt={text} 
            width={400} 
            height={300} 
            className={s.image}
          />
        </div>
      )}
      {text && <p className={s.text}>{text}</p>}
    </div>
  )
}
