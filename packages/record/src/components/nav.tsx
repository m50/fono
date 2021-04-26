import { Link } from '@reach/router';
import { cl, isDev } from 'lib/helpers';
import React from 'react';
import { Glass } from 'components/styled/glass';
import { ReactComponent as Options } from './zondicons/cog.svg';
import { ReactComponent as Home } from './zondicons/home.svg';
import { ReactComponent as Groups } from './zondicons/layers.svg';
import tw from 'tailwind-styled-components';

interface Props {
  className: string;
}

const pages = [
  { path: '/', label: 'Home', Icon: Home },
  { path: '/groups', label: 'Speaker Groups', Icon: Groups },
  { path: '/options', label: 'Options', Icon: Options },
] as const;

const NavLink = tw(Link)`
  flex justify-center flex-col items-center space-y-2
  hover:text-gray-300
  active:text-gray-400
`;

const Nav = tw.nav`bg-gray-400 text-white bg-opacity-40 p-5 h-24`;

export default ({ className = '' }: Props) => {
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
        {isDev() && (<NavLink to={'/__graphiql'}>
          <span className="sr-only md:not-sr-only">graphiql</span>
        </NavLink>)}
      </div>
    </Nav>
  );
};
