<script lang="ts">
	import SearchBarre from './SearchBarre.svelte';

	import Login from './Login.svelte';

	import Player from './Player.svelte';

	import Cookies from 'cookie-universal';
	import { onMount } from 'svelte';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';

	let playlists: string | any[] = [];
	let accessToken: string | undefined | null = undefined;

	onMount(async () => {
		const cookies = Cookies();
		accessToken = cookies.get('spotify_access_token');
		let refreshToken = cookies.get('spotify_refresh_token');

		if (!refreshToken && !accessToken) {
			accessToken = null;
			return;
		} else if (refreshToken && !accessToken) {
			await refreshAccessToken();
			if (!accessToken) {
				accessToken = null;
				refreshToken = null;
				return;
			}
		}

		const response = await fetch('/api/playlists', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		playlists = await response.json();
	});

	async function refreshAccessToken() {
		const cookies = Cookies();
		const refreshToken = cookies.get('spotify_refresh_token');

		if (refreshToken) {
			const response = await fetch('/api/refresh_token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					refresh_token: refreshToken
				})
			});
			const data = await response.json();
			if (data.access_token) {
				cookies.set('spotify_access_token', data.access_token, { path: '/' });
				accessToken = data.access_token;
			}
			if (data.refresh_token) {
				cookies.set('spotify_refresh_token', data.refresh_token, { path: '/' });
			}
		}
	}

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

{#if accessToken === undefined}
	<div class="flex items-center justify-center h-screen">
		<span class="text-3xl">Loading...</span>
	</div>
{:else if accessToken === null}
	<Login />
{:else}
	<div class="mb-24">
		<SearchBarre {accessToken} />
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

	<Player {accessToken} />
{/if}
