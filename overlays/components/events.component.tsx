import React, { useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import ComfyJS from 'comfy.js'
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import ChannelPointRedemption from '../components/channelPointRedemption.component'
import Alerts from '../components/alerts.component'

const tauEvents: any[] = [];


const KRAKEN_REWARD_ID = "7645e879-1c21-4931-bc75-574720a4ef7d"

const SKIPPED_EVENT_TYPES = [
  'channel-channel_points_custom_reward-remove',
  'channel-channel_points_custom_reward-add',
  'channel-channel_points_custom_reward_redemption-update',
];

const COMMAND_DURATION_MAP: any = {
  'command-drop': 5000,
  'command-littlethings': 3200,
}

const CLIP_BUFFER: any = {};

function getReturnComponent(eventType: string, tauEvent: any): JSX.Element | null {
  console.log(`Event Type: ${eventType}`)
  switch (eventType) {
    case 'channel-channel_points_custom_reward_redemption-add':
      return <ChannelPointRedemption KRAKEN_REWARD_ID={KRAKEN_REWARD_ID} tauEvent={tauEvent} />;
    default:
      return <Alerts tauEvent={tauEvent} />;
  }
}

export default function EventsComponent() {
  const [tauEvent, setTauEvent] = useState<any | null>(null);

  const TAU_WS = process.env.NEXT_PUBLIC_TAU_WS_URL || process.env.TAU_WS_URL || 'ws://localhost:8000/ws/twitch-events/';
  const client = new W3CWebSocket(TAU_WS);

  useEffect(() => {
    // Kraken stuff 
    let krakenCounter = parseInt(localStorage.getItem('TotalKrakenRewards') || "0") || 0;

    // TAU stuff
    const TAU_TOKEN = process.env.NEXT_PUBLIC_TAU_WS_TOKEN || process.env.TAU_WS_TOKEN;
    client.onopen = () => {
      console.log('TAU WebSocket Client Connected');
      client.send(JSON.stringify({
        token: TAU_TOKEN
      }))
    };

    client.onmessage = async (message) => {
      if (message.data) {
        const eventObject = JSON.parse(message.data.toString());
        console.log(`New event with data: ${eventObject.id}`)
        if (tauEvents.filter(event => event.id === eventObject.id).length < 1 &&
          !SKIPPED_EVENT_TYPES.includes(eventObject.event_type)) {
          console.log(`Added ${eventObject.id} to queue`)
          // Kraken
          if (eventObject.event_data.reward &&
            eventObject.event_data.reward.id === KRAKEN_REWARD_ID) {
            eventObject.duration = 10000;
            eventObject.event_data.krakenCounter = (krakenCounter + 1);
            krakenCounter = (krakenCounter + 1);
            localStorage.setItem('TotalKrakenRewards', `${krakenCounter}`);
          }
          // Troll Selecta
          if (eventObject.event_data.reward &&
            eventObject.event_data.reward.prompt) {
              const clipDataArray = eventObject.event_data.reward.prompt.split(' by ');
              if(clipDataArray.length >= 2) {
                const clipID = clipDataArray[0];
                const clipData = await axios.get(`https://ukmadlz-tau.onrender.com/api/twitch/helix/clips?id=${clipID}`, {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${TAU_TOKEN}`
                  }
                })
                if(clipData) {
                  eventObject.duration = clipData.data.data[0].duration * 1000;
                }
              }
          }
          tauEvents.push(eventObject);
        }
      }
    };

    // Chat Commands
    ComfyJS.Init(process.env.NEXT_PUBLIC_TWITCH_CHANNEL || '');
    ComfyJS.onCommand = async (user, command, message, flags, extra) => {
      const { id, userId, timestamp, messageEmotes } = extra;
      if ((flags.broadcaster || flags.vip || flags.subscriber) && command == 'watch') {
        let clipID:any = '';
        if (message.startsWith('https://clips.twitch.tv/')) {
          clipID = new URL(message).pathname.substring(1);
        } else if (message.startsWith('https://www.twitch.tv/')) {
          clipID = new URL(message).pathname.substring(1).split('/').pop();
        }
        if(!CLIP_BUFFER[clipID]) {
          CLIP_BUFFER[clipID] = new Date();
        }
        const clipData = await axios.get(`https://ukmadlz-tau.onrender.com/api/twitch/helix/clips?id=${clipID}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${TAU_TOKEN}`
          }
        })
        if(clipData && CLIP_BUFFER[clipID] < new Date()) {
          await axios.get(`/api/load-twitch-clip?clipId=${clipID}`)
          await axios.get(`https://res.cloudinary.com/elsmore-me/video/upload/v1/twitch-overlay/clips/${clipID}`)
          setTimeout(() => {
            console.log(`Added ${clipID} by ${user}`)
            tauEvents.push({
              id: uuid(),
              event_id: id,
              event_type: `channel-channel_points_custom_reward_redemption-add`,
              event_source: 'comfyjs',
              event_data: {
                broadcaster_user_login: process.env.NEXT_PUBLIC_TWITCH_CHANNEL,
                broadcaster_user_name: process.env.NEXT_PUBLIC_TWITCH_CHANNEL,
                id: id,
                user_id: userId,
                user_login: user,
                user_name: user,
                user_input: message,
                redeemed_at: new Date(timestamp),
                reward: {
                  prompt: `${clipID} by ${user}`
                }
              },
              created: new Date(timestamp),
              origin: 'chat',
              duration: clipData.data.data[0].duration * 1000,
            });
          }, 10000);
          CLIP_BUFFER[clipID] = new Date(new Date().getTime() + 5*60000);
        }
      }
      else if (tauEvents.findIndex(event => event.event_type === `command-${command}`) < 0) {
        tauEvents.push({
          id: uuid(),
          event_id: id,
          event_type: `command-${command}`,
          event_source: 'comfyjs',
          event_data: {
            broadcaster_user_login: process.env.NEXT_PUBLIC_TWITCH_CHANNEL,
            broadcaster_user_name: process.env.NEXT_PUBLIC_TWITCH_CHANNEL,
            id: id,
            user_id: userId,
            user_login: user,
            user_name: user,
            user_input: message,
            redeemed_at: new Date(timestamp),
          },
          created: new Date(timestamp),
          origin: 'chat',
          duration: COMMAND_DURATION_MAP[`command-${command}`] || 10000,
        });
      } else {
        console.log(`${command} already queued`);
      }
    }

    // Queue Processing
    const queueEmptier = async () => {
      console.log(`Checking queue for events ${new Date()}`)
      if (tauEvents.length > 0) {
        console.log('Setting event to state')
        const newTauEvent = tauEvents.shift();
        await setTauEvent(newTauEvent);
        setTimeout(queueEmptier, newTauEvent.duration || 10000);
      } else {
        console.log(`Emptying state ${new Date()}`)
        await setTauEvent(null)
        setTimeout(queueEmptier, 1000);
      }
    }
    queueEmptier();

    return function cleanup() {
      console.log('Buh bye now')
      client.close();
    };
  }, [])

  return (<>{tauEvent && getReturnComponent(tauEvent.event_type, tauEvent)}</>)
}