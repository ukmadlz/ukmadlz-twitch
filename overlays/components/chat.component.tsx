import React, { useEffect, useState } from 'react';
import ComfyJS from 'comfy.js'
import Fetch from 'node-fetch'
import HTMLParse from 'html-react-parser'
import * as styles from './chat.css'

interface IChatMessage {
    user: string
    userId: string
    message: string
    profileImage?: string
    messageId: string
    timestamp: string
    messageEmotes: string[]
}

interface IChatMessages extends Array<IChatMessage>{}

const DND = [
  "135204446", // PretzelRocks
  "19264788", // NightBot
]

const kindaBigDeal = [
  "536397236", // FiniteSingularity
  "469006291", // Whitep4nth3r
];

function getMessageHTML(message: string, emotes: any) {
  if (!emotes) return message;

  // store all emote keywords
  // ! you have to first scan through 
  // the message string and replace later
  const stringReplacements: any = [];

  // // iterate of emotes to access ids and positions
  Object.entries(emotes).forEach(([id, positions]: any) => {
    // use only the first position to find out the emote key word
    const [start, end] = positions[0].split("-");
    const stringToReplace = message.substring(
      parseInt(start, 10),
      parseInt(end, 10) + 1
    );

    stringReplacements.push({
      stringToReplace: stringToReplace,
      replacement: `<img src="https://static-cdn.jtvnw.net/emoticons/v1/${id}/3.0" style="width: 3em">`,
    });
  });

  // generate HTML and replace all emote keywords with image elements
  const messageHTML = stringReplacements.reduce(
    (acc: any, { stringToReplace, replacement }: any) => {
      // obs browser doesn't seam to know about replaceAll
      return acc.split(stringToReplace).join(replacement);
    },
    message
  );

  return HTMLParse(messageHTML);
}

export default function Chat(): JSX.Element {
  const [chat, setChat] = useState<IChatMessages>([]);
  
  useEffect(() => {
    // Process Chat Messages
    ComfyJS.Init(process.env.NEXT_PUBLIC_TWITCH_CHANNEL || '');
    ComfyJS.onChat = ( user, message, flags, self, extra ) => {
        const { id, userId, timestamp, messageEmotes } = extra;

        if(!DND.includes(userId)) {
          (async () => {
            const response = await Fetch(`https://ukmadlz-tau.onrender.com/api/twitch/helix/users?format=json&id=${userId}`,
              {
                method: 'get',
                headers: {
                  'Authorization': `Token ${process.env.NEXT_PUBLIC_TAU_WS_TOKEN}`
                },
              });
            const userData = await response.json();
            const { profile_image_url } = userData.data[0];
            const chatObject = {
              user,
              userId,
              message,
              profileImage: profile_image_url,
              messageId: id,
              timestamp,
              messageEmotes,
            };
            setChat((previousChat: any) => {
              return [
                ...previousChat,
                chatObject
              ]
            })
          })()
        }

    }
    return () => {
    }
  }, [])

  return (
    <div className={styles.chatContainer} >
      <div className={styles.chatList}>
        {chat?.slice(-8).map(chatMessage => {
          const profileImage = (chatMessage?.userId && kindaBigDeal.includes(chatMessage.userId)) ? 
          `https://res.cloudinary.com/elsmore-me/image/upload/b_rgb:000000,bo_0px_solid_rgb:000,c_scale,g_center,l_twitch-overlay:users-${chatMessage.userId},w_98,x_60,y_60/v1628698037/twitch-overlay/verified.png` :
          chatMessage.profileImage;
          return (<div className={`${styles.chatMessage} message-${chatMessage.messageId}`} key={chatMessage.messageId}>
            <img className={styles.profileImage} src={profileImage} alt={chatMessage?.user} />
            <div className={styles.textContainer}>
              <span className={styles.userName}>{chatMessage?.user}</span>
              <div className={styles.message}>{getMessageHTML(chatMessage?.message, chatMessage?.messageEmotes)}</div>
            </div>
          </div>)
        })}
      </div>
    </div>
  )
}