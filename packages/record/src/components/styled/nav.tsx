import { Link } from '@reach/router';
import { cl, isDev } from 'lib/helpers';
import React from 'react';
import { Glass } from './glass';
import tw from 'tailwind-styled-components';

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
  hover:text-gray-300
  active:text-gray-400
`;

const Nav = tw.nav`bg-gray-400 text-white bg-opacity-40 p-5 h-24 z-50`;

export default ({ className = '', pages }: Props) => {
  return (
    <Nav className={cl`${className}`}>
      <Glass />
      <div className="flex justify-around items-center h-full">
        {pages.map(({path, Icon, label}, idx) => (
          <NavLink key={path + idx + label} to={path}>
            <Icon className="fill-current h-10" />
            <span className="sr-only md:not-sr-only">{label}</span>
          </NavLink>
        ))}
      </div>
    </Nav>
  );
};
