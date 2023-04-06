import { HeadersFunction, LoaderArgs, json } from '@vercel/remix';
import { Link, useLoaderData } from '@remix-run/react';
import { cacheHeader } from 'pretty-cache-header';
import { omit, sortBy } from 'remeda';
import { fetchBlogPosts } from '~/utils/github.server';

export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': cacheHeader({
      public: true,
      sMaxage: '1 minute',
      staleWhileRevalidate: '1 year',
    }),
  };
};

export async function loader({}: LoaderArgs) {
  const posts = (await fetchBlogPosts()).map((post) =>
    omit(post, ['bodyMarkdown'])
  );
  const sortedPosts = sortBy(posts, (post) =>
    new Date(post.meta.date.raw).getTime()
  );

  return json({ posts: sortedPosts });
}

export default function Component() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="leading-tight font-bold text-4xl mt-8 mb-12 text-gradient">
        My blog posts
      </h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link
              to={`/blog/${post.slug}`}
              className="block group space-y-4 outline-0 focus-visible:shadow-[0px_0px_0px_2px_rgb(var(--color-primary-400))]"
            >
              <h2 className="font-bold text-2xl group-hover:text-primary-400 motion-safe:transition-colors">
                {post.meta.title}
              </h2>
              <p>{post.meta.description}</p>
              <div className='font-bold after:content-["_→"] after:opacity-0 group-hover:after:opacity-100 motion-safe:after:transition-opacity'>
                Read more
              </div>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
