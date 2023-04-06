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

  /** TODO:
   * - Fetch blog post from github (done)
   * - Convert markdown to html (done)
   * - Build UI
   *   - Navigation (done)
   *   - Error handling: 404, unexpected (done)
   *   - Syntax highlighting (done)
   * - Add postcss (done)
   * - Add dark mode (done)
   * - Add metadata (done)
   * - Style blog page (done)
   * - Move highlight.js to server (done)
   * - Cache blog posts pages (done)
   * - Add blog overview route (done)
   * - SEO stuff (sitemap, robots.txt, Google Search Console)
   * - Check twitter preview
   *
   * - Move below items to github issues:
   * - Add dark mode switcher?
   * - RSS?
   * - Move to Vercel for stale-while-revalidate?
   */

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
