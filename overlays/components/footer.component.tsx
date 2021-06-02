import React from 'react'
import Image from 'next/image'
import * as styles from './footer.css'
import { vars } from '../styles/var.css'

export default function FooterComponent () {
    return (
        <footer className={styles.footer} >
          <div className={styles.colourBar} />
          <div className={styles.footerContainer} >
            <div className={styles.logoContainer} >
              <Image
                src="/assets/mike_elsmore_white.svg"
                alt="Mike Elsmore"
                width={216}
                height={72}
              />
            </div>
          </div>
        </footer>
        )
}