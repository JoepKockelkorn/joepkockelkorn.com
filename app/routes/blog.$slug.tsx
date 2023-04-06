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
import type { HydrateHandle } from '~/utils/hydrate.server';
import { getDomainUrl } from '~/utils/domain.server';

export const handle: SitemapHandle & HydrateHandle = {
  hydrate: true,
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
  } = data;
  const { parentMetaTitle, parentMetaOther } = getParentMeta(matches);

  const ogImageUrl = new URL(`${host}/og-image`);
  ogImageUrl.searchParams.set('title', title);

  return [
    ...parentMetaOther,
    ...(draft ? [{ name: 'robots', content: 'noindex' }] : []),
    { title: `${parentMetaTitle} | ${title}` },
    { property: 'og:title', content: title },
    { property: 'og:image', content: ogImageUrl.toString() },
    { name: 'description', content: description },
  ];
};

export const links = () => [{ rel: 'stylesheet', href: highlightStyles }];

export async function loader({ params, request }: LoaderArgs) {
  invariant(params.slug, 'Slug is required');

  const blogPost = await fetchBlogPost(params.slug);
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
        className="prose prose-li:my-[0.25em] prose-lg dark:prose-invert pb-[100px] prose-pre:bg-[#011627] max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
