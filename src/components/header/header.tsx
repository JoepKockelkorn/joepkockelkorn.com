import { component$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

export const Header = component$(() => {
	return (
		<header class="w-full border-b dark:border-b-gray-700 bg-background">
			<nav class="w-full max-w-3xl mx-auto flex justify-end">
				<ol class="flex">
					<li class="flex">
						<MyNavLink to="/" text="Home" exact />
						<MyNavLink to="/blog" text="Blog" />
					</li>
				</ol>
			</nav>
		</header>
	);
});

const MyNavLink = component$(({ to, exact, text }: { to: string; text: string; exact?: boolean }) => {
	const location = useLocation();
	const isCurrent = exact ? location.url.pathname === to : location.url.pathname.startsWith(to);

	return (
		<a class="text-lg p-4 group -outline-offset-2" href={to} aria-current={isCurrent || undefined}>
			<span
				class={`relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:origin-bottom-left after:transition-transform after:ease-out after:bg-primary-400 after:scale-x-0 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 after:will-change-transform group-aria-[current]:after:scale-x-100`}
			>
				{text}
			</span>
		</a>
	);
});
