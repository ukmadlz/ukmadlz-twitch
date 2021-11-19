import Dotenv from "dotenv";
import Fetch from "node-fetch";

Dotenv.config();

export default class Tau {
    baseUrl: string;
    broadcasterId: number;

    constructor(baseUrl?: string, broadcasterId?: number) {
        this.baseUrl = baseUrl || 'https://ukmadlz-tau.onrender.com/api/twitch/helix/';
        this.broadcasterId = broadcasterId || Number(process.env.CHANNEL_OWNER_ID);
    }

    private async tauFetch(method: string, path: string, body?: object): Promise<any> {
        try {
            const response = await Fetch(`${this.baseUrl}${path}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${process.env.TAU_WS_TOKEN}`
                },
                body: body ? JSON.stringify(body) : undefined,
            });
            return await response.json();
        } catch (error) {
            // console.log(error);
        }
    }

    /**
     * isFollower
     * @param {string} userId
     * @returns {Boolean}
     */
    public async isFollower(channelUserId: string, commandUserId: string): Promise<boolean> {
        const followerUserData = await this.tauFetch('GET', `users/follows?format=json&from_id=${channelUserId}&to_id=${commandUserId}`);

        return Boolean(followerUserData.total)
    }

    public async listClips() {
        return await this.tauFetch('GET', `clips?broadcaster_id=${this.broadcasterId}`);
    }

    public async getClip(clipId: string) {
        return await this.tauFetch('GET', `clips/${clipId}`);
    }

    public async ListChannelPointRedemptions() {
        return await this.tauFetch('GET', `channel_points/custom_rewards?broadcaster_id=${this.broadcasterId}`);
    }

    public async CreateChannelPointRedemption(title: string, prompt: string, cost: number, colour?: string) {
        return await this.tauFetch('POST', `channel_points/custom_rewards?broadcaster_id=${this.broadcasterId}`, {
            title,
            prompt,
            cost,
            colour
        });
    }
}