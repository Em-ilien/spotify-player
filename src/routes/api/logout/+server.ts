import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('spotify_access_token', { path: '/' });
	cookies.delete('spotify_refresh_token', { path: '/' });
};
