<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children, data } = $props();
	let { session } = data;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Authentication App</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-gray-50">
	<Navbar {session} />
	<main class="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
		{@render children?.()}
	</main>
	<footer class="bg-white border-t border-gray-200 py-6">
		<div class="container mx-auto px-4 sm:px-6 lg:px-8">
			<p class="text-center text-sm text-gray-500">
				© {new Date().getFullYear()} Authentication App. All rights reserved.
			</p>
		</div>
	</footer>
</div>
