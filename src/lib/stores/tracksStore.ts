import { writable } from 'svelte/store';
import Cookies from 'cookie-universal';
import axios from 'axios';

export const tracksStore = writable([]);

async function fetchTracks() {
    const cookies = Cookies();
    const accessToken = cookies.get('spotify_access_token');

    if (!accessToken)
        return;

    try {
        const response = await axios.get('/api/tracks', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const tracks = response.data;
        tracksStore.set(tracks);
    } catch (error) {
        console.error('Error fetching tracks:', error);
    }
}

fetchTracks()