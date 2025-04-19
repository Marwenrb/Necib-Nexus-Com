import { forwardRef } from 'react'
import s from './header.module.scss'
import Image from 'next/image'
import { Link } from 'components/link'

export const Header = forwardRef((_, ref) => {
  return (
    <header className={s.header} ref={ref}>
      <div className="layout-block">
        <div className={s.logo}>
          <Link href="/">
            <Image 
              src="/images/Minimalist Pink Silhouette Globe on Black Stand Necib Nexus Logo.jpeg" 
              alt="Necib Nexus Logo" 
              width={50} 
              height={50} 
            />
          </Link>
        </div>
      </div>
    </header>
  )
})

Header.displayName = 'Header'
