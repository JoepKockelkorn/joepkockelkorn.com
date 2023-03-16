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
