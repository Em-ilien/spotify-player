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

	let { accessToken = $bindable() } = $props();

	let playing = $derived(playerState.state?.paused ?? false);
	$inspect(playing, 'playing');
	let playingTitle = $derived(playerState.state?.track_window.current_track.name);
	let playingArtists = $derived(
		playerState.state?.track_window.current_track.artists.map((a) => a.name)
	);
	let progress_ms = $derived(playerState.state?.position);
	let duration_ms = $derived(playerState.state?.track_window.current_track.duration_ms);

	let trackDurationRatioPercent = $derived((progress_ms / duration_ms) * 100);

	let volume_percent = $state(50);
	function setVolume() {
		playerState.setVolume(volume_percent * 0.01);
	}

	function pausePlay() {
		playerState.pausePlay(accessToken);
	}
</script>

<svelte:body
	onkeydown={(event) => {
		if (event.code === 'Space') {
			event.preventDefault();
			playerState.pausePlay();
		}
	}}
/>

<div
	class="fixed bottom-0 w-full border-t border-slate-500 bg-white p-4 flex justify-between overflow-x-auto"
>
	<div class="flex items-center space-x-4">
		{#if playing}
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
				onclick={playerState.skipPrevious}
			>
				<FontAwesomeIcon icon={faBackward} />
			</button>
			<button
				class="font-bold py-3 rounded transition duration-300 text-gray-400 text-2xl"
				onclick={pausePlay}
			>
				{#if playing}
					<FontAwesomeIcon icon={faPauseCircle} />
				{:else}
					<FontAwesomeIcon icon={faPlayCircle} />
				{/if}
			</button>
			<button
				class=" font-bold py-2 px-4 rounded transition duration-300 text-gray-400"
				onclick={playerState.skipNext}
			>
				<FontAwesomeIcon icon={faForward} />
			</button>
		</div>
		{#if playing}
			<div class="flex items-center space-x-2">
				<input
					type="range"
					min="0"
					max={duration_ms}
					value={progress_ms}
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
		<span class="text-gray-500"><FontAwesomeIcon icon={faVolumeUp} /></span>
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
