import type { RequestHandler } from '@builder.io/qwik-city';
import type { ImageOptions } from 'og-img';
import { ImageResponse, fetchFont, html } from 'og-img';
import { cacheHeader } from 'pretty-cache-header';

export const onGet: RequestHandler = async ({ url, send }) => {
	const { searchParams, origin } = url;
	const hasTitle = searchParams.has('title');
	const title = hasTitle ? searchParams.get('title')!.slice(0, 100) : 'My default title';

	const muktaFont = await fetchFont(`${origin}/fonts/mukta-regular.ttf`);

	const options: ImageOptions = {
		width: 1200,
		height: 630,
		fonts: [{ name: 'Mukta', data: muktaFont, style: 'normal' }],
		headers: {
			'Cache-Control': cacheHeader({
				public: true,
				immutable: true,
				noTransform: true,
				maxAge: '1 year',
			}),
		},
	};
	send(
		new ImageResponse(
			html` <div
				style="width: 100%; height: 100%; padding: 100px; background: linear-gradient(135deg, #892f0b 10%, #fb923c 100%); color: white; font-family: Mukta; font-size: 70px; display: flex; flex-flow: column nowrap; gap: 50px; align-items: center; justify-content: center;"
			>
				<img src="${origin}/android-chrome-192x192.png" width="148" height="148" alt="Joep Kockelkorn" />
				<div style="text-align: center; line-height: 1;">${title}</div>
			</div>`,
			options,
		),
	);
};
