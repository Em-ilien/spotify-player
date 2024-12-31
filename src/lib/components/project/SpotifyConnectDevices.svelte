<script lang="ts">
	import { playerState } from '$lib/player.svelte';
	import { faHeadphones } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	interface Props {
		accessToken?: string;
	}

	let { accessToken = undefined }: Props = $props();

	let showSpotifyConnectMenu = $state(false);

	function handleClickOutside(event: MouseEvent) {
		const menu = document.querySelector('.relative');
		if (menu && !menu.contains(event.target as Node)) {
			showSpotifyConnectMenu = false;
		}
	}

	let spotifyConnectDevices = $state([]);

	async function toggleSpotifyConnectButton(event: MouseEvent) {
		event.stopPropagation();
		showSpotifyConnectMenu = !showSpotifyConnectMenu;
		if (showSpotifyConnectMenu) {
			const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				},
				method: 'GET'
			});
			const data = await res.json();

			spotifyConnectDevices = data.devices;
		}
	}

	function connectToDevice(deviceId: string) {
		playerState.connectToDevice(deviceId);
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="flex items-center relative space-x-2 ml-4" title="Spotify Connect (change device)">
	<button onclick={toggleSpotifyConnectButton}>
		<span class="text-gray-500 cursor-pointer"
			><FontAwesomeIcon icon={faHeadphones} style={'width: 20px; height: 16px'} /></span
		>
	</button>
	{#if showSpotifyConnectMenu}
		<div
			class="absolute bottom-full right-1/2 transform translate-x-1/2 mt-3 py-4 px-2 bg-white border border-gray-300 rounded shadow-lg w-max"
		>
			<div class="pb-3 px-4">
				<span class="block text-gray-700 p-2 pb-4">Appareils</span>
				{#each spotifyConnectDevices as device}
					<button
						onclick={connectToDevice(device.id)}
						class="flex items-center hover:bg-gray-100 rounded-lg px-2 py-1 w-full"
					>
						<span class="text-gray-700 text-sm">{device.name}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
