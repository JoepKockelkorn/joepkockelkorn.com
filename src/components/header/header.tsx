import { Slot, component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export const Header = component$((props: { class?: string }) => {
	return (
		<header class={`w-full border-b dark:border-b-gray-700 bg-background flex flex-nowrap ${props.class}`}>
			<nav class="w-full max-w-3xl mx-auto flex justify-end">
				<MyNavLink class="mr-auto p-4 px-6 font-semibold text-xl" to="/" exact>
					<h1>Joep Kockelkorn</h1>
				</MyNavLink>
				<MyNavLink to="/blog">Blog</MyNavLink>
			</nav>
		</header>
	);
});

const MyNavLink = component$(({ to, exact, class: className }: { to: string; exact?: boolean; class?: string }) => {
	const location = useLocation();
	const isCurrent = exact ? location.url.pathname === to : location.url.pathname.startsWith(to);

	return (
		<a class={`text-lg p-4 group -outline-offset-2 ${className}`} href={to} aria-current={isCurrent || undefined}>
			<span
				class={`relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:origin-bottom-left after:transition-transform after:ease-out after:bg-primary-400 after:scale-x-0 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 after:will-change-transform group-aria-[current]:after:scale-x-100`}
			>
				<Slot />
			</span>
		</a>
	);
});
