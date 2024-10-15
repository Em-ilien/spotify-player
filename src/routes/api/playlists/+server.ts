import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

export const GET: RequestHandler = async ({ request }) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];

  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return new Response(JSON.stringify(response.data.items), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new Response('Failed to fetch playlists', { status: 500 });
  }
};
