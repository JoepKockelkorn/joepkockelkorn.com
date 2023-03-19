import { json, LoaderArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

export function loader({ params }: LoaderArgs) {
  invariant(params.slug, 'Slug is required');

  /** TODO:
   * 1. Fetch blog post from github using octokit rest (see Kent C. Dodds' blog example: https://github.com/kentcdodds/kentcdodds.com/blob/main/app/utils/github.server.ts)
   * 2. Convert markdown to html + frontmatter with https://github.com/micromark/micromark
   * 3. Build UI
   */

  return json({ slug: params.slug });
}

export default function Component() {
  const { slug } = useLoaderData<typeof loader>();
  return <div>My blog post: {slug}</div>;
}
