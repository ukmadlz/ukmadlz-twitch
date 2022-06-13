import React from 'react';
import OctopusSubComponent from "./sub-components/octopus.component"
import EmbarrassComponent from "./sub-components/embarrass.component"

export default function ChannelPointRedemptions({ tauEvent, KRAKEN_REWARD_ID }: { tauEvent: any, KRAKEN_REWARD_ID: string }): JSX.Element {
  const { reward, krakenCounter } = tauEvent.event_data;
  
  function getReturnComponent(rewardId: string, prompt: string): JSX.Element | null {
    switch (rewardId) {
      case KRAKEN_REWARD_ID:
        return <OctopusSubComponent counter={krakenCounter} />;
      default:
        return <EmbarrassComponent prompt={prompt} />;
    }
  }
  return ( 
    <>{reward && getReturnComponent(reward!.id as string, reward?.prompt as string)}</>
    )
}
