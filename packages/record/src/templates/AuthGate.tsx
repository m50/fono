import React, { forwardRef } from 'react';
import type { RouteComponentProps } from '@reach/router';
import useApi from 'hooks/useApi';

type Props = React.PropsWithChildren<RouteComponentProps>;

export const AuthGate = forwardRef<HTMLDivElement, Props>(({ children }, ref) => {
  useApi();
  const child = React.cloneElement(children as React.ReactElement, { className: 'flex w-full flex-grow min-h-screen relative justify-center' });
  return child;
});
