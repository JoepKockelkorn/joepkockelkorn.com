import { component$, Slot } from '@builder.io/qwik';
import type { DocumentHead, RequestHandler } from '@builder.io/qwik-city';
import { cacheHeader } from 'pretty-cache-header';
import { Header } from '~/components/header/header';

export const head: DocumentHead = ({ head }) => ({
	title: `Joep Kockelkorn | ${head.title}`,
});

export const onGet: RequestHandler = async ({ headers }) => {
	headers.set(
		'Cache-Control',
		cacheHeader({
			public: true,
			maxAge: '5 seconds',
			sMaxage: '1 minute',
			staleWhileRevalidate: '1 year',
		}),
	);
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
