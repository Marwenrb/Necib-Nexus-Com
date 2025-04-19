import cn from 'clsx'
import { Button } from 'components/button'
import { Link } from 'components/link'
import dynamic from 'next/dynamic'
import s from './footer.module.scss'

export const Footer = () => {
  return (
    <footer className={cn('theme-light', s.footer)}>
      <div className={cn(s.top, 'layout-grid hide-on-mobile')}>
        <p className={cn(s['first-line'], 'h1')}>
          Necib Nexus <br />
          <span className="contrast">Innovation</span>
        </p>
        <p className={cn(s['last-line'], 'h1')}>
          Ready to create <span className="hide-on-desktop">&nbsp;</span> something <br /> extraordinary
        </p>
        <Button
          className={s.cta}
          arrow
          href="/contact"
        >
          Let's connect
        </Button>
      </div>
      <div className={cn(s.top, 'layout-block hide-on-desktop')}>
        <p className={cn(s['first-line'], 'h1')}>
          Necib Nexus <br />
          <span className="contrast">Innovation</span>
          <br /> Ready to create <br /> something extraordinary
        </p>
      </div>
      <div className={s.bottom}>
        <div className={s.links}>
          <Link
            className={cn(s.link, 'p-xs')}
            href="https://twitter.com/necibnexus"
          >
            Twitter
          </Link>
          <Link
            className={cn(s.link, 'p-xs')}
            href="https://linkedin.com/company/necibnexus"
          >
            LinkedIn
          </Link>
          <Link
            className={cn(s.link, 'p-xs')}
            href="https://necibnexus.com/"
          >
            Website
          </Link>
        </div>
        <p className={cn('p-xs', s.tm)}>
          <span>©</span> {new Date().getFullYear()} Necib Nexus
        </p>
        <Button
          className={cn(s.cta, 'hide-on-desktop')}
          arrow
          href="/contact"
        >
          Let's connect
        </Button>
      </div>
    </footer>
  )
}
