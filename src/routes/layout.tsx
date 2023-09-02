import { component$, Slot } from '@builder.io/qwik';
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city';
import { Header } from '~/components/header/header';

export const head: DocumentHead = ({ head }) => ({
	title: `Joep Kockelkorn | ${head.title}`,
	// TODO: spread other meta tags?
});

export const onGet: RequestHandler = async ({ cacheControl }) => {
	// https://qwik.builder.io/docs/caching/
	cacheControl({
		// Always serve a cached response by default, up to a week stale
		staleWhileRevalidate: 60 * 60 * 24 * 7,
		// Max once every 5 seconds, revalidate on the server to get a fresh version of this page
		maxAge: 5,
	});
};

export default component$(() => {
	return (
		<>
			<Header class="h-[3.75rem] fixed z-10 flex-shrink-0" />
			<main class="isolate flex-grow flex-shrink z-0 mt-[3.75rem]">
				<div class="h-full px-4 md:px-6 xl:px-8 max-w-3xl mx-auto flex flex-col">
					<Slot />
				</div>
			</main>
		</>
	);
});
