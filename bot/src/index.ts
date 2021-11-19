import ComfyJS from "comfy.js";
import Dotenv from "dotenv";
import Tau from "./tau";
import Untappd from "./untappd";

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

const tau = new Tau();

/**
 * Checks if the user can run said command
 * @param {string} permissions Permissions object for the command
 * @param {string} flags Flags sent from Twitch
 * @param {Function} follower Check if the user is a follower of the channel
 * @returns {boolean}
 */
const isAllowed = async (permissions: IPermissions, flags: IPermissions, follower: boolean) => {
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
  },
  beer: {
    permissions: {
      broadcaster: true,
      mod: true,
      founder: true,
      subscriber: true,
      vip: true,
      highlighted: false,
      customReward: false,
      follower: true,
    },
    action: async () => {
      const beerStatement = await new Untappd().beerStatement();
      ComfyJS.Say(beerStatement);
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
    if(await isAllowed(permissions, flags, await tau.isFollower(CHANNEL_OWNER_ID, userId))) {
      action(user, message, flags, extra);
    }
  }
}

ComfyJS.Init(String(process.env.TWITCH_CHANNEL), String(process.env.TWITCH_OAUTH));
const main = async () => {
  const clips = await tau.listClips();
  const redemptions = await tau.ListChannelPointRedemptions();
  clips.data.forEach(async (clip) => {
    const clipId = `${clip.id} by ${clip.creator_name}`;
    const clipTitle = `${clip.title} by ${clip.creator_name}`;
    const matchedRedemption = redemptions.data.filter(redemption => {
      return redemption.prompt === clipId;
    })
    if(matchedRedemption.length < 1) {
      console.log(`${clipTitle} has no redemption`);
      tau.CreateChannelPointRedemption(clipTitle, clipId, 2000);
    } else {
      console.log(`${clipTitle} already exists`);
    }
  })
}
// main();