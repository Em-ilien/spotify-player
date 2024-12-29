import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import axios from 'axios';
import { isAuthentified } from '$lib/authentification.svelte';

export const artistsStore: Writable<{ id: string; name: string; image: string }[]> = writable([]);

async function fetchArtists() {
	try {
		const response = await axios.get('/api/artists');
		const artists = response.data;
		artistsStore.set(artists);
	} catch (error) {
		console.error('Error fetching artists:', error);
	}
}

setTimeout(() => {
	if (isAuthentified()) fetchArtists();
});
