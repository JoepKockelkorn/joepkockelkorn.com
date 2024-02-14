import { component$ } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';
import { QwikPartytown } from '../partytown/partytown';

export const RouterHead = component$(() => {
	const head = useDocumentHead();
	const loc = useLocation();

	return (
		<>
			<title>{head.title}</title>
			<link rel="canonical" href={loc.url.href} />
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

			{head.meta.map((m) => (
				<meta key={m.key} {...m} />
			))}

			{head.links.map((l) => (
				<link key={l.key} {...l} />
			))}

			{head.styles.map((s) => (
				<style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
			))}
		</>
	);
});
