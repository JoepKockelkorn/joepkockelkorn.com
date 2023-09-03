import { initWasm, Resvg } from '@resvg/resvg-wasm';
import type { SatoriOptions } from 'satori';
import satori from 'satori';

let initialized = false;

export async function createOGImage(title: string, origin: string) {
	if (!initialized) {
		await initWasm('https://unpkg.com/@resvg/resvg-wasm@2.4.1/index_bg.wasm');
		initialized = true;
	}
	const muktaFont = await getMuktaFont(origin);
	const options: SatoriOptions = {
		width: 1200,
		height: 630,
		fonts: [{ name: 'Mukta', data: muktaFont, style: 'normal' }],
	};

	const svg = await satori(
		// Can't use JSX, fails to render text somehow
		{
			type: 'div',
			props: {
				children: [
					{
						type: 'img',
						props: {
							src: `${origin}/android-chrome-192x192.png`,
							width: 148,
							height: 148,
							alt: 'Joep Kockelkorn',
						},
					},
					{
						type: 'div',
						props: {
							style: {
								textAlign: 'center',
								lineHeight: 1,
							},
							children: title,
						},
					},
				],
				style: {
					width: options.width,
					height: options.height,
					padding: 100,
					background: 'linear-gradient(135deg, #892f0b 10%, #fb923c 100%)',
					color: 'white',
					fontFamily: 'Mukta',
					fontSize: 70,
					display: 'flex',
					flexFlow: 'column nowrap',
					gap: 50,
					alignItems: 'center',
					justifyContent: 'center',
				},
			},
		},
		options,
	);

	const resvg = new Resvg(svg);
	const pngData = resvg.render();
	return pngData.asPng();
}

async function getMuktaFont(baseUrl: string) {
	const res = await fetch(new URL(`${baseUrl}/fonts/mukta-regular.ttf`));
	return await res.arrayBuffer();
}
