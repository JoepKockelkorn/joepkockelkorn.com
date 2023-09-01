import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';

export const Header = component$(() => {
	return (
		<header class="w-full border-b dark:border-b-gray-700 bg-background">
			<nav class="w-full max-w-3xl mx-auto flex justify-end">
				<ol class="flex">
					<li class="flex">
						<MyNavLink to="/" text="Home" end />
						<MyNavLink to="/blog" text="Blog" />
					</li>
				</ol>
			</nav>
		</header>
	);
});

const MyNavLink = component$(({ to, end, text }: { to: string; text: string; end?: boolean }) => {
	const location = useLocation();
	const isCurrent = location.url.pathname === to || (end && location.url.pathname.startsWith(to));

	return (
		<Link class="text-lg p-4 group -outline-offset-2" href={to} aria-current={isCurrent}>
			<span
				class={`relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:origin-bottom-left after:transition-transform after:ease-out after:bg-primary-400 after:scale-x-0 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 after:will-change-transform group-aria-[current]:after:scale-x-100`}
			>
				{text}
			</span>
		</Link>
	);
});
