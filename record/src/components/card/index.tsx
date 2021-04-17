import { cl } from 'lib/helpers';
import React from 'react';
import tw from 'tailwind-styled-components';

type Children = JSX.Element[];

interface Props {
  children: Children;
  className?: string;
}

interface CardObj {
  (props: Props): JSX.Element;
  Title(props: React.PropsWithChildren<any>): JSX.Element;
  Body(props: React.PropsWithChildren<any>): JSX.Element;
  Footer(props: React.PropsWithChildren<any>): JSX.Element;
  defaultProps: Partial<Props>;
}

const Glass = tw.div`
  absolute left-0 right-0 top-0 bottom-0 rounded-xl z-0 pointer-events-none
  bg-gradient-to-tr from-transparent to-transparent via-white opacity-30
  dark:via-gray-400
`;

const Card: CardObj = ({ children, className }: Props) => {
  let title: JSX.Element | null = null;
  const body: JSX.Element[] = [];
  let footer: JSX.Element | null = null;
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
  return (
    <section className={cl`
        bg-gray-400 text-white bg-opacity-40 p-5 rounded-xl
        shadow-lg relative
        ${className ?? ''}
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
  className?: string;
}

interface TitleProps extends ComponentProps {
  children: string;
}
export const Title = ({ children, className }: TitleProps) => (
  <header className={cl`
      border-b border-gray-400 border-opacity-40
      pb-2 mb-5 flex justify-center ${className ?? ''}
    `}
  >
    <h3 className="text-3xl mx-auto">
      {children}
    </h3>
  </header>
);

export const Body = ({ children, className }: ComponentProps) => (
  <div className={cl`w-full ${className ?? ''}`}>
    {children}
  </div>
);

export const Footer = ({ children, className }: React.PropsWithChildren<any>) => (
  <footer className={cl`
      border-t border-gray-400 border-opacity-40 w-full
      pt-2 mt-5 ${className ?? ''}
    `}
  >
    {children}
  </footer>
);

Card.Title = Title;
Card.Body = Body;
Card.Footer = Footer;
Card.defaultProps = {
  className: '',
};

export default Card;
