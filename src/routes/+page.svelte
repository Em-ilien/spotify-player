<script lang="ts">
	import Cookies from 'cookie-universal';
	import { onMount } from 'svelte';

	import SearchBarre from './SearchBarre.svelte';
	import Login from './Login.svelte';
	import Player from './Player.svelte';
	import Playlists from './Playlists.svelte';
	import Albums from './Albums.svelte';
	import Tracks from './Tracks.svelte';
	import Artists from './Artists.svelte';

	let accessToken: string | undefined | null = undefined;

	const tabs = [
		{ active: true, name: 'Playlists', component: Playlists },
		{ active: false, name: 'Albums', component: Albums },
		{ active: false, name: 'Artists', component: Artists },
		{ active: false, name: 'Tracks', component: Tracks },
	];

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
		<div class="flex gap-4 mb-5">
			{#each tabs as tab}
				<button
					class="px-4 py-2 cursor-pointer bg-transparent text-base {tab.active ? 'border-b-2' : ''}"
					on:click={() => {
						tabs.forEach((t) => (t.active = false));
						tab.active = true;
					}}
					>
					{tab.name}
				</button>
			{/each}
		</div>

		{#each tabs as tab}
			{#if tab.active}
				<svelte:component this={tab.component} {accessToken} />
			{/if}
		{/each}
	</div>

	<Player {accessToken} />
{/if}
