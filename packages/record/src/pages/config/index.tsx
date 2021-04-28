import React, { forwardRef } from 'react';
import type { RouteComponentProps } from '@reach/router';
import { StyledChild } from 'components/styled/styled-child';
import { PageHeader } from 'components/styled/page-header';
import { PageWrapper } from 'components/styled/page-wrapper';

type Props = React.PropsWithChildren<RouteComponentProps>;

export const Config = forwardRef<HTMLDivElement, Props>((props: Props, ref) => (
  <div className="flex w-full flex-col h-full relative justify-center items-center">
    <PageHeader path={props.uri as string} title="Settings" />
    <PageWrapper>
      <StyledChild ref={ref} className="flex w-full h-full">
        {props.children}
      </StyledChild>
    </PageWrapper>
  </div>
));

export { ConfigMain } from './main';
export { ConfigUser } from './user';
