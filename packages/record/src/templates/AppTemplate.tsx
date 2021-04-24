import React, { forwardRef } from 'react';
import { RouteComponentProps, useMatch } from '@reach/router';
import tw from 'tailwind-styled-components';
import Nav from 'components/nav';

type Props = React.PropsWithChildren<RouteComponentProps>;

const BgGradient = tw.div`
  absolute left-0 right-0 bottom-0 top-0 bg-gradient-to-bl dark:opacity-40
  from-yellow-300 via-yellow-600 to-purple-900
  dark:from-purple-900 dark:to-yellow-900 dark:via-indigo-800
`;

export const AppTemplate = forwardRef<HTMLElement, Props>(({ children }: Props, ref) => {
  const onLogin = useMatch('/login');
  return (
    <div className="w-screen min-h-screen flex relative dark:bg-black justify-center items-center">
      <BgGradient />
      <main className="flex w-full flex-grow min-h-screen relative justify-center" ref={ref}>
        {children}
      </main>
      {!onLogin && (
        <Nav className="absolute bottom-0 right-0 left-0" />
      )}
    </div>
  );
});
