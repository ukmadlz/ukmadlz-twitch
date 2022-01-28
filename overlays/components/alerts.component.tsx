import React from 'react';
import * as styles from './alerts.css'

const allowedEvents = [
  'channel-follow',
  'channel-cheer',
  'channel-subscribe',
  'raid',
  'command-drop'
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
    case 'command-drop':
      return <img
        className={styles.alertGifs}
        src="/images/karen-drop.gif"
        alt="Falling Karen"
      />;
  }
}

export default function Alerts(tauEvent: any): JSX.Element {
  if (!allowedEvents.includes(tauEvent.tauEvent.event_type)) {
    return (<></>);
  }
  return ( 
    <div className={styles.alertContainer} key={tauEvent.id}>{getAlertDetails(tauEvent)}</div>
  )
}