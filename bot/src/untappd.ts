import Dotenv from "dotenv";
import Fetch from "node-fetch";

Dotenv.config();

// https://api.untappd.com/v4/user/checkins/elsmore?client_id={}&client_secret={}&limit=1   

export default class Untapped {
    baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || 'https://api.untappd.com/v4/';
    }

    public async beerStatement() {
        const untappedResult = await this.untappdFetch('GET', 'user/checkins/elsmore');
        const { beer_name, beer_style } = untappedResult.response.checkins.items[0].beer;
        const { brewery_name, country_name } = untappedResult.response.checkins.items[0].brewery;
        return `My last beer was a ${beer_name} it's a ${beer_style} from ${brewery_name} in ${country_name}`
    }

    private async untappdFetch(method: string, path: string, body?: object): Promise<any> {
        try {
            const response = await Fetch(`${this.baseUrl}${path}?client_id=${process.env.UNTAPPD_CLIENT_ID}&client_secret=${process.env.UNTAPPD_CLIENT_SECRET}&limit=1`, {
                method,
                body: body ? JSON.stringify(body) : undefined,
            });
            return await response.json();
        } catch (error) {
            console.log(error);
        }
    }
}