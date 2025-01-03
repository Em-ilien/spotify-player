<script lang="ts">
	import { playerState } from '$lib/player.svelte';
	import { faHeadphones } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import Menu from './Menu.svelte';
	import { onMount } from 'svelte';

	let { accessToken }: { accessToken?: string } = $props();

	onMount(() => {
		fetchDevices();
	});

	async function fetchDevices() {
		const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			method: 'GET'
		});
		const data = await res.json();

		playerState.devices = data.devices;
	}
</script>

<div class="flex space-x-2 ml-4" title="Spotify Connect (change device)">
	<Menu position={{ x: 'center', y: 'top' }} onMenuOpened={fetchDevices}>
		{#snippet button()}
			<span class="text-gray-500 cursor-pointer"
				><FontAwesomeIcon icon={faHeadphones} style={'width: 20px; height: 16px'} /></span
			>
		{/snippet}
		{#snippet menu()}
			<div class="pb-3 px-4">
				<span class="block text-gray-700 p-2 pb-4">Appareils</span>
				{#each playerState.devices as device}
					<button
						onclick={() => playerState.activeDevice(device.id)}
						class="flex items-center hover:bg-gray-100 rounded-lg px-2 py-1 w-full"
					>
						<span class="text-gray-700 text-sm">{device.name}</span>
					</button>
				{/each}
			</div>
		{/snippet}
	</Menu>
</div>
