<script lang="ts">
	import Player from '$lib/components/project/Player.svelte';
	import SearchBar from '$lib/components/project/SearchBar.svelte';

	import Audiotheque from '$lib/components/project/Audiotheque.svelte';
	import Footer from '$lib/components/project/Footer.svelte';

	let { accessToken }: { accessToken: string } = $props();
</script>

<div class="flex flex-col h-screen overflow-hidden">
	<div class="flex flex-col h-full overflow-y-scroll">
		<SearchBar {accessToken} />

		<div class="z-2 h-full flex flex-col">
			<Audiotheque {accessToken}>
				{#snippet footer()}
					<Footer />
				{/snippet}
			</Audiotheque>
		</div>
	</div>
	<div class="w-full border-t border-slate-500 bg-white p-4 flex justify-between">
		<Player {accessToken} />
	</div>
</div>
