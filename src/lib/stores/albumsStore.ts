import { writable } from 'svelte/store';
import Cookies from 'cookie-universal';
import axios from 'axios';

export const albumsStore = writable([]);

async function fetchAlbums() {
    const cookies = Cookies();
    const accessToken = cookies.get('spotify_access_token');

    if (!accessToken)
        return;

    try {
        const response = await axios.get('/api/albums', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const albums = response.data;
        albumsStore.set(albums);
    } catch (error) {
        console.error('Error fetching albums:', error);
    }
}

fetchAlbums()