import { Link, useLocation, useMatch } from '@reach/router';
import { cl } from 'lib/helpers';
import React from 'react';
import { ArrowLeftIcon as BackIcon } from '@heroicons/react/solid';
import tw from 'tailwind-styled-components';

interface Props {
  className?: string;
  title: string;
  path: string;
}

const Header = tw.header`
sticky w-screen px-8 mb-4
text-white
`;

export const PageHeader = ({ title, path, className = '' }: Props) => {
  const match = useMatch(path);
  const location = useLocation();
  return (
    <Header className={cl`${className}`}>
      <div className="border-b border-white pt-4 pb-2 flex justify-between">
        {!match ? (
          <Link to={`${location.pathname.replace(/\/$/, '')}/..`} className="hover:text-gray-300 w-8">
            <BackIcon className="fill-current h-8" />
            <span className="sr-only">Go back</span>
          </Link>
        ) : <span className="w-8" />}
        <h1 className="text-4xl">{title}</h1>
        <span className="w-8">{' '}</span>
      </div>
    </Header>
  );
};
