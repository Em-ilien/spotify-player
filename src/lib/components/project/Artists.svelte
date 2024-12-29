<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faPlay } from '@fortawesome/free-solid-svg-icons';
	import { artistsStore } from '$lib/stores/artistsStore';

	interface Props {
		accessToken?: string | undefined | null;
	}

	let { accessToken = undefined }: Props = $props();

	let artists = $artistsStore;
	async function playArtist(artistUri: string) {
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
