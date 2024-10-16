import { writable } from 'svelte/store';
import Cookies from 'cookie-universal';
import axios from 'axios';

export const artistsStore = writable([]);

async function fetchArtists() {
    const cookies = Cookies();
    const accessToken = cookies.get('spotify_access_token');

    if (!accessToken)
        return;

    try {
        const response = await axios.get('/api/artists', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const artists = response.data;
        artistsStore.set(artists);
    } catch (error) {
        console.error('Error fetching artists:', error);
    }
}

fetchArtists()