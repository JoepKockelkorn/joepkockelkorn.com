import { component$, useStyles$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

import globalStyles from './styles.css?inline';
import './fonts.css';

export default component$(() => {
	useStyles$(globalStyles);

	return (
		<QwikCityProvider>
			<head>
				<meta charSet="utf-8" /> 
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
