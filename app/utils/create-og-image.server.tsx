import { Resvg } from '@resvg/resvg-js';
import type { SatoriOptions } from 'satori';
import satori from 'satori';

async function getMuktaFont(baseUrl: string) {
  const res = await fetch(new URL(`${baseUrl}/fonts/mukta-regular.ttf`));
  return await res.arrayBuffer();
}

export async function createOGImage(title: string, origin: string) {
  const muktaFont = await getMuktaFont(origin);

  const options: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [{ name: 'Mukta', data: muktaFont, style: 'normal' }],
  };

  const svg = await satori(
    <div
      style={{
        width: options.width,
        height: options.height,
        padding: 100,
        background: 'linear-gradient(135deg, #892f0b 10%, #fb923c 100%)',
        color: 'white',
        fontFamily: 'Mukta',
        fontSize: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>{title}</div>
    </div>,
    options
  );

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}
