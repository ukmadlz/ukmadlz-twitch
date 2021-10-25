import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket"
import * as styles from './alerts.css'

interface Event {
    id: string,
    event_id: string
    event_type: string
    event_source: string
    event_data: any
    created: string
    origin: string
  }

const allowedEvents = ['follow', 'cheer', 'subscribe', 'raid'];

let tauEvents: Array<any> = [];

export default function Alerts(): JSX.Element {
    const [tauEvent, setTauEvents] = useState<Array<Event>>([]);
    const TAU_WS = process.env.NEXT_PUBLIC_TAU_WS_URL || process.env.TAU_WS_URL || 'ws://localhost:8000/ws/twitch-events/';
    const client = new W3CWebSocket(TAU_WS);
    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
            const TAU_TOKEN = process.env.NEXT_PUBLIC_TAU_WS_TOKEN || process.env.TAU_WS_TOKEN;
            client.send(JSON.stringify({
                token: TAU_TOKEN
            }))
        };
    
        client.onmessage = (message) => {
            if (message.data) {
              const eventObject = JSON.parse(message.data.toString());
              console.log(eventObject);
              if (allowedEvents.includes(eventObject.event_type)) {
                tauEvents.push(eventObject);
              }  
            }
        };
    
        return () => {
        }
      }, [])

      const getTauEvent = () => {
          if (tauEvents.length > 0) {
            const tauEvent = tauEvents[0];
            tauEvents = tauEvents.splice(1);
            setTauEvents(tauEvent);
          }
          setTimeout(() => { getTauEvent() }, 5000);
      }
      
      getTauEvent();

      return ( 
        <div className={styles.alertContainer}>{JSON.stringify(tauEvent)}</div>
        )
}