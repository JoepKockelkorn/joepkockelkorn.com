import partytown from '@astrojs/partytown';
import vercelStatic from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './src/utils/remark-reading-time';

const logPartytown = import.meta.env.DEV;

export default defineConfig({
	output: 'static',
	adapter: vercelStatic({}),
	site: 'https://joepkockelkorn.com',
	markdown: {
		remarkPlugins: [remarkReadingTime],
		shikiConfig: {
			theme: 'night-owl',
			wrap: false,
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
