<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { artistsStore } from '$lib/stores/artistsStore';

	export let accessToken: string | undefined | null = undefined;

	import { onMount } from 'svelte';

	let artists: string | any[] = [];

	onMount(() => {
		artistsStore.subscribe((value) => {
			artists = value;
		});
	});

	async function playArtist(artistUri: any) {
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
				context_uri: `spotify:artist:${artistUri}`
			})
		});
	}
</script>

<h1 class="text-3xl font-bold mb-4">Artists</h1>
{#if artists.length > 0}
	<ul>
		{#each artists as artist}
			<li>
				<button
					class="px-4 py-1 cursor-pointer flex items-center hover:bg-slate-100 w-full rounded"
					on:click={() => playArtist(artist.id)}
				>
					<FontAwesomeIcon icon={faPlay} />
					<span class="text-lg ml-2">{artist.artist.name}</span>
					<span class="text-sm ml-2 text-gray-500">
						{#each artist.artist.artists as artist, index}
							{artist.name}{index < artist.artist.artists.length - 1 ? ', ' : ''}
						{/each}
					</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}
