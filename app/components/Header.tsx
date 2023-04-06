import { NavLink } from '@remix-run/react';

export function Header() {
  return (
    <header className="w-full border-b dark:border-b-gray-700 bg-background">
      <nav className="w-full max-w-3xl mx-auto flex justify-end">
        <ol className="flex">
          <li className="flex">
            <MyNavLink to="/" text="Home" end />
            <MyNavLink to="/blog" text="Blog" />
          </li>
        </ol>
      </nav>
    </header>
  );
}

interface MyNavLinkProps {
  to: string;
  text: string;
  end?: boolean;
}

function MyNavLink({ to, text, end }: MyNavLinkProps) {
  return (
    <NavLink className="text-lg p-4 group -outline-offset-2" to={to} end={end}>
      <span className="relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:origin-bottom-left after:transition-transform after:ease-out after:bg-primary-400 after:scale-x-0 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 after:will-change-transform group-aria-[current]:after:scale-x-100">
        {text}
      </span>
    </NavLink>
  );
}
