import React, { forwardRef } from 'react';
import type { RouteComponentProps } from '@reach/router';
import useApi from 'hooks/useApi';
import { StyledChild } from 'components/styled/styled-child';

type Props = React.PropsWithChildren<RouteComponentProps>;

export const AuthGate = forwardRef<HTMLDivElement, Props>(({ children }, ref) => {
  useApi();
  return (
    <StyledChild ref={ref} className="flex w-full h-full relative justify-center">
      {children}
    </StyledChild>
  );
});
