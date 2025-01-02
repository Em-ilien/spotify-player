<script lang="ts">
	import { playerState } from '$lib/player.svelte';
	import { faHeadphones } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import Menu from './Menu.svelte';

	let { accessToken }: { accessToken?: string } = $props();

	let spotifyConnectDevices = $state([]);

	async function onMenuOpened() {
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

	function connectToDevice(deviceId: string) {
		playerState.connectToDevice(deviceId);
	}
</script>

<div class="flex space-x-2 ml-4" title="Spotify Connect (change device)">
	<Menu {onMenuOpened}>
		{#snippet button()}
			<span class="text-gray-500 cursor-pointer"
				><FontAwesomeIcon icon={faHeadphones} style={'width: 20px; height: 16px'} /></span
			>
		{/snippet}
		{#snippet menu()}
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
		{/snippet}
	</Menu>
</div>
