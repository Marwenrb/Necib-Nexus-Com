import cn from 'clsx'
import { Link } from 'components/link'
import { useStore } from 'lib/store'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import s from './navigation.module.scss'

export const Navigation = () => {
  const [navIsOpen, setNavIsOpen] = useStore(
    (state) => [state.navIsOpen, state.setNavIsOpen],
    shallow
  )

  const router = useRouter()

  useEffect(() => {
    const onRouteChange = () => {
      setNavIsOpen(false)
    }

    router.events.on('routeChangeStart', onRouteChange)

    return () => {
      router.events.off('routeChangeStart', onRouteChange)
    }
  }, [])

  return (
    <div className={cn(s.navigation, !navIsOpen && s.closed)}>
      <Link href="/">Home</Link>
      <Link href="#digital-culture">Digital Culture</Link>
      <Link href="#e-tourism">E-Tourism</Link>
      <Link href="#audiovisual">Audiovisual</Link>
      <Link href="#development">Development</Link>
      <Link href="#marketing">Marketing</Link>
      <Link href="#innovation">Innovation Lab</Link>
      <Link href="/contact">Contact</Link>
    </div>
  )
}
