import { writable } from 'svelte/store';
import axios from 'axios';
import { isAuthentified } from '$lib/authentification.svelte';

export const tracksStore = writable([]);

async function fetchTracks() {
	try {
		const response = await axios.get('/api/tracks');
		const tracks = response.data;
		tracksStore.set(tracks);
	} catch (error) {
		console.error('Error fetching tracks:', error);
	}
}

setTimeout(() => {
	if (isAuthentified()) fetchTracks();
});
