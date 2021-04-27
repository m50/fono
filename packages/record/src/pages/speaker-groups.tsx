import React from 'react';
import type { RouteComponentProps } from '@reach/router';

type Props = React.PropsWithChildren<RouteComponentProps>;

export const SpeakerGroups = (props: Props) => {
  return (
    <div>{props.children}</div>
  );
}
