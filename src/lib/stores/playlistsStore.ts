import { writable } from 'svelte/store';
import Cookies from 'cookie-universal';
import axios from 'axios';

export const playlistsStore = writable([]);

async function fetchPlaylists() {
    const cookies = Cookies();
    const accessToken = cookies.get('spotify_access_token');

    if (!accessToken)
        return;

    try {
        const response = await axios.get('/api/playlists', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const playlists = response.data;
        playlistsStore.set(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error);
    }
}

fetchPlaylists()