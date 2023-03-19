// source: https://github.com/donavon/remix-etag/pull/1

type SendEtagResponseArgs = {
  request: Request;
  response: Response;
  options?: EtagOptions;
};

/**
 * Handles all aspect of ETag/If-None-Match header generation.
 * If the `If-None-Match` header is present in the `Request` object, and it matches the calculated
 * hash value of the response body, it will return a `304 Not Modified` response.
 * Otherwise, an `ETag` header is added to the `Response` object.
 */
export const etag = async ({
  request,
  response,
  options,
}: SendEtagResponseArgs): Promise<Response> => {
  const { cacheControl, weak } = mergeDefaultOptions(options);

  const { headers } = response;
  const contentType = headers.get('content-type') ?? '';
  const isResponseHtml = contentType.startsWith('text/html');
  const isResponseJson = contentType.startsWith('application/json');

  const shouldComputeETag =
    (request.method === 'GET' || request.method === 'HEAD') &&
    response.status === 200 &&
    (isResponseHtml || isResponseJson);
  if (!shouldComputeETag) return response;

  const hasCacheControl = headers.has('Cache-Control');
  if (!hasCacheControl && cacheControl) {
    headers.set('Cache-Control', cacheControl);
  }

  // We clone the response so we can read the body, which is a one-time operation.
  const clonedResponse = response.clone();
  const body = await clonedResponse.text();

  const isMatch = await testMatch({ request, text: body, headers, weak });
  return isMatch ? new Response('', { status: 304, headers }) : response;
};

const entityTag = async (entity: string): Promise<string> => {
  if (entity.length === 0) {
    return '"0a4d55a8d778e5022fab701977c5d840bbc486d0"';
  }

  const target = new TextEncoder().encode(entity);
  const hashBuffer = await crypto.subtle.digest('SHA-1', target);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('');

  return `"${hashHex}"`;
};

/**
 * Create a simple ETag.
 */

const createEtag = async (
  entity: string,
  options?: { weak: boolean }
): Promise<string> => {
  if (entity == null) {
    throw new TypeError('argument entity is required');
  }

  // generate entity tag
  const tag = await entityTag(entity);

  return options?.weak ? `W/${tag}` : tag;
};

const stripLeadingWeak = (hash: string) => hash.replace(/^W\//, '');

const testWeak = (hash: string) => hash.startsWith('W/');

const computeMatch = (
  weak: boolean,
  ifNoneMatch: string | null,
  etagHash: string
): boolean => {
  if (ifNoneMatch === null) return false;

  if (weak) {
    return stripLeadingWeak(ifNoneMatch) === stripLeadingWeak(etagHash);
  }
  return (
    !testWeak(ifNoneMatch) && !testWeak(etagHash) && ifNoneMatch === etagHash
  );
};

type TestMatch = {
  request: Request;
  text: string;
  headers: Headers;
  weak: boolean;
};

/**
 * The raw `testMatch` function that could be used to compare the RemixContext.routeData and
 * return early without rendering the page if `true` is returned.
 */
const testMatch = async ({
  request,
  text,
  headers,
  weak,
}: TestMatch): Promise<boolean> => {
  const etagHash = await createEtag(text, { weak });
  headers.set('ETag', etagHash);

  const ifNoneMatch = request.headers.get('if-none-match');
  const isMatch = computeMatch(weak, ifNoneMatch, etagHash);
  return isMatch;
};

const mergeDefaultOptions = (
  options: EtagOptions = {}
): Required<EtagOptions> => {
  const {
    maxAge = 0,
    cacheControl = `private, no-cache, max-age=${maxAge}, must-revalidate`,
    weak = true,
  } = options;
  return {
    cacheControl,
    maxAge,
    weak,
  };
};

export type EtagOptions = {
  /**
   * Add a `Cache-Control` header to the `Response` object.
   * Defaults to "private, no-cache, max-age=0, must-revalidate".
   * If you don't want to send the `Cache-Control` header, set `cacheControl` to `null`.
   * See also `maxAge`.
   * Note that if a `Cache-Control` header is already set, it will NOT be overwritten.
   */
  cacheControl?: string | null;

  /**
   * Specifies the `max-age` used in the `Cache-Control` header.
   * Defaults to `0` (no caching). Will only be used if `cacheControl` is not `null`.
   */
  maxAge?: number;

  /**
   * Specifies if the generated ETag will include the weak validator mark (that is, the leading W/).
   * The actual entity tag is the same. Defaults to `true`.
   */
  weak?: boolean;
};
