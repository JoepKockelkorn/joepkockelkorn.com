import type { LinksFunction, MetaFunction } from '@remix-run/cloudflare';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { useShouldHydrate } from 'remix-utils';

import fonts from './fonts.css';
import styles from './styles.css';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Joep Kockelkorn | Full Stack Dev',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: fonts },
  {
    rel: 'stylesheet',
    href: 'https://use.fontawesome.com/releases/v5.4.1/css/all.css',
  },
];

export default function App() {
  const shouldHydrate = useShouldHydrate();
  return (
    <html lang="en" className="h-full flex flex-col">
      <head>
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
      <body className="h-full">
        {/* <Header /> */}
        <Outlet />
        <ScrollRestoration />
        {shouldHydrate && <Scripts />}
        <LiveReload />
      </body>
    </html>
  );
}
