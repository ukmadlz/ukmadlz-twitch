import React from 'react'
import * as styles from './footer.css'
import { vars } from '../styles/var.css'

export default function FooterComponent () {
    return (
        <footer className={styles.footer} >
          <div className={styles.colourBar} />
          <div className={styles.footerContainer} >
            <div className={styles.logoContainer} >
              <img
                className={styles.logo}
                src="/assets/mike_elsmore_white.svg"
                alt="Mike Elsmore"
              />
            </div>
          </div>
        </footer>
        )
}