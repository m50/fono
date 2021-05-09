import React from 'react';
import type { RouteComponentProps } from '@reach/router';
import useApi from 'hooks/useApi';
import Card from 'components/card';

export const SpeakerGroups: React.FC<RouteComponentProps> = () => {
  useApi();
  return (
    <div className="w-full px-2">
      <Card>
        <Card.Title>Speaker Groups</Card.Title>
      </Card>
    </div>
  );
};
