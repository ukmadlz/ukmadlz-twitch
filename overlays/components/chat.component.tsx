import React, { useEffect, useState } from 'react';
import ComfyJS from 'comfy.js'
import Fetch from 'node-fetch'
import * as styles from './chat.css'

interface IChatMessage {
    user: string
    message: string
    profileImage?: string
    messageId: string
}

interface IChatMessages extends Array<IChatMessage>{}

export default function Chat(): JSX.Element {
  const [chat, setChat] = useState<IChatMessages>([]);
  
  useEffect(() => {
    const effectChat = [];
    ComfyJS.Init(process.env.NEXT_PUBLIC_TWITCH_CHANNEL || '');
    ComfyJS.onChat = ( user, message, flags, self, extra ) => {
        const { id, userId } = extra;
        // console.log({ user, message, flags, self, extra });
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
          const chatObject = { user, message, profileImage: profile_image_url, messageId: id };
          effectChat.push(chat);
          setChat(previousChat => {
            return [
              ...previousChat,
              chatObject
            ]
          })
        })()
    }
    return () => {
    }
  }, [])

  return (
    <div className={styles.chatList}>
      {chat?.map(chatMessage => {
        return (<div className={styles.chatMessage} key={chatMessage.messageId}>
          <img className={styles.profileImage} src={chatMessage?.profileImage} alt={chatMessage?.user} />
          <div className={styles.textContainer}>
            <span className={styles.userName}>{chatMessage?.user}</span>
            <span className={styles.message}>{chatMessage?.message}</span>
          </div>
        </div>)
      })}
    </div>
  )
}