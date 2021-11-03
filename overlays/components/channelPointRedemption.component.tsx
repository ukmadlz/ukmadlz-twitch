import React from 'react';
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
      return <EmbarrassComponent prompt={prompt} />;
  }
}

export default function ChannelPointRedemptions(tauEvent: any): JSX.Element {
  const { reward } = tauEvent.tauEvent.event_data;
  return ( 
    <>{reward && getReturnComponent(reward!.id as string, reward?.prompt as string)}</>
    )
}
