<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faBackward,
		faForward,
		faVolumeUp,
		faPlayCircle,
		faPauseCircle
	} from '@fortawesome/free-solid-svg-icons';
	import { onMount, onDestroy } from 'svelte';

	export let accessToken = '';

	let playerState = {
		is_playing: false,
		device: { volume_percent: 50 },
		item: {
			artists: [],
			name: '',
			duration_ms: 0
		},
		progress_ms: 0
	};

	let interval: number | undefined;

	$: trackDurationRatioPercent = (playerState.progress_ms / playerState.item.duration_ms) * 100;

	onMount(() => {
		startTrackingCurrentPlayState();
	});

	async function startTrackingCurrentPlayState() {
		clearInterval(interval);
		setTimeout(async () => {
			await fetchCurrentPlayState();
			interval = setInterval(async () => {
				console.log(playerState.item.name);

				if (playerState.is_playing) {
					playerState.progress_ms += 1000;
					if (playerState.progress_ms >= playerState.item.duration_ms) {
						playerState.progress_ms = playerState.item.duration_ms;
						await fetchCurrentPlayState();
						clearInterval(interval);
					}
				}
			}, 1000);
		}, 1000);
	}

	onDestroy(() => {
		clearInterval(interval);
	});

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
		startTrackingCurrentPlayState();
	}

	function pausePlay() {
		if (playerState.is_playing) {
			pause();
		} else {
			play();
		}
		startTrackingCurrentPlayState();
	}

	async function skipNext() {
		await fetch('https://api.spotify.com/v1/me/player/next', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'POST'
		});
		startTrackingCurrentPlayState();
	}

	async function skipPrevious() {
		await fetch('https://api.spotify.com/v1/me/player/previous', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'POST'
		});
		startTrackingCurrentPlayState();
	}

	async function setVolume() {
		await fetch(
			`https://api.spotify.com/v1/me/player/volume?volume_percent=${playerState.device.volume_percent}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				method: 'PUT'
			}
		);
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
	<div class="flex items-center space-x-4">
		{#if playerState.item}
			<div>
				<p class="text-sm font-semibold">{playerState.item.name}</p>
				<p class="text-xs text-gray-500">
					{playerState.item.artists.map((artist) => artist.name).join(', ')}
				</p>
			</div>
		{:else}
			<p class="text-sm text-gray-500">No track currently playing</p>
		{/if}
	</div>
	<div class="flex space-x-2">
		<div class="flex items-center space-x-2 mr-4">
			<button
				class="font-bold py-2 px-4 rounded transition duration-300 text-gray-400"
				on:click={skipPrevious}
			>
				<FontAwesomeIcon icon={faBackward} />
			</button>
			<button
				class="font-bold py-3 rounded transition duration-300 text-gray-400 text-2xl"
				on:click={pausePlay}
			>
				{#if playerState.is_playing}
					<FontAwesomeIcon icon={faPauseCircle} />
				{:else}
					<FontAwesomeIcon icon={faPlayCircle} />
				{/if}
			</button>
			<button
				class=" font-bold py-2 px-4 rounded transition duration-300 text-gray-400"
				on:click={skipNext}
			>
				<FontAwesomeIcon icon={faForward} />
			</button>
		</div>
		{#if playerState.item}
			<div class="flex items-center space-x-2">
				<input
					type="range"
					min="0"
					max={playerState.item.duration_ms}
					value={playerState.progress_ms}
					class="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
					style="background: linear-gradient(to right, #4caf50 {trackDurationRatioPercent}%, #d3d3d3 {trackDurationRatioPercent}%, #d3d3d3 100%);"
				/>
				<span class="text-gray-500"
					>{Math.floor(playerState.item.duration_ms / 60000)}:{Math.floor(
						(playerState.item.duration_ms % 60000) / 1000
					)
						.toString()
						.padStart(2, '0')}</span
				>
			</div>
		{/if}
	</div>
	<div class="flex items-center space-x-2 ml-4">
		<span class="text-gray-500"><FontAwesomeIcon icon={faVolumeUp} /></span>
		<input
			type="range"
			min="0"
			max="100"
			bind:value={playerState.device.volume_percent}
			on:input={setVolume}
			class="w-25 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
			style="background: linear-gradient(to right, #4caf50 {playerState.device
				.volume_percent}%, #d3d3d3 {playerState.device.volume_percent}%, #d3d3d3 100%);"
		/>
	</div>
</div>

<style>
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 0;
		height: 0;
		background: transparent;
		cursor: pointer;
	}

	input[type='range']::-moz-range-thumb {
		width: 0;
		height: 0;
		background: transparent;
		cursor: pointer;
	}

	input[type='range']::-ms-thumb {
		width: 0;
		height: 0;
		background: transparent;
		cursor: pointer;
	}
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 100%;
		height: 8px;
		background: transparent;
		cursor: pointer;
	}
</style>
