<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { albumsStore } from '$lib/stores/albumsStore';
	import { playerState } from '$lib/player.svelte';

	let albums = $derived($albumsStore);

	function playAlbum(albumUri: string) {
		fetch('/api/play', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				context_uri: `spotify:album:${albumUri}`,
				currentDeviceId: playerState.devices.find((device) => device?.is_this_device)?.id
			})
		});
	}
</script>

{#if albums.length > 0}
	<ul>
		{#each albums as album}
			<li>
				<button
					class="px-6 py-1 cursor-pointer hover:bg-slate-100 w-full flex items-baseline"
					onclick={() => playAlbum(album.album.id)}
				>
					<FontAwesomeIcon icon={faPlay} class="text-gray-400 text-xs mr-3" />
					<div class="flex items-baseline justify-items-start flex-wrap gap-2 gap-y-1">
						<span class="text-base text-gray-800 text-left">{album.album.name}</span>
						<span class="text-xs text-gray-500 text-left">
							{#each album.album.artists as artist, index}
								{artist.name}{index < album.album.artists.length - 1 ? ', ' : ''}
							{/each}
						</span>
					</div>
				</button>
			</li>
		{/each}
	</ul>
{/if}
