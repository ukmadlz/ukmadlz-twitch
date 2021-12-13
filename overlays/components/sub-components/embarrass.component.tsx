import Fetch from 'node-fetch'
import { Video } from 'cloudinary-react';
import * as styles from './embarrass.css'

export default function EmbarrassComponent({ prompt }: any): JSX.Element {
    const clipID = prompt.split(' by ')[0];
    const parent = process.env.NEXT_PUBLIC_SITE_DOMAIN || process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost';
    const iframeUrl = `https://clips.twitch.tv/embed?muted=false&autoplay=true&clip=${clipID}&parent=${parent}`;
    console.log(iframeUrl)
    return ( 
        <div className={styles.embarrassedContainer}>
            <Video
                width={620}
                height={378}
                autoPlay
                cloudName="elsmore-me"
                publicId={`twitch-overlay/clips/${clipID}`}
            />
        </div>
        )
  }