<script lang="ts">
	import Albums from '$lib/components/project/Albums.svelte';
	import Artists from '$lib/components/project/Artists.svelte';
	import Playlists from '$lib/components/project/Playlists.svelte';
	import Tracks from '$lib/components/project/Tracks.svelte';

	let { accessToken, footer }: { accessToken: string; footer: () => any } = $props();

	const tabs = $state([
		{ active: true, name: 'Playlists', component: Playlists },
		{ active: false, name: 'Albums', component: Albums },
		{ active: false, name: 'Artists', component: Artists },
		{ active: false, name: 'Tracks', component: Tracks }
	]);

	function onkeydown(event: KeyboardEvent) {
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
		event.preventDefault();
		const activeIndex = tabs.findIndex((tab) => tab.active);

		if (event.key === 'ArrowLeft') {
			if (activeIndex > 0) {
				tabs[activeIndex].active = false;
				tabs[activeIndex - 1].active = true;
			}
		} else {
			if (activeIndex < tabs.length - 1) {
				tabs[activeIndex].active = false;
				tabs[activeIndex + 1].active = true;
			}
		}
	}
</script>

<svelte:body {onkeydown} />

<div class="pt-2 pb-3 flex mx-2">
	{#each tabs as tab}
		<button
			class="px-4 cursor-pointer bg-transparent text-sm group"
			onclick={() => {
				tabs.forEach((t) => (t.active = false));
				tab.active = true;
			}}
		>
			<div
				class=" py-2 border-b-2 border-transparent
            {tab.active
					? 'border-b-gray-400 text-black'
					: 'group-hover:text-gray-700 group-hover:border-b-gray-200 group-hover:border-b-2 text-gray-500'}
            "
			>
				<span>{tab.name}</span>
			</div>
		</button>
	{/each}
</div>

<div class="h-full flex flex-col justify-between">
	{#each tabs as tab}
		{#if tab.active}
			<tab.component />
		{/if}
	{/each}

	<div class="mt-auto pt-8">
		{@render footer()}
	</div>
</div>
