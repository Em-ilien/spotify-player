<script lang="ts">
	import Cookies from 'cookie-universal';
	import { onMount } from 'svelte';

	import App from './App.svelte';
	import Login from './Login.svelte';

	let accessToken: string | undefined | null = $state(undefined);

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
	<App bind:accessToken />
{/if}
