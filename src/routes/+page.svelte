<script lang="ts">
	import { setAuthentified } from '$lib/authentification.svelte';
	import type { PageData } from './$types';
	import App from './App.svelte';
	import Login from './Login.svelte';

	let { data }: { data: PageData } = $props();
	let accessToken = data.accessToken;

	setAuthentified(accessToken !== null && accessToken !== undefined);
</script>

<svelte:head>
	<title>Simplayer Spotify</title>
</svelte:head>

{#if accessToken == null}
	<Login />
{:else}
	<App {accessToken} />
{/if}
