<script lang="ts">
	import User from './User.svelte';

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

<div class="p-6 border-b-gray-300">
	<div class="flex items-center justify-between">
		{#if searchQuery.length}
			<button
				class="flex items-center mx-3 transition-opacity duration-300 ease-in-out opacity-100"
				in:scale={{ duration: 300 }}
				out:scale={{ duration: 300 }}
				on:click={stopSearch}
			>
				<FontAwesomeIcon icon={faTimes} class="text-gray-400 cursor-pointer size-6" />
			</button>
		{/if}

		<div class="flex items-center border rounded p-2 flex-grow">
			<FontAwesomeIcon icon={faSearch} class="text-gray-300 text-sm" />
			<input
				type="text"
				placeholder="Search for a track..."
				bind:value={searchQuery}
				class="outline-none w-full ml-2 text-sm"
				on:keydown|stopPropagation={(event) => {
					if (event.key === 'Escape') {
						stopSearch();
					}
				}}
			/>
		</div>

		<div class="ml-4">
			<User {accessToken} />
		</div>
	</div>
	{#if searchResults.length > 0}
		<ul class="mt-2 pb-6 border-b-gray-500 border-b-2">
			{#each searchResults as track}
				<li>
					<button
						class="px-4 py-1 cursor-pointer hover:bg-slate-100 w-full rounded flex items-baseline
						"
						on:click={() => playTrack(track.uri)}
					>
						<FontAwesomeIcon icon={faPlay} class="text-gray-400 text-xs" />
						<span class="text-base text-gray-800 ml-3 mr-2">{track.name}</span>
						<span class="text-xs text-gray-500">
							{#each track.artists as artist, index}
								{artist.name}{index < track.artists.length - 1 ? ', ' : ''}
							{/each}
						</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
