<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { playlistsStore } from '$lib/stores/playlistsStore';

	export let accessToken: string | undefined | null = undefined;

	import { onMount } from 'svelte';

	let playlists: string | any[] = [];

	onMount(() => {
		playlistsStore.subscribe((value) => {
			playlists = value;
		});
	});

	async function playPlaylist(playlistUri: any) {
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
				context_uri: `spotify:playlist:${playlistUri}`
			})
		});
	}
</script>

<h1 class="text-3xl font-bold mb-4">Playlists</h1>
{#if playlists.length > 0}
	<ul>
		{#each playlists as playlist}
			<li>
				<button
					class="px-4 py-1 cursor-pointer flex items-center hover:bg-slate-100 w-full rounded
						"
					on:click={() => playPlaylist(playlist.id)}
				>
					<FontAwesomeIcon icon={faPlay} />
					<span class="text-lg ml-2">{playlist.name}</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}
