import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

export const GET: RequestHandler = async ({ cookies }) => {
	const accessToken = cookies.get('spotify_access_token');

	if (!accessToken) return new Response('Unauthorized', { status: 401 });

	try {
		interface SpotifyPlaylist {
			id: string;
			name: string;
		}

		let allPlaylists: SpotifyPlaylist[] = [];
		let nextUrl: string | null = 'https://api.spotify.com/v1/me/playlists?offset=0&limit=50';

		while (nextUrl) {
			const response: { data: { items: SpotifyPlaylist[]; next: string | null } } = await axios.get(
				nextUrl,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				}
			);

			allPlaylists = allPlaylists.concat(response.data.items);
			nextUrl = response.data.next;
		}

		return new Response(JSON.stringify(allPlaylists), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
