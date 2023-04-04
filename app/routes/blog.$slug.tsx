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
   * 1. Fetch blog post from github (done)
   * 2. Convert markdown to html (done)
   * 3. Build UI
   *   - Navigation (done)
   *   - Error handling: 404, unexpected (done)
   *   - Syntax highlighting (done)
   * 4. Style blog page
   * 5. Add blog overview route
   * 6. Caching?
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
      <div>My blog post: {slug}</div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
