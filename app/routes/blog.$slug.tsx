import {
  HeadersFunction,
  json,
  LoaderArgs,
  V2_MetaFunction,
} from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  convertMarkdownToHtml,
  fetchBlogPost,
  fetchBlogPosts,
} from '~/utils/github.server';
import highlightStyles from 'highlight.js/styles/night-owl.css';
import { getParentMeta } from '~/utils/meta';
import { cacheHeader } from 'pretty-cache-header';
import { isNil } from 'remeda';
import type { SitemapHandle } from '~/utils/sitemap.server';
import { getDomainUrl } from '~/utils/domain.server';

export const handle: SitemapHandle = {
  getSitemapEntries: async () => {
    const blogPosts = await fetchBlogPosts();
    return blogPosts
      .filter((post) => !post.meta.draft)
      .map(({ slug }) => ({
        route: `/blog/${slug}`,
        priority: 0.6,
      }));
  },
};

export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': cacheHeader({
      public: true,
      sMaxage: '1 minute',
      staleWhileRevalidate: '1 year',
    }),
  };
};

export const meta: V2_MetaFunction<typeof loader> = ({ data, matches }) => {
  if (isNil(data)) return [];
  const {
    meta: { title, description, draft },
    host,
    slug,
  } = data;
  const { parentMetaTitle, parentMetaOther } = getParentMeta(matches);

  const ogImageUrl = new URL(`${host}/og-image`);
  ogImageUrl.searchParams.set('title', title);
  const ogUrl = new URL(`${host}/blog/${slug}`);

  return [
    ...parentMetaOther,
    ...(draft ? [{ name: 'robots', content: 'noindex' }] : []),
    { title: `${parentMetaTitle} | ${title}` },
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
  ];
};

export const links = () => [{ rel: 'stylesheet', href: highlightStyles }];

export async function loader({ params, request }: LoaderArgs) {
  invariant(params.slug, 'Slug is required');
  const ref = new URL(request.url).searchParams.get('ref') ?? undefined;

  const blogPost = await fetchBlogPost(params.slug, ref);
  if (blogPost === null) throw new Response('Not found', { status: 404 });
  const html = convertMarkdownToHtml(
    new URL(request.url),
    blogPost.bodyMarkdown
  );

  const host = getDomainUrl(request);

  return json({
    html,
    meta: blogPost.meta,
    host,
    slug: params.slug,
  });
}

export default function Component() {
  const {
    html,
    meta: {
      date: { formatted, raw },
      title,
    },
  } = useLoaderData<typeof loader>();

  return (
    <>
      <time dateTime={raw} className="mt-4">
        {formatted}
      </time>
      <h1 className="leading-tight font-bold text-gradient text-6xl mt-2 mb-12">
        {title}
      </h1>
      <article
        className="prose prose-li:my-[0.25em] prose-lg dark:prose-invert pb-[100px] prose-pre:bg-[#011627] prose-h1:leading-[1.4] max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
