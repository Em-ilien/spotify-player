import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const accessToken = cookies.get('spotify_access_token');

	if (!accessToken) return new Response('Unauthorized', { status: 401 });

	const { device_id } = await request.json();

	if (!device_id) return new Response('Missing device_id parameter', { status: 400 });

	try {
		const response = await axios.put(
			'https://api.spotify.com/v1/me/player',
			{
				device_ids: [device_id]
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				}
			}
		);

		return new Response(JSON.stringify(response.data), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
