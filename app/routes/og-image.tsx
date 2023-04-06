import { LoaderArgs } from '@remix-run/node';
import { cacheHeader } from 'pretty-cache-header';
import { createOGImage } from '~/utils/create-og-image.server';

export async function loader({ request }: LoaderArgs) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')!.slice(0, 100)
      : 'My default title';

    const png = await createOGImage(title, origin);

    return new Response(png, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': cacheHeader({
          public: true,
          immutable: true,
          noTransform: true,
          maxAge: '1 year',
        }),
      },
    });
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
