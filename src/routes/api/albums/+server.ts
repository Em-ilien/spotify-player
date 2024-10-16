import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

export const GET: RequestHandler = async ({ request }) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];

  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    interface SpotifyAlbum {
      id: string;
      name: string;
    }

    let allAlbums: SpotifyAlbum[] = [];
    let nextUrl: string | null = 'https://api.spotify.com/v1/me/albums?offset=0&limit=50';

    while (nextUrl) {
      const response: { data: { items: SpotifyAlbum[]; next: string | null } } = await axios.get(nextUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      allAlbums = allAlbums.concat(response.data.items);
      nextUrl = response.data.next;
    }

    return new Response(JSON.stringify(allAlbums), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
