import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import axios from 'axios';
import { isAuthentified } from '$lib/authentification.svelte';

export const tracksStore: Writable<
	{ track: { uri: string; id: number; name: string; artists: { name: string }[] } }[]
> = writable([]);

async function fetchTracks() {
	try {
		const response = await axios.get('/api/tracks');
		const tracks = response.data;
		tracksStore.set(tracks);
	} catch (error: any) {
		if (error.code === 'ECONNABORTED') return;
		console.error('Error fetching tracks:', error);
	}
}

setTimeout(() => {
	if (isAuthentified()) fetchTracks();
});
