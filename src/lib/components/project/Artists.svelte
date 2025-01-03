<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { artistsStore } from '$lib/stores/artistsStore';
	import { playerState } from '$lib/player.svelte';

	let artists = $derived($artistsStore);

	function playArtist(artistUri: string) {
		fetch('/api/play', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				context_uri: `spotify:artist:${artistUri}`,
				currentDeviceId: playerState.devices.find((device) => device?.is_this_device)?.id
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
