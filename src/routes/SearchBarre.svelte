<script lang="ts">
  import Logout from './User.svelte';


	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
	import { scale } from 'svelte/transition';

	export let accessToken = '';
	// export let playerState = { is_playing: false };

	let searchResults: any[] = [];
	let searchQuery = '';

	async function searchTracks() {
		if (!searchQuery) return;
		const response = await fetch(
			`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		);
		const data = await response.json();
		searchResults = data.tracks.items;
	}

	function stopSearch() {
		searchQuery = '';
		searchResults = [];
	}

	$: {
		if (searchQuery.length) searchTracks();
		else stopSearch();
	}

	async function playTrack(trackUri: string) {
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
		await fetch('https://api.spotify.com/v1/me/player/play', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			method: 'PUT',
			body: JSON.stringify({
				uris: [trackUri]
			})
		});
	}
</script>

<div class="p-6 fixed top-0 left-0 right-0 bg-white shadow-md z-1">
	<div class="flex items-center justify-between">
		{#if searchQuery.length}
			<button
				class="flex items-center mx-3 transition-opacity duration-300 ease-in-out opacity-100"
				in:scale={{ duration: 300 }}
				out:scale={{ duration: 300 }}
                on:click={stopSearch}
			>
				<FontAwesomeIcon
					icon={faTimes}
					class="text-gray-500 cursor-pointer size-6"
					
				/>
			</button>
		{/if}

		<div class="flex items-center border rounded p-2 flex-grow">
			<FontAwesomeIcon icon={faSearch} class="text-gray-500" />
			<input
				type="text"
				placeholder="Search for a track..."
				bind:value={searchQuery}
				class="outline-none w-full ml-2"
				on:keydown|stopPropagation={(event) => {
					if (event.key === 'Escape') {
						stopSearch();
					}
				}}
			/>
		</div>

		<div class="ml-2">
			<Logout />
		</div>
	</div>
	{#if searchResults.length > 0}
		<ul class="mt-2">
			{#each searchResults as track}
				<li>
					<button
						class="px-4 py-1 cursor-pointer flex items-center hover:bg-slate-100 w-full rounded
						"
						on:click={() => playTrack(track.uri)}
					>
						<FontAwesomeIcon icon={faPlay} />
						<span class="text-lg ml-2">{track.name} - {track.artists[0].name}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
