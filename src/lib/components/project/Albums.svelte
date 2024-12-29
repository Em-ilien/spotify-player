<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { albumsStore } from '$lib/stores/albumsStore';

	import { onMount } from 'svelte';
	interface Props {
		accessToken?: string | undefined | null;
	}

	let { accessToken = undefined }: Props = $props();

	let albums: string | any[] = $state([]);

	onMount(() => {
		albumsStore.subscribe((value) => {
			albums = value;
		});
	});

	async function playAlbum(albumUri: any) {
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
				context_uri: `spotify:album:${albumUri}`
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
