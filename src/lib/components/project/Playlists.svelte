<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { playlistsStore } from '$lib/stores/playlistsStore';
	import { playerState } from '$lib/player.svelte';

	interface Props {
		accessToken?: string | undefined | null;
	}

	let { accessToken = undefined }: Props = $props();

	let notNullPlaylists = $derived($playlistsStore?.filter((playlist) => playlist !== null));

	function playPlaylist(playlistUri: string) {
		fetch('/api/play', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				context_uri: `spotify:playlist:${playlistUri}`,
				currentDeviceId: playerState.devices.find((device) => device?.is_this_device)?.id
			})
		});
	}
</script>

{#if notNullPlaylists.length > 0}
	<ul>
		{#each notNullPlaylists as playlist}
			<li>
				<button
					class="px-6 py-1 cursor-pointer hover:bg-slate-100 w-full flex items-baseline"
					onclick={() => playPlaylist(playlist.id)}
				>
					<FontAwesomeIcon icon={faPlay} class="text-gray-400 text-xs mr-3" />
					<span class="text-base text-gray-800 text-left">{playlist.name}</span>
				</button>
			</li>
		{/each}
	</ul>
{/if}
