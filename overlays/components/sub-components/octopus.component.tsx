import * as styles from './octopus.css'

export default function OctopusSubComponent(): JSX.Element {
  return <img
    className={styles.octopusGif}
    src="/images/OCTOPUS.gif"
    alt="Release the Octopus!"
  />
}