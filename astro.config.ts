import partytown from '@astrojs/partytown';
import vercelStatic from '@astrojs/vercel';
import { transformerNotationDiff } from '@shikijs/transformers';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks, { type Options as ExternalLinksOptions } from 'rehype-external-links';
import rehypeAutolinkHeadings, { type Options as AutolinkHeadingsOptions } from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeImageNativeLazyLoading from 'rehype-plugin-image-native-lazy-loading';
import { remarkReadingTime } from './src/utils/remark-reading-time';

const logPartytown = import.meta.env.DEV;

export default defineConfig({
	output: 'static',
	adapter: vercelStatic({}),
	site: 'https://joepkockelkorn.com',
	markdown: {
		remarkPlugins: [remarkReadingTime],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypeAutolinkHeadings,
				{
					behavior: 'wrap',
					headingProperties: { class: 'header-link' },
				} satisfies AutolinkHeadingsOptions,
			],
			[
				rehypeExternalLinks,
				{
					rel: ['noreferrer', 'noopener', 'nofollow'],
					target: '_blank',
				} satisfies ExternalLinksOptions,
			],
			rehypeImageNativeLazyLoading as any, // any needed due to type mismatch, works fine
		],
		shikiConfig: {
			theme: 'night-owl',
			wrap: false,
			transformers: [
				transformerNotationDiff({
					classLineAdd: 'bg-green-900',
					classLineRemove: 'bg-red-900',
				}) as any,
			], // any needed due to type mismatch, works fine
		},
	},
	integrations: [
		partytown({
			config: {
				forward: ['dataLayer.push'],
				logCalls: logPartytown,
				logGetters: logPartytown,
				logSendBeaconRequests: logPartytown,
				logImageRequests: logPartytown,
				logMainAccess: logPartytown,
				logScriptExecution: logPartytown,
				logSetters: logPartytown,
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
