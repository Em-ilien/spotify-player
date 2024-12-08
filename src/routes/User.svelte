<script lang="ts">
	import Cookies from 'cookie-universal';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSignOut, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';

	interface Props {
		accessToken?: string;
	}

	let { accessToken = '' }: Props = $props();

	let avatarUrl = $state('');
	let userName = $state('');
	let userEmailAddress = $state('');
	let showUserMenu = $state(false);

	onMount(async () => {
		const response = await fetch('https://api.spotify.com/v1/me', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		const data = await response.json();
		avatarUrl = data.images[0]?.url || null;
		userName = data.display_name;
		userEmailAddress = data.email;
	});

	function logout() {
		const cookies = Cookies();
		cookies.remove('spotify_access_token', { path: '/' });
		cookies.remove('spotify_refresh_token', { path: '/' });
		window.location.href = '/';
	}

	function toggleLogoutButton() {
		showUserMenu = !showUserMenu;
	}

	function handleClickOutside(event: MouseEvent) {
		const userMenu = document.querySelector('.relative');
		if (userMenu && !userMenu.contains(event.target as Node)) {
			showUserMenu = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="flex items-center relative">
	<button onclick={toggleLogoutButton}>
		{#if avatarUrl}
			<img src={avatarUrl} alt="Spotify Avatar" class="w-9 h-9 rounded-full cursor-pointer" />
		{:else}
			<span
				class="rounded-full bg-gray-500 text-white font-bold py-2 px-4 w-9 h-9 flex items-center justify-center"
			>
				{userName.charAt(0).toUpperCase()}
			</span>
		{/if}
	</button>
	{#if showUserMenu}
		<div
			class="absolute top-full right-0 mt-3 py-4 px-2 bg-white border border-gray-300 rounded shadow-lg"
		>
			<div class="pb-3 px-4">
				<span class="block text-gray-700">{userName}</span>
				<span class="block text-gray-400 text-sm">{userEmailAddress}</span>
			</div>

			<button
				onclick={logout}
				class="flex items-center w-full hover:bg-gray-100 px-4 py-3 rounded-lg"
			>
				<FontAwesomeIcon icon={faSignOut} class="text-gray-700 text-sm" />
				<span class="ml-3 text-gray-700 text-sm">Logout</span>
			</button>
		</div>
	{/if}
</div>
