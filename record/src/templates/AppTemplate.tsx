import React from 'react';
import { RouteComponentProps, useMatch } from '@reach/router';
import tw from 'tailwind-styled-components';

type Props = RouteComponentProps & React.PropsWithChildren<any>

const BgGradient = tw.div`
  absolute left-0 right-0 bottom-0 top-0 bg-gradient-to-bl opacity-90
  from-yellow-300 via-yellow-600 to-purple-900
  dark:from-purple-900 dark:to-yellow-900 dark:via-indigo-800
`;

export const AppTemplate = ({ children }: Props) => {
  const onLogin = useMatch('/login');
  return (
    <div className="w-screen min-h-screen flex relative dark:bg-gray-800 justify-center items-center">
      <BgGradient />
      <main className="flex w-full flex-grow h-full relative">
        {children}
      </main>
      {!onLogin && (
        <nav className="sticky h-16 bottom-0 right-0 left-0 bg-gray-400 bg-opacity-40">
          {/* Navbar */}
        </nav>
      )}
    </div>
  );
};
