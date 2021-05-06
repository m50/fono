import { Link } from '@reach/router';
import { cl } from 'lib/helpers';
import React from 'react';
import tw from 'tailwind-styled-components';
import { Glass } from './glass';

interface PageDefinition {
  path: `/${string}`;
  label: string;
  Icon: React.FC<any>;
}

interface Props {
  className: string;
  pages: Readonly<PageDefinition[]>;
}

const NavLink = tw(Link)`
  flex justify-center flex-col items-center space-y-2
  transform transition-transform ease-in-out duration-150
  hover:text-gray-300 hover:-translate-y-1
  active:text-gray-400
`;

const Nav = tw.nav`
  bg-gray-600 text-white bg-opacity-40 p-5 h-24 z-50
  backdrop-filter backdrop-blur-3xl backdrop-saturate-150
`;

export default ({ className = '', pages }: Props) => (
  <Nav className={cl`${className}`}>
    <Glass />
    <div className="flex justify-around items-center h-full">
      {pages.map(({ path, Icon, label }, idx) => (
        <NavLink key={path + idx + label} to={path}>
          <Icon className="fill-current h-10" />
          <span className="sr-only md:not-sr-only">{label}</span>
        </NavLink>
      ))}
    </div>
  </Nav>
);
