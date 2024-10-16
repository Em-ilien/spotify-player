<script lang="ts">

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faBackward,
		faPause,
		faPlay,
		faForward,
		faVolumeUp,
	} from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';

	export let accessToken = '';

	let playerState = { is_playing: false, device: {volume_percent: 50} };

	
	onMount(fetchCurrentPlayState);

	async function fetchCurrentPlayState() {
		const response = await fetch('https://api.spotify.com/v1/me/player', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		playerState = await response.json();
	}

	async function play() {
		const response = await fetch('https://api.spotify.com/v1/me/player', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		console.log(response);

		if (response.status === 204) {
			const devicesResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});
			const devicesData = await devicesResponse.json();

			if (devicesData.devices.length === 0) {
				alert('No active devices found. Please open Spotify on one of your devices.');
				return;
			}

			await fetch('https://api.spotify.com/v1/me/player', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				method: 'PUT',
				body: JSON.stringify({
					device_ids: [devicesData.devices[0].id],
					play: true
				})
			});
		}
		await fetch('https://api.spotify.com/v1/me/player/play', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'PUT'
		});

		playerState.is_playing = true;
	}

	async function pause() {
		await fetch('https://api.spotify.com/v1/me/player/pause', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'PUT'
		});

		playerState.is_playing = false;
	}

	function pausePlay() {
		if (playerState.is_playing) {
			pause();
		} else {
			play();
		}
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

	async function setVolume() {
		await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${playerState.device.volume_percent}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'PUT'
		});
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

<div
	class="fixed bottom-0 w-full border-t border-slate-500 bg-white p-4 flex justify-between overflow-x-auto"
>
	<div class="flex space-x-2">
		<div class="flex items-center space-x-2 mr-4">
			<button class=" font-bold py-2 px-4 rounded transition duration-300" on:click={skipPrevious}>
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
				bind:value={playerState.device.volume_percent}
				on:input={setVolume}
				class="w-25 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
			/>
		</div>
	</div>
	<div class="ml-8">
		
	</div>
</div>
