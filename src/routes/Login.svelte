<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

	import Footer from '$lib/components/project/Footer.svelte';
</script>

<div class="flex flex-col items-center h-screen p-4 text-gray-800">
	<div class="flex flex-col m-auto justify-center items-center">
		<h1 class="text-4xl font-bold text-gray-700 text-center mb-4">Simplayer Spotify</h1>
		<p class="text-center mb-12">
			The dumbest Spotify player web client ever that lets you play music from Spotify without any
			lag.
		</p>
		<button
			class="flex items-center bg-black text-white font-bold py-2 px-4 rounded hover:bg-black transition duration-300"
			onclick={() => (window.location.href = '/login')}
		>
			<FontAwesomeIcon icon={faSignInAlt} class="mr-2" style={'witdh: 16px;height:16px;'} />
			<span>Login</span>
		</button>

		<div class="mt-16">
			<p class="font-bold mb-4">Currently the app is in private beta, come back later!</p>
			<p>
				Welcome to Simplayer Spotify! This app allows you to log in with your Spotify account and
				view your favorite tracks, artists, and playlists.
			</p>
			<p>
				Click the login button above to get started and explore your personalized music library.
			</p>
			<p>Your account must have the Spotify Premium subscription.</p>
		</div>
	</div>

	<Footer />
</div>
