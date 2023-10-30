import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import { QwikPartytown } from './components/partytown/partytown';

import './styles.css';
import './fonts.css';

export default component$(() => {
	return (
		<QwikCityProvider>
			<head>
				<meta charSet="utf-8" />
				<QwikPartytown forward={['dataLayer.push']} />
				<script async type="text/partytown" src="https://www.googletagmanager.com/gtag/js?id=G-BS603B8LYL" />
				<script
					type="text/partytown"
					dangerouslySetInnerHTML={`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-BS603B8LYL');
					`}
				/>
				
				<link rel="manifest" href="/manifest.json" />
				<RouterHead />
			</head>
			<body lang="en" class="h-full py-0 bg-background flex flex-col text-text overflow-auto scroll-smooth">
				<RouterOutlet />
				<ServiceWorkerRegister />
			</body>
		</QwikCityProvider>
	);
});
