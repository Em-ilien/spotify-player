<script lang="ts">
	let {
		button,
		menu,
		onMenuOpened,
		position
	}: {
		button: () => any;
		menu: () => any;
		onMenuOpened?: () => any;
		position: { x: 'left' | 'right' | 'center'; y: 'top' | 'bottom' };
	} = $props();

	const positionX =
		position.x === 'left'
			? 'right-0'
			: position.x === 'right'
				? 'left-0'
				: 'w-max translate-x-1/2 right-1/2 transform';
	const positionY = position.y === 'bottom' ? 'top-full ' : ' bottom-full';

	let menuElement: HTMLElement;
	let showMenu = $state(false);

	function toggleMenu(event: KeyboardEvent | MouseEvent) {
		if (event instanceof KeyboardEvent && !['Enter', ' '].includes(event.key)) return;

		showMenu = !showMenu;
		event.preventDefault();
		event.stopPropagation();

		if (showMenu && onMenuOpened) onMenuOpened();
	}

	function handleClose(event: MouseEvent | KeyboardEvent) {
		if (!showMenu) return;

		if (event instanceof KeyboardEvent && event.key !== 'Escape') return;

		if (
			event instanceof MouseEvent &&
			event.target instanceof HTMLElement &&
			menuElement.contains(event.target)
		)
			return;

		showMenu = false;
	}

	function stopPropagation(event: MouseEvent) {
		event.stopPropagation();
	}
</script>

<svelte:body onclick={handleClose} onkeydown={handleClose} />

<div class="flex items-center relative" bind:this={menuElement}>
	<div onclick={stopPropagation} role="none">
		<button tabindex="0" onclick={toggleMenu} onkeydown={toggleMenu}>
			{@render button()}
		</button>
	</div>
	{#if showMenu}
		<div
			class="{positionX} {positionY} absolute mt-3 py-4 px-2 bg-white border border-gray-300 rounded shadow-lg"
		>
			{@render menu()}
		</div>
	{/if}
</div>
