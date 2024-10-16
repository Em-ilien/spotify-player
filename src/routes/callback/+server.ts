import type { RequestHandler } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } from '$env/static/private';
import axios from 'axios';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code!,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET,
  });

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const maxAge = expires_in; // expires_in is typically in seconds

    cookies.set('spotify_access_token', access_token, { path: '/', httpOnly: false, maxAge });
    cookies.set('spotify_refresh_token', refresh_token, { path: '/', httpOnly: false, maxAge: 30 * 24 * 60 * 60 }); // 30 days

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
