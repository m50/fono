import React from 'react';
import { RouteComponentProps } from '@reach/router';
import Card from 'components/card';
import type { AudioConfig, Spotify } from '@fono/gramophone/src/schema/AudioConfig';
import { withQuery } from 'components/higher-order/withQuery';
import Button from 'components/input/button';
import { PlusIcon } from '@heroicons/react/solid';
import { SpotifyLink } from './spotify';

interface Props extends RouteComponentProps {
  audioConfigs: AudioConfig[];
}

const Music = ({ audioConfigs, navigate }: Props) => {
  const addAudioSource = () => {
    navigate?.('spotify');
  };
  return (
    <div className="w-full px-2 space-y-2">
      <Card>
        <Card.Title>Music Sources</Card.Title>
        <Card.Body>
          {audioConfigs.map((audioConfig) => {
            if (audioConfig.type === 'spotify') {
              return <SpotifyLink key={audioConfig.id} audioConfig={audioConfig as AudioConfig<Spotify>} />;
            }
            return null;
          })}
        </Card.Body>
        <Card.Footer className="flex justify-center">
          <Button onClick={addAudioSource} iconLeft icon={PlusIcon}>Add Audio Source</Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export const ConfigMusic = withQuery<{ audioConfigs: AudioConfig[] }, Props>(
  (gql) => gql`
    query GetAudioConfigs {
      audioConfigs {
        id
        type
        config
        createdAt
        updatedAt
      }
    }
  `,
  Music,
);
