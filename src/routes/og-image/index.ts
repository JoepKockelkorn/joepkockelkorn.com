import type { RequestHandler } from '@builder.io/qwik-city';
import { cacheHeader } from 'pretty-cache-header';
import { createOGImage } from '~/utils/create-og-image.server';

export const onGet: RequestHandler = async ({ send, url, headers, query }) => {
	try {
		const { origin } = url;
		const hasTitle = query.has('title');
		const title = hasTitle ? query.get('title')!.slice(0, 100) : 'My default title';

		const cacheControl = cacheHeader({ public: true, immutable: true, noTransform: true, maxAge: '1 year' });
		headers.set('Cache-Control', cacheControl);

		const png = await createOGImage(title, origin);
		headers.set('Content-Type', 'image/png');
		send(200, png);
	} catch (e: any) {
		console.log(`${e.message}`);
		send(500, `Failed to generate the image`);
	}
};
