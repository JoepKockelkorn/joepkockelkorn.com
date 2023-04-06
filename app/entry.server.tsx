import type { EntryContext } from '@vercel/remix';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { etag } from 'remix-etag';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
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
