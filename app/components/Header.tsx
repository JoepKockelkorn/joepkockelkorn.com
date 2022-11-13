import { NavLink } from '@remix-run/react';
import * as React from 'react';

export function Header() {
  return (
    <header className='fixed w-full flex justify-end'>
      <nav>
        <ol className='flex'>
          <li className='flex'>
            <MyNavLink to='/' text='Home' />
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
      className={({ isActive }) => `text-lg p-4 group -outline-offset-2 ${isActive ? 'italic' : ''}`}
      to={to}
      end
    >
      <span className='relative after:absolute after:w-full after:h-[2px] after:bottom-0 after:left-0 after:origin-bottom-left after:transition-transform after:ease-out after:bg-current after:scale-x-0 group-hover:after:scale-x-100 after:will-change-transform'>
        {text}
      </span>
    </NavLink>
  );
}
