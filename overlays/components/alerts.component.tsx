import React from 'react';
import { getRandomEntry } from "@whitep4nth3r/get-random-entry";
import * as styles from './alerts.css'

const allowedEvents = [
  'channel-follow',
  'channel-cheer',
  'channel-subscribe',
  'raid',
  'command-drop',
  'command-littlethings',
  'command-smallthings',
  'command-rule32',
];

function getAlertDetails (tauEvent: any) {
  const { event_data, event_type } = tauEvent.tauEvent;
  switch (event_type) {
    case 'channel-cheer':
      return <h1>Thank you {event_data.user_name} for the {event_data.bits} bits</h1>;
    case 'channel-follow':
      return <h1>Thank you for following the madness {event_data.user_name}</h1>;
    case 'channel-subscribe':
      return <h1>Thank you for subbing {event_data.user_name}</h1>;
    case 'raid':
      return <h1>Incoming RAID from {event_data.user_name}!!!!!</h1>;
    case 'command-littlethings':
    case 'command-smallthings':
    case 'command-rule32':
      return <img
          className={styles.alertGifs}
          src={"/images/rule32.gif"}
          alt="Enjoy the little things"
        />;
    case 'command-drop':
      if(Math.floor(Math.random() * 10)>5){
        return false
      } else {
        const dropGifs = [
          "/images/karen-drop.gif",
          "/images/hans-gruber.gif",
          "/images/bunny-drop.gif",
          "/images/cow-dive.gif",
          "/images/max-collapse.gif",
          "/images/jkarenrowdy.gif",
        ]
        return <img
          className={styles.alertGifs}
          src={getRandomEntry(dropGifs)}
          alt="Falling Karen"
        />;
      }
    default:
      return false;
  }
}

export default function Alerts(tauEvent: any): JSX.Element {
  if (!allowedEvents.includes(tauEvent.tauEvent.event_type)) {
    return (<></>);
  }
  const alertBlock = getAlertDetails(tauEvent);
  return ( 
    <div className={((!alertBlock) ? styles.invisble : styles.alertContainer)} key={tauEvent.id}>{alertBlock}</div>
  )
}