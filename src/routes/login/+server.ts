import type { RequestHandler } from '@sveltejs/kit';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '$env/static/private';

export const GET: RequestHandler = () => {
  const scopes = [
    'user-library-read',
    'playlist-read-private',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-read-collaborative',
    'user-read-email',
    'user-follow-read',
    'streaming',
  ].join(' ');
  
  const redirect_uri = encodeURIComponent(SPOTIFY_REDIRECT_URI);

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${scopes}&redirect_uri=${redirect_uri}`;

  return new Response(null, {
    status: 302,
    headers: {
      Location: spotifyAuthUrl
    }
  });
};
