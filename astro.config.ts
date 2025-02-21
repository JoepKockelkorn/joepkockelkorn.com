import { defineConfig } from 'astro/config';
import vercelStatic from '@astrojs/vercel';

export default defineConfig({
	output: 'static',
	adapter: vercelStatic({}),
	site: 'https://joepkockelkorn.com',
});
