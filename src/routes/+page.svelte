<script lang="ts">
	import Cookies from 'cookie-universal';
	import { onMount } from 'svelte';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faBackward,
		faPause,
		faPlay,
		faForward,
		faVolumeUp,
		faSignOutAlt,
		faSignInAlt
	} from '@fortawesome/free-solid-svg-icons';

	let playlists: string | any[] = [];
	let accessToken = '';
	let volume = 50;

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

	async function skipNext() {
		await fetch('https://api.spotify.com/v1/me/player/next', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'POST'
		});
	}

	async function skipPrevious() {
		await fetch('https://api.spotify.com/v1/me/player/previous', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'POST'
		});
	}

	async function setVolume(event: Event) {
		const volume = (event.target as HTMLInputElement).value;
		await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'PUT'
		});
	}

	function logout() {
		const cookies = Cookies();
		cookies.remove('spotify_access_token', { path: '/' });
		window.location.href = '/';
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
	<div class="flex justify-center items-center h-screen">
		<button
			class="bg-black text-white font-bold py-2 px-4 rounded hover:bg-black transition duration-300"
			on:click={() => (window.location.href = '/login')}
		>
			<FontAwesomeIcon icon={faSignInAlt} />
		</button>
	</div>
{:else}
	<div class="p-6 mb-20">
		<h1 class="text-3xl font-bold mb-4">Playlists</h1>
		{#if playlists.length > 0}
			<ul>
				{#each playlists as playlist}
					<li>
						<button class="px-4 py-1 cursor-pointer flex items-center hover:bg-slate-100 w-full rounded
						" on:click={() => playPlaylist(playlist.id)}>
							<FontAwesomeIcon icon={faPlay} />
							<span class="text-lg ml-2">{playlist.name}</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<div class="fixed bottom-0 w-full border-t border-slate-500 bg-white p-4 flex justify-between">
		<div class="flex space-x-2">
			<div class="flex items-center space-x-2 mr-4">
				<button
					class=" font-bold py-2 px-4 rounded transition duration-300"
					on:click={skipPrevious}
				>
					<FontAwesomeIcon icon={faBackward} />
				</button>
				<button class=" font-bold py-2 px-4 rounded transition duration-300" on:click={pausePlay}>
					{#if playerState.is_playing}
						<FontAwesomeIcon icon={faPause} />
					{:else}
						<FontAwesomeIcon icon={faPlay} />
					{/if}
				</button>
				<button class=" font-bold py-2 px-4 rounded transition duration-300" on:click={skipNext}>
					<FontAwesomeIcon icon={faForward} />
				</button>
			</div>
			<div class="flex items-center space-x-2 ml-4">
				<span><FontAwesomeIcon icon={faVolumeUp} /></span>
				<input
					type="range"
					min="0"
					max="100"
					value={volume}
					on:input={setVolume}
					class="w-25 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
				/>
			</div>
		</div>
		<div>
			<button
				class="bg-black text-white font-bold py-2 px-4 rounded hover:bg-black transition duration-300 ml-auto block"
				on:click={logout}
			>
				<FontAwesomeIcon icon={faSignOutAlt} />
			</button>
		</div>
	</div>
{/if}
