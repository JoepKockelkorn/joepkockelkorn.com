import { component$ } from '@builder.io/qwik';

export default component$(() => (
	<div class="flex flex-col items-start gap-4 mt-12">
		<h2 class="text-3xl">Whoops, page not found... 🔍</h2>
		<a href="/" class="underline underline-offset-4 hover:text-primary-400">
			Return to home
		</a>
	</div>
));
