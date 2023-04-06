import type {
  LinksFunction,
  MetaFunction,
  V2_MetaFunction,
} from '@remix-run/cloudflare';
import {
  isRouteErrorResponse,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';
import { PropsWithChildren } from 'react';
import { useShouldHydrate } from 'remix-utils';
import { Header } from './components/Header';

import fonts from './fonts.css';
import styles from './styles.css';

export const meta: V2_MetaFunction = () => [{ title: 'Joep Kockelkorn' }];

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: fonts },
  {
    rel: 'stylesheet',
    href: 'https://use.fontawesome.com/releases/v5.4.1/css/all.css',
  },
];

type WebsiteProps = PropsWithChildren & {
  shouldHydrate?: boolean;
};
export function Website({ children, shouldHydrate = false }: WebsiteProps) {
  return (
    <html lang="en" className="h-full flex flex-col hyphens">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body className="h-full py-0 bg-background text-text">
        <div className="h-full flex flex-col">
          <Header />
          <main className="overflow-auto isolate flex-grow flex-shrink">
            <div className="h-full px-4 md:px-6 xl:px-8 max-w-3xl mx-auto flex flex-col">
              {children}
            </div>
          </main>
        </div>
        <ScrollRestoration />
        {shouldHydrate && <Scripts />}
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  const shouldHydrate = useShouldHydrate();
  return (
    <Website shouldHydrate={shouldHydrate}>
      <Outlet />
    </Website>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  const isNotFound =
    isRouteErrorResponse(error) &&
    error.status === 404 &&
    error.data === 'Not found';

  return (
    <Website shouldHydrate={true}>
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-3xl">
          Whoops,{' '}
          {isNotFound ? 'page not found... 🔍' : 'something went wrong... 🧨'}
        </h1>
        <Link to="/" className="inline-block link">
          Return to home
        </Link>
      </div>
    </Website>
  );
}
