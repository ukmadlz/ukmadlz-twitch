import Fetch from 'node-fetch'
import { Video } from 'cloudinary-react';
import * as styles from './embarrass.css'

export default function EmbarrassComponent({ prompt }: any): JSX.Element {
    const clipDataArray = prompt.split(' by ');
    if(clipDataArray.length < 2) return <></>;
    const clipID = clipDataArray[0];
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