import React from 'react'
import cn from 'clsx'
import { Button } from 'components/button'
import { Link } from 'components/link'
import { FiMail, FiPhone } from 'react-icons/fi'
import { FaTwitter, FaLinkedin, FaGlobe, FaHeart } from 'react-icons/fa'
import s from './footer.module.scss'
import { BrandMarquee } from './components/BrandMarquee'

export const Footer = () => {
  return (
    <footer className={cn('theme-dark', s.footer)}>
      <div className={s.partners}>
        <h2 className={s.partnersTitle}>Our Strategic Partners</h2>
        <BrandMarquee />
      </div>
      
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
      
      <div className={s.mainFooter}>
        <div className={s.contactInfo}>
          <div className={s.contactItem}>
            <FiMail className={s.contactIcon} />
            <a href="mailto:contact@necibnexus.com" className={s.contactText}>contact@necibnexus.com</a>
          </div>
          <div className={s.contactItem}>
            <FiPhone className={s.contactIcon} />
            <a href="tel:+213079696895" className={s.contactText}>+213 07 96 96 98 95</a>
          </div>
        </div>
        
        <div className={s.socialLinks}>
          <a href="https://twitter.com/necibnexus" target="_blank" rel="noreferrer" className={s.socialIcon}>
            <FaTwitter />
          </a>
          <a href="https://linkedin.com/company/necibnexus" target="_blank" rel="noreferrer" className={s.socialIcon}>
            <FaLinkedin />
          </a>
          <a href="https://necibnexus.com" target="_blank" rel="noreferrer" className={s.socialIcon}>
            <FaGlobe />
          </a>
        </div>
      </div>
      
      <div className={s.bottom}>
        <div className={s.copyright}>
          <p className={cn('p-xs', s.tm)}>
            <span>©</span> {new Date().getFullYear()} Necib Nexus
          </p>
        </div>
        
        <div className={s.developerCredit}>
          <div className={s.devCreditInline}>
            <span className={s.madeWithText}>Made with</span>
            <div className={s.heartContainer}>
              <FaHeart className={s.heartAnimation} />
            </div>
            <span className={s.byText}>by</span>
            <a href="https://marwenrabai.strikingly.com" target="_blank" rel="noreferrer" className={s.devCreditLink}>
              <span className={s.devName}>Marwen Rabai</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
