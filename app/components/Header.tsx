import { NavLink } from '@remix-run/react';

export function Header() {
  return (
    <header className="sticky top-0 w-full flex justify-end border-b bg-gray-100">
      <nav>
        <ol className="flex">
          <li className="flex">
            <MyNavLink to="/" text="Home" />
            {/* <MyNavLink to="/blog" text="Blog" /> */}
          </li>
        </ol>
      </nav>
    </header>
  );
}

interface MyNavLinkProps {
  to: string;
  text: string;
}

function MyNavLink({ to, text }: MyNavLinkProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        `text-lg p-4 group -outline-offset-2 ${
          isActive ? 'text-orange-400' : ''
        }`
      }
      to={to}
      end
    >
      <span className="relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:origin-bottom-left after:transition-transform after:ease-out after:bg-orange-400 after:scale-x-0 group-hover:after:scale-x-100 group-focus-visible:after:scale-x-100 after:will-change-transform group-aria-[current]:after:scale-x-100">
        {text}
      </span>
    </NavLink>
  );
}
