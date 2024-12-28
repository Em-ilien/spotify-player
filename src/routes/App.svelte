<script>
	import { onMount } from 'svelte';
	import { playerState } from '$lib/player.svelte';

	import Player from '$lib/components/project/Player.svelte';
	import SearchBarre from '$lib/components/project/SearchBarre.svelte';
	import Albums from '$lib/components/project/Albums.svelte';
	import Artists from '$lib/components/project/Artists.svelte';
	import Playlists from '$lib/components/project/Playlists.svelte';
	import Tracks from '$lib/components/project/Tracks.svelte';

	let { accessToken = $bindable() } = $props();

	const tabs = $state([
		{ active: true, name: 'Playlists', component: Playlists },
		{ active: false, name: 'Albums', component: Albums },
		{ active: false, name: 'Artists', component: Artists },
		{ active: false, name: 'Tracks', component: Tracks }
	]);

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;
		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			let p = new Spotify.Player({
				name: 'Spotify Player',
				getOAuthToken: (cb) => {
					cb(accessToken);
				},
				volume: 0.5
			});

			playerState.set(p);
		};
	});
</script>

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

<Player bind:accessToken />
