import React, { Component, useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import OctopusSubComponent from "./sub-components/octopus.component"

const client = new W3CWebSocket(process.env.TAU_WS_URL || 'ws://localhost:8000/ws/twitch-events/');

interface Reward {
  id: string
  cost: number
  prompt?: string
  title: string
}

function getReturnComponent(rewardId: string): JSX.Element | null {
  switch (rewardId) {
    case "7645e879-1c21-4931-bc75-574720a4ef7d":
      return <OctopusSubComponent />;
    default:
      return null;
  }
}

export default function ChannelPointRedemptions(): JSX.Element {
  const [reward, setReward] = useState<Reward | null>(null);
  
  useEffect(() => {
    client.onopen = () => {
        console.log('WebSocket Client Connected');
        client.send(JSON.stringify({
            token: process.env.TAU_WS_TOKEN
        }))
    };

    client.onmessage = (message) => {
      console.log(message);
        if (message.data) {
          const eventObject = JSON.parse(message.data);
          if (eventObject.event_type === "point-redemption") {
              const { reward } = eventObject.event_data;
              setReward(reward)
          }
        }
    };

    return () => {
      // There might be an isuse here where too many clients will be created
      // unless you destroy them somehow here and run client.disconnect or something

      // this migh thappen when the page hot reloads

      // IT IS YOURS NOW

      // OINE MORE HTINg
      // LOOK HOW MUCH CLEANER THIS IS
    }
  }, [])

  // YOU ARE WELCOME
  // YOU GOTTA WORK WITH TYPESCRIPT OR IT KILLS YOU
  // ALSO
  // FUNCTIONAL COMPONENTS
  setTimeout(() => {
    setReward(null)
  }, 10000)
  return ( 
    <>{reward && getReturnComponent(reward!.id as string)}</>
    )
}
