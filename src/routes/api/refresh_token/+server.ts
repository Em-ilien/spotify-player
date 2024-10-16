import type { RequestHandler } from '@sveltejs/kit';

import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import axios from 'axios';
import { Buffer } from 'buffer';

export const POST: RequestHandler = async ({ request }) => {
    const { refresh_token } = await request.json();

    const authOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        },
        data: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token
        }).toString()
    };

    try {
        const response = await axios('https://accounts.spotify.com/api/token', authOptions);
        const data = response.data;

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
