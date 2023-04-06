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
        fontSize: 70,
        display: 'flex',
        flexFlow: 'column nowrap',
        gap: 50,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={`${origin}/android-chrome-192x192.png`}
        width={148}
        height={148}
        alt="Joep Kockelkorn"
      />
      <div
        style={{
          textAlign: 'center',
          lineHeight: 1,
        }}
      >
        {title}
      </div>
    </div>,
    options
  );

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}
