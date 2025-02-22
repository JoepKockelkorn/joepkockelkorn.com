import { defineConfig } from 'astro/config';
import vercelStatic from '@astrojs/vercel';
import partytown from '@astrojs/partytown';

const logPartytown = import.meta.env.DEV;

export default defineConfig({
	output: 'static',
	adapter: vercelStatic({}),
	site: 'https://joepkockelkorn.com',
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
});
