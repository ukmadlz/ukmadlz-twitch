import Fetch from 'node-fetch'
import * as styles from './embarrass.css'

export default function EmbarrassComponent({ prompt }: any): JSX.Element {
    console.log('I am slightly ashamed')
    const clipID = prompt.split(' by ')[0];
    const parent = process.env.NEXT_PUBLIC_SITE_DOMAIN || process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost';
    const iframeUrl = `https://clips.twitch.tv/embed?muted=false&autoplay=true&clip=${clipID}&parent=${parent}`;
    console.log(iframeUrl)
    return ( 
        <div className={styles.embarrassedContainer}>
            <p>Sorry if this doesn't load, twitch kinda sucks and OBS hurts to debug</p>
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