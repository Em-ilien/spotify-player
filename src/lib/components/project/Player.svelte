<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faBackward,
		faForward,
		faVolumeUp,
		faPlayCircle,
		faPauseCircle
	} from '@fortawesome/free-solid-svg-icons';
	import { playerState } from '$lib/player.svelte';
	import { onMount } from 'svelte';

	interface Props {
		accessToken?: string;
	}

	let { accessToken = undefined }: Props = $props();

	let isPaused = $derived(playerState?.state?.paused);

	let playingTrack = $derived(playerState?.state?.track_window?.current_track);
	let playingTitle = $derived(playingTrack?.name);
	let playingArtists = $derived(playingTrack?.artists.map((a) => a.name));
	let duration_ms = $derived(playingTrack?.duration_ms);

	let progress_ms = $state(playerState?.state?.position);

	$effect(() => {
		progress_ms = playerState.state?.position;
	});
	setInterval(() => {
		if (isPaused) return;
		if (progress_ms >= duration_ms) progress_ms = 0;
		else progress_ms += 300;
	}, 300);

	function changeProgress(event: Event) {
		const target = event.target as HTMLInputElement;
		playerState.seek(target.value);
	}

	let trackDurationRatioPercent = $derived((progress_ms / duration_ms) * 100);

	let volume_percent = $state(50);
	function setVolume() {
		playerState.setVolume(volume_percent * 0.01);
	}

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

			playerState.setPlayer(p);
		};
	});
</script>

<svelte:body
	onkeydown={(event) => {
		if (event.code === 'Space') {
			event.preventDefault();
			playerState.togglePlay();
		}
	}}
/>

<div class="flex items-center space-x-4">
	{#if playingTrack}
		<div>
			<p class="text-sm font-semibold">{playingTitle}</p>
			<p class="text-xs text-gray-500">{playingArtists}</p>
		</div>
	{:else}
		<p class="text-sm text-gray-500">No track currently playing</p>
	{/if}
</div>
<div class="flex space-x-2">
	<div class="flex items-center space-x-2 mr-4">
		<button
			class="font-bold py-2 px-4 rounded transition duration-300 text-gray-400"
			onclick={playerState.previousTrack}
		>
			<FontAwesomeIcon icon={faBackward} style={'width: 16px; height: 16px'} />
		</button>
		<button
			class="font-bold py-3 rounded transition duration-300 text-gray-400 text-2xl"
			onclick={playerState.togglePlay}
		>
			{#if !isPaused}
				<FontAwesomeIcon icon={faPauseCircle} style={'width: 24px; height: 24px'} />
			{:else}
				<FontAwesomeIcon icon={faPlayCircle} style={'width: 24px; height: 24px'} />
			{/if}
		</button>
		<button
			class=" font-bold py-2 px-4 rounded transition duration-300 text-gray-400"
			onclick={playerState.nextTrack}
		>
			<FontAwesomeIcon icon={faForward} style={'width: 16px; height: 16px'} />
		</button>
	</div>
	{#if playingTrack}
		<div class="flex items-center space-x-2">
			<span class="text-gray-500"
				>{Math.floor(progress_ms / 60000)}:{Math.floor((progress_ms % 60000) / 1000)
					.toString()
					.padStart(2, '0')}</span
			>
			<input
				type="range"
				min="0"
				max={duration_ms}
				value={progress_ms}
				oninput={changeProgress}
				class="w-64 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
				style="background: linear-gradient(to right, #4caf50 {trackDurationRatioPercent}%, #d3d3d3 {trackDurationRatioPercent}%, #d3d3d3 100%);"
			/>
			<span class="text-gray-500"
				>{Math.floor(duration_ms / 60000)}:{Math.floor((duration_ms % 60000) / 1000)
					.toString()
					.padStart(2, '0')}</span
			>
		</div>
	{/if}
</div>
<div class="flex items-center space-x-2 ml-4">
	<span class="text-gray-500"
		><FontAwesomeIcon icon={faVolumeUp} style={'width: 20px; height: 16px'} /></span
	>
	<input
		type="range"
		min="0"
		max="100"
		bind:value={volume_percent}
		oninput={setVolume}
		class="w-25 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
		style="background: linear-gradient(to right, #4caf50 {volume_percent}%, #d3d3d3 {volume_percent}%, #d3d3d3 100%);"
	/>
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
