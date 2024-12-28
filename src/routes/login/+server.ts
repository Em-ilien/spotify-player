import type { RequestHandler } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '$env/static/private';

const SPOTIFY_SCOPES = [
	'user-library-read',
	'playlist-read-private',
	'user-read-playback-state',
	'user-modify-playback-state',
	'playlist-read-collaborative',
	'user-read-email',
	'user-follow-read',
	'streaming'
];

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize
?response_type=code
&client_id=${SPOTIFY_CLIENT_ID}
&scope=${SPOTIFY_SCOPES.join(' ')}
&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}`;

export const GET: RequestHandler = () => {
	return new Response(null, {
		status: 302,
		headers: {
			Location: SPOTIFY_AUTH_URL
		}
	});
};
