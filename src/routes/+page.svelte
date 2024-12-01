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

	let accessToken: string | undefined | null = $state(undefined);

	const tabs = $state([
		{ active: true, name: 'Playlists', component: Playlists },
		{ active: false, name: 'Albums', component: Albums },
		{ active: false, name: 'Artists', component: Artists },
		{ active: false, name: 'Tracks', component: Tracks }
	]);

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
	<SearchBarre {accessToken} />

	<div class="mb-20 z-2">
		<div class="pt-2 pb-3 flex mx-2">
			{#each tabs as tab}
				<button
					class="px-4 cursor-pointer bg-transparent text-sm group"
					onclick={() => {
						tabs.forEach((t) => (t.active = false));
						tab.active = true;
					}}
				>
					<div
						class=" py-2 border-b-2 border-transparent
						{tab.active
							? 'border-b-gray-400 text-black'
							: 'group-hover:text-gray-700 group-hover:border-b-gray-200 group-hover:border-b-2 text-gray-500'}
						"
					>
						<span>{tab.name}</span>
					</div>
				</button>
			{/each}
		</div>

		{#each tabs as tab}
			{#if tab.active}
				<tab.component {accessToken} />
			{/if}
		{/each}
	</div>

	<Player {accessToken} />
{/if}
