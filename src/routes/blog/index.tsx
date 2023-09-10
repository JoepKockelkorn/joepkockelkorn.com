import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import { omit, sortBy } from 'remeda';
import { fetchBlogPosts } from '~/utils/github.server';

export const head: DocumentHead = {
	title: 'Blog',
};

export const usePosts = routeLoader$(async ({ query }) => {
	const ref = query.get('ref') ?? undefined;
	const posts = (await fetchBlogPosts(ref)).map((post) => omit(post, ['bodyMarkdown']));
	const sortedPosts = sortBy(posts, (post) => new Date(post.meta.date.raw).getTime());
	const newestPostsFirst = [...sortedPosts].reverse();

	return newestPostsFirst;
});

export default component$(() => {
	const posts = usePosts();
	return (
		<>
			<h1 class="leading-tight font-bold text-4xl mt-8 mb-12 text-gradient">My blog posts</h1>
			<div class="space-y-12">
				{posts.value.map((post) => (
					<article key={post.slug}>
						<a
							href={`/blog/${post.slug}`}
							class="block group space-y-4 outline-0 focus-visible:shadow-[0px_0px_0px_2px_rgb(var(--color-primary-400))]"
						>
							<h2 class="font-bold text-2xl group-hover:text-primary-400 motion-safe:transition-colors">{post.meta.title}</h2>
							<p>{post.meta.description}</p>
							<div class='font-bold after:content-["_→"] after:opacity-0 group-hover:after:opacity-100 motion-safe:after:transition-opacity'>
								Read more
							</div>
						</a>
					</article>
				))}
			</div>
		</>
	);
});
