import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ChannelPointRedemption from '../components/channelPointRedemption.component'
import Alerts from '../components/alerts.component'

const tauEvents: any[] = [];

function getReturnComponent(eventType: string, tauEvent: any): JSX.Element | null {
  console.log(`Event Type: ${eventType}`)
  switch (eventType) {
    case 'point-redemption':
      return <ChannelPointRedemption tauEvent={tauEvent}/>;
    default:
      return <Alerts tauEvent={tauEvent}/>;
  }
}

export default function EventsComponent() {
    const [tauEvent, setTauEvent] = useState<any | null>(null);
  
    const TAU_WS = process.env.NEXT_PUBLIC_TAU_WS_URL || process.env.TAU_WS_URL || 'ws://localhost:8000/ws/twitch-events/';
    const client = new W3CWebSocket(TAU_WS);
    
    useEffect(() => {
      client.onopen = () => {
          console.log('TAU WebSocket Client Connected');
          const TAU_TOKEN = process.env.NEXT_PUBLIC_TAU_WS_TOKEN || process.env.TAU_WS_TOKEN;
          client.send(JSON.stringify({
              token: TAU_TOKEN
          }))
      };
  
      client.onmessage = (message) => {
        if (message.data) {
          const eventObject = JSON.parse(message.data.toString());
          console.log(`New event with data: ${eventObject.id}`)
          if (tauEvents.filter(event => event.id === eventObject.id).length < 1) {
            tauEvents.push(eventObject);
          }
        }
      };
  
      return () => {
      }
    }, [])

    setTimeout(() => {
      if (tauEvents.length > 0) {
        setTauEvent(tauEvents.shift());
      } else {
        setTauEvent(null)
      }
    }, 10000)
    return (<>{tauEvent && getReturnComponent(tauEvent.event_type, tauEvent)}</>)
}