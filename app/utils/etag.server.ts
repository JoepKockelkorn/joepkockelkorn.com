import { calculate } from 'https://deno.land/x/oak@v10.6.0/etag.ts';

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

  const etag = await calculate(text, { weak: true });
  headers.set('ETag', etag);
  const isMatch = testEtagMatch({ request, newEtag: etag });

  return isMatch ? new Response(null, { status: 304, headers }) : response;
}

function testEtagMatch({ request, newEtag }: { request: Request; newEtag: string }): boolean {
  const oldEtag = request.headers.get('if-none-match');
  if (oldEtag === null) {
    return false;
  }

  return oldEtag === newEtag;
}
