import {
  HeadersFunction,
  json,
  LoaderArgs,
  V2_MetaFunction,
} from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { convertMarkdownToHtml, fetchBlogPost } from '~/utils/github.server';
import highlightStyles from 'highlight.js/styles/night-owl.css';
import { getParentMeta } from '~/utils/meta';
import { cacheHeader } from 'pretty-cache-header';

export const handle = { hydrate: true };

export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': cacheHeader({
      public: true,
      maxAge: '5 minutes',
      sMaxage: '30 minutes',
    }),
  };
};

export const meta: V2_MetaFunction<typeof loader> = ({
  data: {
    meta: { title, description, draft },
  },
  matches,
}) => {
  const { parentMetaTitle, parentMetaOther } = getParentMeta(matches);

  return [
    ...parentMetaOther,
    ...(draft ? [{ name: 'robots', content: 'noindex' }] : []),
    { title: `${parentMetaTitle} | ${title}` },
    { property: 'og:title', content: title },
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

  return json({
    html,
    meta: blogPost.meta,
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