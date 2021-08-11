import React, { useEffect, useState } from 'react';
import ComfyJS from 'comfy.js'
import Fetch from 'node-fetch'
import * as styles from './chat.css'

interface IChatMessage {
    user: string
    message: string
    profileImage?: string
    messageId: string,
    timestamp: string
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

export default function Chat(): JSX.Element {
  const [chat, setChat] = useState<IChatMessages>([]);
  
  useEffect(() => {
    // Process Chat Messages
    ComfyJS.Init(process.env.NEXT_PUBLIC_TWITCH_CHANNEL || '');
    ComfyJS.onChat = ( user, message, flags, self, extra ) => {
        const { id, userId, timestamp } = extra;
        console.log(extra);

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
            };
            setChat(previousChat => {
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
          const profileImage = (kindaBigDeal.includes(chatMessage.userId)) ? 
          `https://res.cloudinary.com/elsmore-me/image/upload/b_rgb:000000,bo_0px_solid_rgb:000,c_scale,g_center,l_twitch-overlay:users-${chatMessage.userId},w_97,x_60,y_60/v1628698037/twitch-overlay/verified.png` :
          chatMessage.profileImage;
          return (<div className={`${styles.chatMessage} message-${chatMessage.messageId}`} key={chatMessage.messageId}>
            <img className={styles.profileImage} src={profileImage} alt={chatMessage?.user} />
            <div className={styles.textContainer}>
              <span className={styles.userName}>{chatMessage?.user}</span>
              <span className={styles.message}>{chatMessage?.message}</span>
            </div>
          </div>)
        })}
      </div>
    </div>
  )
}