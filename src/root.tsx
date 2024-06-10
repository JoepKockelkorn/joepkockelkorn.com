import { component$, useStyles$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

import './fonts.css';
import globalStyles from './styles.css?inline';

export default component$(() => {
	useStyles$(globalStyles);

	return (
		<QwikCityProvider>
			<head>
				<meta charSet="utf-8" />
				<link rel="manifest" href="/manifest.json" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
				<RouterHead />
			</head>
			<body lang="en" class="h-full py-0 bg-background flex flex-col text-text overflow-auto scroll-smooth">
				<script
					dangerouslySetInnerHTML={`
        (function() {
          function setTheme(theme) {
            document.documentElement.className = theme;
            localStorage.setItem('theme', theme);
          }
          var theme = localStorage.getItem('theme');
          console.log(theme);
          if (theme) {
            setTheme(theme);
          } else {
            setTheme('light');
          }
        })();
        window.addEventListener('load', function() {
          var themeSwitch = document.getElementById('hide-checkbox');
          themeSwitch.checked = localStorage.getItem('theme') === 'light'? true: false;
        });
      `}
				></script>
				<RouterOutlet />
				<ServiceWorkerRegister />
			</body>
		</QwikCityProvider>
	);
});
