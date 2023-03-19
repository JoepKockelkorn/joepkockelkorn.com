import { json, LoaderArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { fetchBlogPost } from '~/utils/github.server';

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, 'Slug is required');

  /** TODO:
   * 1. Fetch blog post from github (done)
   * 2. Convert markdown to html + frontmatter with https://github.com/micromark/micromark
   * 3. Build UI
   */

  const markdown = await fetchBlogPost(params.slug);

  return json({ slug: params.slug, markdown });
}

export default function Component() {
  const { slug, markdown } = useLoaderData<typeof loader>();
  return (
    <>
      <div>My blog post: {slug}</div>
      <code>
        <pre>{markdown}</pre>
      </code>
    </>
  );
}
