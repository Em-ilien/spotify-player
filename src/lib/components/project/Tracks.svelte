<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { tracksStore } from '$lib/stores/tracksStore';


	import { onMount } from 'svelte';
	interface Props {
		accessToken?: string | undefined | null;
	}

	let { accessToken = undefined }: Props = $props();

	let tracks: string | any[] = $state([]);

	onMount(() => {
		tracksStore.subscribe((value) => {
			tracks = value;
		});
	});

	async function playTrack(trackUri: any) {
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
		await fetch('https://api.spotify.com/v1/me/player/play', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			method: 'PUT',
			body: JSON.stringify({
				uris: [trackUri]
			})
		});
	}
</script>

{#if tracks.length > 0}
	<ul>
		{#each tracks as track}
			<li>
				<button
					class="px-6 py-1 cursor-pointer hover:bg-slate-100 w-full flex items-baseline"
					onclick={() => playTrack(track.track.uri)}
				>
					<FontAwesomeIcon icon={faPlay} class="text-gray-400 text-xs mr-3" />
					<div class="flex items-baseline justify-items-start flex-wrap gap-2 gap-y-1">
						<span class="text-base text-gray-800 text-left">{track.track.name}</span>
						<span class="text-xs text-gray-500 text-left">
							{#each track.track.artists as artist, index}
								{artist.name}{index < track.track.artists.length - 1 ? ', ' : ''}
							{/each}
						</span>
					</div>
				</button>
			</li>
		{/each}
	</ul>
{/if}
