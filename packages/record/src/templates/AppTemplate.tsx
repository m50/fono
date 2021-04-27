import React, { forwardRef, useMemo } from 'react';
import { RouteComponentProps, useMatch } from '@reach/router';
import tw from 'tailwind-styled-components';
import Nav from 'components/styled/nav';
import { pages } from 'constants/page-definitions';
import { TerminalIcon as GraphiqlIcon } from '@heroicons/react/solid';
import { isDev } from 'lib/helpers';

type Props = React.PropsWithChildren<RouteComponentProps>;

const BgGradient = tw.div`
  absolute left-0 right-0 bottom-0 top-0 bg-gradient-to-bl dark:opacity-40
  from-yellow-300 via-yellow-600 to-purple-900
  dark:from-purple-900 dark:to-yellow-900 dark:via-indigo-800
`;

const Main = tw.main`
flex w-full absolute justify-center top-0 bottom-0 absolute
`;

export const AppTemplate = forwardRef<HTMLElement, Props>(({ children }: Props, ref) => {
  const onLogin = useMatch('/login');
  const newPages: any = useMemo(() => {
    const graphiql = { path: '/__graphiql', Icon: GraphiqlIcon, label: 'graphiql' };
    const newPages: any = [...pages];
    if (isDev()) {
      newPages.push(graphiql);
    }
    return newPages;
  }, []);
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 dark:bg-black">
      <BgGradient />
      <Main className={onLogin ? '' : 'bottom-24'} ref={ref}>
        {children}
      </Main>
      {!onLogin && (
        <Nav pages={newPages} className="absolute bottom-0 right-0 left-0" />
      )}
    </div>
  );
});
