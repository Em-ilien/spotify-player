<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { artistsStore } from '$lib/stores/artistsStore';

	interface Props {
		accessToken?: string | undefined | null;
	}

	let { accessToken = undefined }: Props = $props();

	let artists = $artistsStore;
	async function playArtist(artistUri: any) {
		const devicesResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		const devices = await devicesResponse.json();

		if (devices.devices.length === 0) {
			alert('No active devices found. Please open Spotify on one of your devices.');
			return;
		}
		fetch('https://api.spotify.com/v1/me/player/play', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			method: 'PUT',
			body: JSON.stringify({
				context_uri: `spotify:artist:${artistUri}`
			})
		});
	}
</script>

{#if artists.length > 0}
	<ul>
		{#each artists as artist}
			<li>
				<button
					class="px-6 py-1 cursor-pointer hover:bg-slate-100 w-full flex items-baseline"
					onclick={() => playArtist(artist.id)}
				>
					<FontAwesomeIcon icon={faPlay} class="text-gray-400 text-xs mr-3" />
					<span class="text-base text-gray-800 text-left">{artist.name}</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}
