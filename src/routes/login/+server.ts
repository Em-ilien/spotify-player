import type { RequestHandler } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '$env/static/private';
import crypto from 'crypto';

const SPOTIFY_SCOPES = [
	'user-library-read',
	'playlist-read-private',
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'playlist-read-collaborative',
	'user-read-email',
	'user-follow-read',
	'user-read-private',
	'streaming'
];

// We are using the Authorization Code Flow
// This is the first step in the flow, where the user is redirected to the Spotify Accounts service to log in and authorize the app with the specified scopes
// https://developer.spotify.com/documentation/web-api/tutorials/code-flow#request-user-authorization

export const GET: RequestHandler = async ({ cookies }) => {
	const state = crypto.randomBytes(8).toString('hex'); // 16 characters - https://datatracker.ietf.org/doc/html/rfc6749#section-10.12

	cookies.set('oauth_state', state, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 3600
	});

	const params = new URLSearchParams({
		client_id: SPOTIFY_CLIENT_ID,
		response_type: 'code',
		redirect_uri: SPOTIFY_REDIRECT_URI,
		state: state,
		scope: SPOTIFY_SCOPES.join(' ') // https://developer.spotify.com/documentation/general/guides/scopes
	});

	const spotifyAuthUrl = new URL('https://accounts.spotify.com/authorize');
	spotifyAuthUrl.search = params.toString();

	return new Response(null, {
		status: 302,
		headers: {
			Location: spotifyAuthUrl.toString()
		}
	});
};

// Next, the user will be redirected back to the app to the callback endpoint: src/routes/callback/+server.ts
