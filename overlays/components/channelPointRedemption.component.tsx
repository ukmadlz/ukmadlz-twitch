import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import OctopusSubComponent from "./sub-components/octopus.component"
import EmbarrassComponent from "./sub-components/embarrass.component"

interface Reward {
  id: string
  cost: number
  prompt?: string
  title: string
}

function getReturnComponent(rewardId: string, prompt: string): JSX.Element | null {
  switch (rewardId) {
    case "7645e879-1c21-4931-bc75-574720a4ef7d":
      return <OctopusSubComponent />;
    default:
      return <EmbarrassComponent rewardId={rewardId} prompt={prompt} />;
  }
}

export default function ChannelPointRedemptions(): JSX.Element {
  const [reward, setReward] = useState<Reward | null>(null);
  
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
    <>{reward && getReturnComponent(reward!.id as string, reward?.prompt as string)}</>
    )
}
