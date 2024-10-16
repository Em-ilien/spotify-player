<script lang="ts">
	import Cookies from 'cookie-universal';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faBackward,
		faPause,
		faPlay,
		faForward,
		faVolumeUp,
		faSignOutAlt
	} from '@fortawesome/free-solid-svg-icons';

	export let accessToken = '';
	export let playerState = { is_playing: false };

	let volume = 50;

	async function pausePlay() {
		const method = playerState.is_playing ? 'PUT' : 'POST';
		const endpoint = playerState.is_playing ? 'pause' : 'play';

		await fetch(`https://api.spotify.com/v1/me/player/${endpoint}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: method
		});

		playerState.is_playing = !playerState.is_playing;
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

	async function setVolume(event: Event) {
		const volume = (event.target as HTMLInputElement).value;
		await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
			method: 'PUT'
		});
	}

	function logout() {
		const cookies = Cookies();
		cookies.remove('spotify_access_token', { path: '/' });
		window.location.href = '/';
	}
</script>

<div class="fixed bottom-0 w-full border-t border-slate-500 bg-white p-4 flex justify-between overflow-x-auto">
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
				value={volume}
				on:input={setVolume}
				class="w-25 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
			/>
		</div>
	</div>
	<div class="ml-8">
		<button
			class="bg-black text-white font-bold py-2 px-4 rounded hover:bg-black transition duration-300 ml-auto block"
			on:click={logout}
		>
			<FontAwesomeIcon icon={faSignOutAlt} />
		</button>
	</div>
</div>
