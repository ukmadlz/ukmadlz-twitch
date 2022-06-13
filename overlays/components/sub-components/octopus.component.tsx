import * as styles from './octopus.css'
import Kraken from './kraken.component';

export default function OctopusSubComponent({ counter }: { counter: number } ): JSX.Element {
  console.log('Throw a kraken')
  return <div>
      <img
        className={styles.octopusGif}
        src="/images/OCTOPUS.gif"
        alt="Release the Octopus!"
      />
      <Kraken counter={counter} />
    </div>
}