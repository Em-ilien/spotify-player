import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

export const GET: RequestHandler = async ({ request }) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];

  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    interface SpotifyArtist {
      id: string;
      name: string;
    }

    let allArtists: SpotifyArtist[] = [];
    let nextUrl: string | null = 'https://api.spotify.com/v1/me/following?type=artist&limit=50';

    while (nextUrl) {
      const response: { data: { items: SpotifyArtist[]; next: string | null } } = await axios.get(nextUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      allArtists = allArtists.concat(response.data.artists.items);
      
      nextUrl = response.data.artists.next;
    }

    return new Response(JSON.stringify(allArtists), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
