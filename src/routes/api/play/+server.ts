import { playerState } from '$lib/player.svelte';
import type { RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

export const PUT: RequestHandler = async ({ request, cookies }) => {
	const accessToken = cookies.get('spotify_access_token');

	if (!accessToken) return new Response('Unauthorized', { status: 401 });

	const { context_uri, uris, currentDeviceId } = await request.json();

	if (!context_uri && !uris)
		return new Response('Missing context_uri or uris parameter', { status: 400 });
	else if (context_uri && uris)
		return new Response('Use either context_uri or uris parameter', { status: 400 });

	const headers = {
		Authorization: `Bearer ${accessToken}`,
		'Content-Type': 'application/json'
	};

	try {
		const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
			headers
		});

		const data = response.data;
		const device_id = data.devices.find((device: { is_active: boolean }) => device.is_active);

		if (!device_id) {
			if (!currentDeviceId)
				return new Response('Missing currentDeviceId parameter', { status: 400 });
			await axios.put(
				'https://api.spotify.com/v1/me/player',
				{
					device_ids: [currentDeviceId]
				},
				{ headers }
			);
		}

		const playResponse = await axios.put(
			'https://api.spotify.com/v1/me/player/play',
			{ context_uri, uris },
			{ headers }
		);

		return new Response(JSON.stringify(playResponse.data), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 500 });
	}
};
