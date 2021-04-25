import { Link } from '@reach/router';
import { cl } from 'lib/helpers';
import React from 'react';
import { Glass } from 'components/styled/glass';
import { ReactComponent as Options } from '../zondicons/cog.svg';
import { ReactComponent as Home } from '../zondicons/home.svg';
import { ReactComponent as Groups } from '../zondicons/layers.svg';

interface Props {
  className: string;
}

const pages = [
  { path: '/', label: 'Home', Icon: Home },
  { path: '/groups', label: 'Speaker Groups', Icon: Groups },
  { path: '/options', label: 'Options', Icon: Options },
] as const;

export default ({ className = '' }: Props) => {
  return (
    <nav className={cl`bg-gray-400 text-white bg-opacity-40 p-5 h-24 ${className}`}>
      <Glass />
      <div className="flex justify-around items-center h-full">
        {pages.map(({path, Icon, label}, idx) => (
          <Link key={path + idx + label} to={path} className={cl`
              flex justify-center flex-col items-center space-y-2
              hover:text-gray-300
              active:text-gray-400
            `}
          >
            <Icon className="fill-current h-10" />
            <span className="sr-only md:not-sr-only">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
