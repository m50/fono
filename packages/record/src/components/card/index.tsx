import { Transition } from '@headlessui/react';
import { cl } from 'lib/helpers';
import React, { useState } from 'react';
import tw from 'tailwind-styled-components';
import { ReactComponent as OpenArrow } from '../zondicons/cheveron-down.svg';
import { ReactComponent as CloseArrow } from '../zondicons/cheveron-up.svg';

type Children = JSX.Element[] | JSX.Element;

interface Props {
  children?: Children;
  className?: string;
}

interface CardObj {
  (props: Props): JSX.Element;
  Title(props: React.PropsWithChildren<any>): JSX.Element;
  Body(props: React.PropsWithChildren<any>): JSX.Element;
  Footer(props: React.PropsWithChildren<any>): JSX.Element;
}

const Glass = tw.div`
  absolute left-0 right-0 top-0 bottom-0 rounded-xl z-0 pointer-events-none
  bg-gradient-to-tr from-transparent to-transparent via-white opacity-30
  dark:via-gray-400
`;

const Card: CardObj = ({ children, className = '' }: Props) => {
  let title: JSX.Element | null = null;
  const body: JSX.Element[] = [];
  let footer: JSX.Element | null = null;
  if (Array.isArray(children)) {
    children
      .filter((child) => ['Title', 'Body', 'Footer'].includes(child.type.name))
      .forEach((child) => {
        if (child.type.name === 'Title') {
          title = child;
        } else if (child.type.name === 'Body') {
          body.push(child);
        } else if (child.type.name === 'Footer') {
          footer = child;
        }
      });
  } else if (children?.type.name === 'Title') {
    title = children
  } else if (children?.type.name === 'Body') {
    body.push(children);
  } else if (children?.type.name === 'Footer') {
    footer = children
  }
  return (
    <section className={cl`
        bg-gray-400 text-white bg-opacity-40 p-5 rounded-xl
        shadow-lg relative
        ${className}
      `}
    >
      <Glass />
      {title}
      <main className="flex flex-col justify-between items-center space-y-5 z-10">
        {body}
      </main>
      {footer}
    </section>
  );
};

interface ComponentProps extends React.PropsWithChildren<any> {
  className: string;
}

interface TitleProps extends ComponentProps {
  children: string;
}
export const Title = ({ children, className = '' }: TitleProps) => (
  <header className={cl`
      border-b border-gray-400 border-opacity-40
      pb-2 mb-5 flex justify-center ${className}
    `}
  >
    <h3 className="text-3xl mx-auto">
      {children}
    </h3>
  </header>
);

interface BodyProps extends ComponentProps {
  collapsable: boolean;
  title: string;
}
export const Body = ({ children, className = '', collapsable = false, title = '' }: BodyProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const Icon = collapsed ? OpenArrow : CloseArrow;
  return (
    <div className="flex flex-grow w-full flex-col">
      {(title || collapsable) && (
        <div className={cl`
            flex justify-between
            ${collapsed ? '' : 'border-b mb-4 pb-1'}
            border-gray-400 border-opacity-40
          `}
        >
          <h3 className="text-xl capitalize">{title}</h3>
          <button className={cl`
              bg-none border-none text-white
              hover:text-gray-300 active:text-gray-100
              focus:outline-none focus:ring ring-gray-200 ring-opacity-10
              ${collapsable ? '' : 'hidden'}
            `}
            onClick={() => setCollapsed((c) => !c)}
          >
            <span className="sr-only">Collapse {title || 'section'}</span>
            <Icon className="h-8 fill-current block" />
          </button>
        </div>
      )}
      <div className={cl`w-full ${className} ${collapsed ? 'hidden' : ''}`}>
        {children}
      </div>
    </div>
  )
};

export const Footer = ({ children, className = '' }: React.PropsWithChildren<any>) => (
  <footer className={cl`
      border-t border-gray-400 border-opacity-40 w-full
      pt-2 mt-5 ${className}
    `}
  >
    {children}
  </footer>
);

Card.Title = Title;
Card.Body = Body;
Card.Footer = Footer;

export default Card;
