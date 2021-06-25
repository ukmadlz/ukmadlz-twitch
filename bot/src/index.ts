import ComfyJS from "comfy.js";
import Dotenv from "dotenv";
import Fetch from "node-fetch";

Dotenv.config();

// Interfaces
interface IPermissions {
    broadcaster?: boolean,
    mod?: boolean,
    founder?: boolean,
    subscriber?: boolean,
    vip?: boolean,
    highlighted?: boolean,
    customReward?: boolean,
    follower?: boolean,
    anyone?: boolean,
}
interface IPossibleCommands {
    [key: string]: {
        permissions: IPermissions;
        action: Function;
    };
 } 

// Channel Owner Details
const CHANNEL_OWNER_ID = process.env.CHANNEL_OWNER_ID || "";

/**
 * Checks that the user making the command is a follower
 * @param {string} channelUserId Channel Owners User ID
 * @param {string} commandUserId Command User ID
 * @returns {Promise<boolean>}
 */
const isFollower = async (channelUserId: string, commandUserId: string): Promise<boolean> => {
  const followerUrl = `https://ukmadlz-tau.onrender.com/api/twitch/helix/users/follows?format=json&from_id=${channelUserId}&to_id=${commandUserId}`
  const response = await Fetch(followerUrl,
  {
    method: 'get',
    headers: {
      'Authorization': `Token ${process.env.TAU_WS_TOKEN}`
    },
  });
  const followerUserData = await response.json();
  return Boolean(followerUserData.total)
}

/**
 * Checks if the user can run said command
 * @param {string} permissions Permissions object for the command
 * @param {string} flags Flags sent from Twitch
 * @param {Function} follower Check if the user is a follower of the channel
 * @returns {boolean}
 */
const isAllowed = async (permissions: IPermissions, flags: IPermissions, follower: Promise<boolean>) => {
  if (permissions.anyone) {
    return true;
  }
  if (permissions.broadcaster && flags.broadcaster) {
    return true;
  }
  if (permissions.customReward && flags.customReward) {
    return true;
  }
  if (permissions.founder && flags.founder) {
    return true;
  }
  if (permissions.highlighted && flags.highlighted) {
    return true;
  }
  if (permissions.mod && flags.mod) {
    return true;
  }
  if (permissions.subscriber && flags.subscriber) {
    return true;
  }
  if (permissions.vip && flags.vip) {
    return true;
  }
  if (permissions.follower && await follower) {
    return true;
  }
  return false;
}

// List of commands
const PossibleCommands: IPossibleCommands = {
  octopus: {
    permissions: {
      broadcaster: false,
      mod: true,
      founder: true,
      subscriber: false,
      vip: true,
      highlighted: false,
      customReward: false,
      follower: true,
    },
    action: (user: any, message: any, flags: any, extra: any) => {
      console.log('Do the thing');
    }
  } 
};

// Receive the command from Twitch and do something
ComfyJS.onCommand = async (user: any, command: string, message: any, flags: any, extra: any) => {
  if(PossibleCommands[command]) {
    const { userId } = extra;
    const {
      permissions,
      action  
    } = PossibleCommands[command];
    if(await isAllowed(permissions, flags, isFollower(CHANNEL_OWNER_ID, userId))) {
      action(user, message, flags, extra);
    }
  }
}

ComfyJS.Init(String(process.env.TWITCH_CHANNEL));