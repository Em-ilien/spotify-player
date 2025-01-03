<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { tracksStore } from '$lib/stores/tracksStore';
	import { playerState } from '$lib/player.svelte';

	interface Props {
		accessToken?: string | undefined | null;
	}

	let { accessToken = undefined }: Props = $props();

	let tracks = $derived($tracksStore);

	function playTrack(trackUri: string) {
		fetch('/api/play', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				uris: [trackUri],
				currentDeviceId: playerState.devices.find((device) => device?.is_this_device)?.id
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
