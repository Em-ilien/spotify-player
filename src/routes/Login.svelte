<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
</script>

<div class="flex justify-center items-center h-screen">
	<button
		class="bg-black text-white font-bold py-2 px-4 rounded hover:bg-black transition duration-300"
		on:click={() => (window.location.href = '/login')}
	>
		<FontAwesomeIcon icon={faSignInAlt} />
	</button>
</div>
