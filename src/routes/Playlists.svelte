<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { playlistsStore } from '$lib/stores/playlistsStore';

	export let accessToken: string | undefined | null = undefined;

	import { onMount } from 'svelte';

	let playlists: { id: number; name: string }[] = [];
	$: notNullPlaylists = playlists?.filter((playlist) => playlist !== null);

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

{#if notNullPlaylists.length > 0}
	<ul>
		{#each notNullPlaylists as playlist}
			<li>
				<button
					class="px-6 py-1 cursor-pointer hover:bg-slate-100 w-full flex items-baseline"
					on:click={() => playPlaylist(playlist.id)}
				>
					<FontAwesomeIcon icon={faPlay} class="text-gray-400 text-xs mr-3" />
					<span class="text-base text-gray-800 text-left">{playlist.name}</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}
