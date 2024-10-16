<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="flex flex-col justify-center items-center h-screen">
	<button
		class="bg-black text-white font-bold py-2 px-4 rounded hover:bg-black transition duration-300"
		on:click={() => (window.location.href = '/login')}
	>
		<FontAwesomeIcon icon={faSignInAlt} class="mr-2" /> <span>Login</span>
	</button>

	<div class="mt-8">
		<p class="color-gray-500">
			Welcome to Spotify Player! This app allows you to log in with your Spotify account and view
			your favorite tracks, artists, and playlists.
		</p>
		<p class="color-gray-500">
			Click the login button above to get started and explore your personalized music library.
		</p>
		<p class="color-gray-500">You must have the Spotify app open on your device.</p>
	</div>
</div>
