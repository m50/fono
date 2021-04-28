import React from 'react';
import { Link } from '@reach/router';
import { ChevronRightIcon as RightArrow } from '@heroicons/react/solid';
import { cl } from 'lib/helpers';
import tw from 'tailwind-styled-components';

interface SharedProps {
  to: string;
  className?: string;
  state?: Record<string, any>;
}

interface PropsTitle {
  title: string;
  children?: never;
}

interface PropsChildren {
  title?: never;
  children: React.ReactNode | React.ReactNode[];
}

type Props = SharedProps & (PropsChildren | PropsTitle);

const CustomLink = tw(Link)`
  justify-between flex w-full py-2 text-lg
  border-0 border-b
  border-gray-200 border-opacity-70
  dark:border-gray-400 dark:border-opacity-40
  hover:text-gray-300 hover:shadow-xl
  transform transition-transform ease-in-out duration-150
  hover:-translate-y-1 active:translate-y-0 active:shadow-sm
`;

export const MenuLink = ({to, title, state, className = '', children = null}: Props) => (
  <CustomLink to={to} className={cl`${className}`} state={state}>
    <span className="flex items-center justify-start">{children ?? title}</span>
    <RightArrow className="fill-current h-7"
    />
  </CustomLink>
);
