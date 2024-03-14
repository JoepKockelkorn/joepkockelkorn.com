import { component$ } from '@builder.io/qwik';
import type { DocumentHead, StaticGenerateHandler } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import invariant from 'tiny-invariant';

import 'highlight.js/styles/night-owl.css';
import { isNil } from 'remeda';
import { convertMarkdownToHtml, fetchBlogPost, fetchBlogPosts } from '~/utils/github.server';

export const onStaticGenerate: StaticGenerateHandler = async () => {
	const blogPosts = await fetchBlogPosts();
	const publishedPosts = blogPosts.filter((post) => !post.meta.draft);

	return {
		params: publishedPosts.map(({ slug }) => ({ slug })),
	};
};

export const head: DocumentHead = ({ resolveValue }) => {
	const data = resolveValue(usePost);
	if (isNil(data)) return {};

	const host = 'https://joepkockelkorn.com';
	const {
		meta: { title, description, draft },
		slug,
	} = data;

	const ogImageUrl = new URL('/og-image', host);
	ogImageUrl.searchParams.set('title', title);
	const ogUrl = new URL(`/blog/${slug}`, host);

	return {
		title,
		meta: [
			...(draft ? [{ name: 'robots', content: 'noindex' }] : []),
			{ name: 'description', content: description },
			{ name: 'og:url', content: ogUrl.toString() },
			{ name: 'og:title', content: title },
			{ name: 'og:description', content: description },
			{ name: 'og:image', content: ogImageUrl.toString() },
			{ name: 'twitter:title', content: title },
			{ name: 'twitter:description', content: description },
			{ name: 'twitter:image', content: ogImageUrl.toString() },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'twitter:creator', content: '@JoepKockelkorn' },
		],
	};
};

export const usePost = routeLoader$(async ({ query, params, url }) => {
	invariant(params.slug, 'Slug is required');
	const ref = query.get('ref') ?? undefined;

	const blogPost = await fetchBlogPost(params.slug, ref);
	if (blogPost === null) throw new Response('Not found', { status: 404 });
	const html = await convertMarkdownToHtml(url, blogPost.bodyMarkdown);

	return { html, meta: blogPost.meta, slug: params.slug, readingTime: blogPost.readingTime };
});

export default component$(() => {
	const { html, meta, readingTime } = usePost().value;
	const { date, title } = meta;
	const { formatted, raw } = date;

	return (
		<>
			<div class="flex flex-wrap mt-4 gap-1">
				<time dateTime={raw}>{formatted}</time>-<p>{readingTime}</p>
			</div>
			<h2 class="leading-tight font-bold text-gradient text-6xl mt-2 mb-12">{title}</h2>
			<article
				class="prose prose-li:my-[0.25em] prose-lg dark:prose-invert pb-[100px] prose-pre:bg-[#011627] prose-code:before:content-none prose-code:after:content-none prose-code:[&_:not(pre)]:bg-code prose-code:text-white prose-code:rounded-[4px] prose-code:[&_:not(pre)]:px-1.5 prose-code:[&_:not(pre)]:py-1 prose-code:[&_a]:underline prose-h1:leading-[1.4] prose-code:hyphens-none max-w-none"
				dangerouslySetInnerHTML={html}
			/>
		</>
	);
});
