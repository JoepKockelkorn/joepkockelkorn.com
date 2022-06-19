import type { LinksFunction, MetaFunction } from '@remix-run/deno';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import * as React from 'react';

import styles from './styles.css';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Joep Kockelkorn | Full Stack Dev',
  viewport: 'width=device-width,initial-scale=1',
});

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Mulish:100|Reem+Kufi&display=swap' },
  { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.4.1/css/all.css' },
];

export default function App() {
  return (
    <html lang='en' className='h-full flex flex-col'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='h-full'>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
