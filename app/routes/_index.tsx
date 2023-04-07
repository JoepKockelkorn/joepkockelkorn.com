import { HeadersFunction, V2_MetaFunction } from '@vercel/remix';
import { getParentMeta } from '~/utils/meta';
import { cacheHeader } from 'pretty-cache-header';

export const headers: HeadersFunction = () => {
  return {
    'Cache-Control': cacheHeader({
      public: true,
      sMaxage: '1 minute',
      staleWhileRevalidate: '1 year',
    }),
  };
};

export const meta: V2_MetaFunction = ({ matches }) => {
  const { parentMetaTitle, parentMetaOther } = getParentMeta(matches);

  return [
    ...parentMetaOther,
    { title: `${parentMetaTitle} | Home` },
    {
      name: 'description',
      content:
        'Homepage of Joep Kockelkorn, full-stack Developer && front-end fanatic.',
    },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col flex-grow self-center justify-center text-center">
      <div className="font-semibold text-5xl">
        Hello, I'm Joep Kockelkorn!{' '}
        <span className="inline-block animate-wiggle">👋</span>
      </div>
      <div className="font-mono text-3xl mt-4 mx-0">
        Full Stack Dev && Front-end fanatic
      </div>
      <div className="mt-8 flex flex-row justify-center flex-wrap gap-2">
        <a
          className="flex items-center justify-center h-16 w-16 hover:text-primary-400 focus-visible:text-primary-400 group"
          target="_blank"
          href="https://twitter.com/joepkockelkorn"
          rel="noreferrer"
        >
          <i className="transform motion-safe:transition-all group-hover:scale-125 text-5xl p-2 fab fa-twitter"></i>
        </a>
        <a
          className="flex items-center justify-center h-16 w-16 hover:text-primary-400 focus-visible:text-primary-400 group"
          target="_blank"
          href="https://www.linkedin.com/in/joepkockelkorn"
          rel="noreferrer"
        >
          <i className="transform motion-safe:transition-all group-hover:scale-125 text-5xl p-2 fab fa-linkedin"></i>
        </a>
        <a
          className="flex items-center justify-center h-16 w-16 hover:text-primary-400 focus-visible:text-primary-400 group"
          target="_blank"
          href="https://github.com/joepkockelkorn"
          rel="noreferrer"
        >
          <i className="transform motion-safe:transition-all group-hover:scale-125 text-5xl p-2 fab fa-github"></i>
        </a>
        <a
          className="flex items-center justify-center h-16 w-16 hover:text-primary-400 focus-visible:text-primary-400 group"
          target="_blank"
          href="https://stackoverflow.com/users/5475829/joep-kockelkorn"
          rel="noreferrer"
        >
          <i className="transform motion-safe:transition-all group-hover:scale-125 text-5xl p-2 fab fa-stack-overflow"></i>
        </a>
      </div>
    </div>
  );
}
