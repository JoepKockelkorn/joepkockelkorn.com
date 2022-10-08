import { calculate, ifNoneMatch } from 'https://deno.land/x/oak@v10.6.0/etag.ts';

export async function etag({ request, response }: { request: Request; response: Response }): Promise<Response> {
  const { headers } = response;
  const contentType = headers.get('content-type') ?? '';
  const isResponseHtml = contentType.startsWith('text/html');
  const isResponseJson = contentType.startsWith('application/json');
  const methodIsGetOrHead = request.method === 'GET' || request.method === 'HEAD';

  const shouldComputeETag = methodIsGetOrHead && response.status === 200 && (isResponseHtml || isResponseJson);
  if (!shouldComputeETag) {
    return response;
  }

  const hasCacheControl = headers.has('cache-control');
  if (!hasCacheControl) {
    const oneHourInSeconds = 60 * 60;
    const cacheControl = `private, max-age=${oneHourInSeconds}, must-revalidate`;
    headers.set('cache-control', cacheControl);
  }

  const clonedResponse = response.clone();
  const text = await clonedResponse.text();

  const etagHash = await calculate(text, { weak: true });
  headers.set('ETag', etagHash);
  const isMatch = await testEtagMatch({ request, text });

  return isMatch ? new Response(null, { status: 304, headers }) : response;
}

function testEtagMatch({ request, text }: { request: Request; text: string }): Promise<boolean> {
  const ifNoneMatchValue = request.headers.get('if-none-match');
  if (ifNoneMatchValue === null) {
    return Promise.resolve(false);
  }

  return ifNoneMatch(ifNoneMatchValue, text);
}
