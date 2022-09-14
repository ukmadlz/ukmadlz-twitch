// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 as Cloudinary } from 'cloudinary';
import Fetch from 'node-fetch'

type Data = {
    clipId?: string;
    message?: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    Cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });

    const { clipId } = req.query;
    const response = await Fetch(`https://ukmadlz-tau.onrender.com/api/twitch/helix/clips?format=json&id=${clipId}`,
        {
        method: 'get',
        headers: {
            'Authorization': `Token ${process.env.NEXT_PUBLIC_TAU_WS_TOKEN}`
        },
    });
    const responseData = await response.json();
    const clipData = responseData.data.pop();

    const clipUrl = String(clipData.thumbnail_url).split('-preview')[0] + '.mp4'
    try {
        await new Promise((resolve, reject) => {
            Cloudinary.uploader.upload(clipUrl, {
                public_id: clipData.id,
                folder: 'twitch-overlay/clips',
                resource_type: 'video',
            }, (error, result) => {
                if(error) reject(error)
                else resolve(result);
            })
        })
        res.status(200).json({ clipId: clipData.id })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}
