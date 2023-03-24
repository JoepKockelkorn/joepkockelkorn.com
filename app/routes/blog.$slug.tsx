import { json, LoaderArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { fetchBlogPost } from '~/utils/github.server';

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, 'Slug is required');

  /** TODO:
   * 1. Fetch blog post from github (done)
   * 2. Convert markdown to html (done)
   * 3. Build UI
   *   1. Navigation? Do I have that already? (done)
   *   1. Error handling: 404, unexpected (done)
   *   1. Syntax highlighting (https://github.com/unjs/shiki-es)
   *   1. Caching
   * 4. Add blog overview route
   */

  const html = (await fetchBlogPost(params.slug)) ?? 'Whoops!';

  return json({ slug: params.slug, html });
}

export default function Component() {
  const { slug, html } = useLoaderData<typeof loader>();
  return (
    <>
      <div>My blog post: {slug}</div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
