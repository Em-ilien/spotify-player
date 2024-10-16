<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { albumsStore } from '$lib/stores/albumsStore';

	export let accessToken: string | undefined | null = undefined;

	import { onMount } from 'svelte';

	let albums: string | any[] = [];

	onMount(() => {
		albumsStore.subscribe((value) => {
			albums = value;
		});
	});

	async function playAlbum(albumUri: any) {
		const devicesResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		const devices = await devicesResponse.json();

		if (devices.devices.length === 0) {
			alert('No active devices found. Please open Spotify on one of your devices.');
			return;
		}
		fetch('https://api.spotify.com/v1/me/player/play', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			method: 'PUT',
			body: JSON.stringify({
				context_uri: `spotify:album:${albumUri}`
			})
		});
	}
</script>

<h1 class="text-3xl font-bold mb-4">Albums</h1>
{#if albums.length > 0}
	<ul>
		{#each albums as album}
			<li>
				<button
					class="px-4 py-1 cursor-pointer flex items-center hover:bg-slate-100 w-full rounded"
					on:click={() => playAlbum(album.album.id)}
				>
					<FontAwesomeIcon icon={faPlay} />
					<span class="text-lg ml-2">{album.album.name}</span>
					<span class="text-sm ml-2 text-gray-500">
						{#each album.album.artists as artist, index}
							{artist.name}{index < album.album.artists.length - 1 ? ', ' : ''}
						{/each}
					</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}
