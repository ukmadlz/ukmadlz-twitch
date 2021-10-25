import Fetch from 'node-fetch'
import * as styles from './embarrass.css'

export default function EmbarrassComponent({ rewardId, prompt }: any): JSX.Element {
    const clipID = prompt.split(' by ')[0];
    const parent = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.NEXT_SITE_DOMAIN || 'localhost';
    return ( 
        <div className={styles.embarrassedContainer}>
            <iframe
                src={`https://clips.twitch.tv/embed?muted=false&autoplay=true&clip=${clipID}&parent=${parent}`}
                frameBorder="0"
                allowFullScreen={true}
                scrolling="no"
                height="378"
                width="620"
            ></iframe>
        </div>
        )
  }