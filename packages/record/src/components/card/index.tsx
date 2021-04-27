import React, { useState } from 'react';
import tw from 'tailwind-styled-components';
import { Glass } from 'components/styled/glass';
import { cl } from 'lib/helpers';
import { Props, CardObj, TitleProps, BodyProps, ComponentProps } from './types';
import { extractChildren } from './util';
import { ChevronDownIcon as OpenArrow, ChevronUpIcon as CloseArrow } from '@heroicons/react/solid';

const CardWrapper = tw.section`
  bg-gray-400 text-white bg-opacity-40 p-5 rounded-xl
  shadow-lg relative
`;

const CollapsButton = tw.button`
  bg-none border-none text-white
  hover:text-gray-300 active:text-gray-100
  focus:outline-none focus:ring ring-gray-200 ring-opacity-10
`;

const Card: CardObj = ({ children, className = '' }: Props) => {
  const [title, body, footer] = extractChildren(children);

  return (
    <CardWrapper className={className}>
      <Glass className="rounded-xl" />
      {title}
      <main className="flex flex-col justify-between items-center space-y-5 z-10">
        {body}
      </main>
      {footer}
    </CardWrapper>
  );
};

export const Title = ({ children, className = '' }: React.PropsWithChildren<TitleProps>) => (
  <header className={cl`
      border-b border-gray-200 border-opacity-70
      dark:border-gray-400 dark:border-opacity-40
      pb-2 mb-5 flex justify-center ${className}
    `}
  >
    <h3 className="text-3xl mx-auto">
      {children}
    </h3>
  </header>
);

export const Body = ({ children, className = '', collapsable = false, title = '' }: React.PropsWithChildren<BodyProps>) => {
  const [collapsed, setCollapsed] = useState(false);
  const Icon = collapsed ? OpenArrow : CloseArrow;
  return (
    <div className="flex flex-grow w-full flex-col">
      {(title || collapsable) && (
        <div className={cl`
            flex justify-between
            ${collapsed ? '' : 'border-b mb-4 pb-1'}
            border-gray-200 border-opacity-70
            dark:border-gray-400 dark:border-opacity-40
          `}
        >
          <h3 className="text-xl capitalize">{title}</h3>
          <CollapsButton className={collapsable ? '' : 'hidden'}
            onClick={() => setCollapsed((c) => !c)}
            data-testid="collapse"
          >
            <span className="sr-only">Collapse {title || 'section'}</span>
            <Icon className="h-8 fill-current block" />
          </CollapsButton>
        </div>
      )}
      <div data-testid="body-content" className={cl`w-full ${className} ${collapsed ? 'hidden' : ''}`}>
        {children}
      </div>
    </div>
  )
};

const FooterStyles = tw.footer`
  border-t w-full
  border-gray-200 border-opacity-70
  dark:border-gray-400 dark:border-opacity-40
  pt-2 mt-5
`;
export const Footer = ({ children, className = '' }: React.PropsWithChildren<ComponentProps>) => (
  <FooterStyles className={cl`${className}`}>
    {children}
  </FooterStyles>
);

Card.Title = Title;
Card.Body = Body;
Card.Footer = Footer;

export default Card;
