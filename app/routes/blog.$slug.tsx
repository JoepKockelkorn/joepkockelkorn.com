import { json, LoaderArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { fetchBlogPost } from '~/utils/github.server';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import { useHydrated } from 'remix-utils';
import { useEffect } from 'react';
import highlightStyles from 'highlight.js/styles/night-owl.css';

export const handle = { hydrate: true };

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
   * - Add dark mode
   * - Add metadata
   * - Style blog page
   * - Add blog overview route
   * - SEO stuff
   * - RSS?
   * - Move to Vercel for stale-while-revalidate?
   */

  const html = (await fetchBlogPost(params.slug)) ?? 'Whoops!';

  return json({ slug: params.slug, html });
}

export default function Component() {
  const { slug, html } = useLoaderData<typeof loader>();
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
      <h1 className="font-bold from-orange-700 to-orange-400 bg-gradient-to-r bg-clip-text text-6xl my-8 text-fill-transparent">
        {slug}
      </h1>
      <article
        className="prose pb-[100px] prose-pre:bg-[#011627] max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
