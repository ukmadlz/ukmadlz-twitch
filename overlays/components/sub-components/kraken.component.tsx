import * as styles from './kraken.css'

export default function Kraken({ counter }: { counter: number }): JSX.Element {
    return ( 
      <div className={styles.krakenCounterContainer}>
          <h1>Krakens Released</h1>
          <h1>{counter}</h1>
      </div>
    )
  }