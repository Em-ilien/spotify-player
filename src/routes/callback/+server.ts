import type { RequestHandler } from '@sveltejs/kit';
import {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	SPOTIFY_REDIRECT_URI
} from '$env/static/private';
import axios from 'axios';

// We are using the Authorization Code Flow
// This is the second step in the flow, after the user has authorized the app with the specified scopes and is redirected back to the app, where we exchange the code for an access token.
// https://developer.spotify.com/documentation/web-api/tutorials/code-flow#request-an-access-token

export const GET: RequestHandler = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');
	const state = url.searchParams.get('state');

	if (error) return new Response(`Error: ${error}`, { status: 400 });

	if (!code) return new Response('Missing code parameter', { status: 400 });

	if (!state || state !== cookies.get('oauth_state'))
		return new Response('Invalid state parameter', { status: 400 });

	try {
		cookies.delete('oauth_state', { path: '/' });

		const body = new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: SPOTIFY_REDIRECT_URI
		});
		const response = await axios.post('https://accounts.spotify.com/api/token', body.toString(), {
			headers: {
				Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});

		if (response.status !== 200)
			return new Response('Error authenticating with Spotify', { status: 500 });

		const { access_token, refresh_token, expires_in } = response.data;

		cookies.set('spotify_access_token', access_token, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: expires_in // in seconds
		});
		cookies.set('spotify_refresh_token', refresh_token, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 30 * 24 * 60 * 60 // 30 days
		});

		// TODO: Implement refresh token logic

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (error) {
		return new Response('Error authenticating with Spotify', { status: 500 });
	}
};
