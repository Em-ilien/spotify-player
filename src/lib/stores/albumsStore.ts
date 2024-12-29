import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import axios from 'axios';
import { isAuthentified } from '$lib/authentification.svelte';

export const albumsStore: Writable<
	{ album: { id: string; name: string; artists: { name: string }[] } }[]
> = writable([]);

async function fetchAlbums() {
	try {
		const response = await axios.get('/api/albums');
		const albums = response.data;
		albumsStore.set(albums);
	} catch (error) {
		console.error('Error fetching albums:', error);
	}
}

setTimeout(() => {
	if (isAuthentified()) fetchAlbums();
});
