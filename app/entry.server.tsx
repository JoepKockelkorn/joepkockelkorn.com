import type { EntryContext } from '@vercel/remix';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { etag } from 'remix-etag';

import { routes as otherRoutes } from './other-routes.server';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  for (const handler of otherRoutes) {
    const otherRouteResponse = await handler(request, remixContext);
    if (otherRouteResponse) return otherRouteResponse;
  }

  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set('Content-Type', 'text/html');

  const response = new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
  return etag({ request, response, options: { weak: true } });
}
