<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { tracksStore } from '$lib/stores/tracksStore';

	export let accessToken: string | undefined | null = undefined;

	import { onMount } from 'svelte';

	let tracks: string | any[] = [];

	onMount(() => {
		tracksStore.subscribe((value) => {
			tracks = value;
		});
	});

	async function playTrack(trackUri: any) {
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
				context_uri: `spotify:track:${trackUri}`
			})
		});
	}
</script>

<h1 class="text-3xl font-bold mb-4">Tracks</h1>
{#if tracks.length > 0}
	<ul>
		{#each tracks as track}
			<li>
				<button
					class="px-4 py-1 cursor-pointer flex items-center hover:bg-slate-100 w-full rounded"
					on:click={() => playTrack(track.id)}
				>
					<FontAwesomeIcon icon={faPlay} />
					<span class="text-lg ml-2">{track.track.name}</span>
					<span class="text-sm ml-2 text-gray-500">
						{#each track.track.artists as artist, index}
							{artist.name}{index < track.track.artists.length - 1 ? ', ' : ''}
						{/each}
					</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}
