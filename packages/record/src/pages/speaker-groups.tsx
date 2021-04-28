import React from 'react';
import type { RouteComponentProps } from '@reach/router';
import { PageHeader } from 'components/styled/page-header';
import { PageWrapper } from 'components/styled/page-wrapper';
import useApi from 'hooks/useApi';

export const SpeakerGroups = (props: RouteComponentProps) => {
  const { gql } = useApi();
  return (
    <div className="flex w-full flex-col h-full relative justify-center items-center">
      <PageHeader path={props.uri as string} title="Speaker Groups" />
      <PageWrapper>
      </PageWrapper>
    </div>
  );
}
