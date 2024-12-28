<script>
	import { onMount } from 'svelte';

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

	let player = $state(undefined);

	$effect(() => {
		if (!player) {
			return;
		}

		console.log('Player22:', player);

		player.addListener('player_state_changed', (s) => {
			console.log('Player state changed:', s);
			if (!s) {
				return;
			}
			// state = s;
		});
	});

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;
		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			const token = accessToken;
			player = new Spotify.Player({
				name: 'Spotify Player',
				getOAuthToken: (cb) => {
					cb(token);
				},
				volume: 0.5
			});

			console.log(player);

			// Ready
			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
			});

			// Not Ready
			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});

			player.addListener('initialization_error', ({ message }) => {
				console.error(message);
			});

			player.addListener('authentication_error', ({ message }) => {
				console.error(message);
			});

			player.addListener('account_error', ({ message }) => {
				console.error(message);
			});

			player.connect().then((success) => {
				if (success) {
					console.log('The Web Playback SDK successfully connected to Spotify!');

					player.getCurrentState().then((state) => {
						console.log('Current state:', state);

						if (!state) {
							console.error('User is not playing music through the Web Playback SDK');
							return;
						}

						console.log('User is playing music through the Web Playback SDK', state);
					});
				}
			});
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

<Player {accessToken} bind:player />
