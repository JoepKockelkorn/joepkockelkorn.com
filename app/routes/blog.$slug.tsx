import { json, LoaderArgs, V2_MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { fetchBlogPost } from '~/utils/github.server';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import { useHydrated } from 'remix-utils';
import { useEffect } from 'react';
import highlightStyles from 'highlight.js/styles/night-owl.css';
import { getParentMeta } from '~/utils/meta';

export const handle = { hydrate: true };

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

export async function loader({ params }: LoaderArgs) {
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
   * - Style blog page
   * - Add blog overview route
   * - SEO stuff
   * - Add dark mode switcher?
   * - RSS?
   * - Move to Vercel for stale-while-revalidate?
   */

  const blogPost = await fetchBlogPost(params.slug);
  if (blogPost === null) throw new Response('Not found', { status: 404 });

  return json({
    ...blogPost,
    meta: {
      ...blogPost.meta,
      date: {
        formatted: Intl.DateTimeFormat('en-US', {
          dateStyle: 'long',
          timeZone: 'UTC',
        }).format(blogPost.meta.date),
        raw: blogPost.meta.date.toISOString(),
      },
    },
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
  const hydrated = useHydrated();

  useEffect(() => {
    if (hydrated) {
      hljs.getLanguage('typescript') ||
        hljs.registerLanguage('typescript', typescript);
      hljs.highlightAll();
    }
  }, [hydrated]);

  return (
    <>
      <time dateTime={raw} className="mt-4">
        {formatted}
      </time>
      <h1 className="leading-none font-bold from-primary-700 to-primary-400 dark:to-primary-200 to-pr bg-gradient-to-r bg-clip-text text-6xl mt-2 mb-8 text-fill-transparent">
        {title}
      </h1>
      <article
        className="prose dark:prose-invert pb-[100px] prose-pre:bg-[#011627] max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
