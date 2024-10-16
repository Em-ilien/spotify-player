<script lang="ts">
	import Login from './Login.svelte';

	import Player from './Player.svelte';

	import Cookies from 'cookie-universal';
	import { onMount } from 'svelte';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
	import { scale } from 'svelte/transition';

	let playlists: string | any[] = [];
	let searchResults: any[] = [];
	let accessToken = '';
	let searchQuery = '';

	onMount(async () => {
		const cookies = Cookies();
		accessToken = cookies.get('spotify_access_token');

		if (accessToken) {
			const response = await fetch('/api/playlists', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});
			playlists = await response.json();
		}
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

	let playerState = { is_playing: false };

	async function fetchCurrentPlayState() {
		const response = await fetch('https://api.spotify.com/v1/me/player', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		playerState = await response.json();
	}

	onMount(fetchCurrentPlayState);

	async function pausePlay() {
		const method = playerState.is_playing ? 'PUT' : 'POST';
		const endpoint = playerState.is_playing ? 'pause' : 'play';

		await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: method
		});

		playerState.is_playing = !playerState.is_playing;
	}

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

<svelte:body
	on:keydown={(event) => {
		if (event.code === 'Space') {
			event.preventDefault();
			pausePlay();
		}
	}}
/>

{#if !accessToken}
	<Login />
{:else}
	<div class="mb-24">
		<div class="px-3 py-6 fixed top-0 left-0 right-0 bg-white shadow-md z-1">
			<div class="flex items-center justify-between">
				{#if searchQuery.length}
					<div
						class="flex items-center mr-3 transition-opacity duration-300 ease-in-out opacity-100"
						in:scale={{ duration: 300 }}
						out:scale={{ duration: 300 }}
					>
						<FontAwesomeIcon
							icon={faTimes}
							class="text-gray-500 cursor-pointer size-6"
							on:click={() => {
								searchQuery = '';
								searchResults = [];
							}}
						/>
					</div>
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
	</div>

	<div class="p-6 mb-20 z-2">
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
	</div>

	<Player {playerState} {accessToken} />
{/if}
