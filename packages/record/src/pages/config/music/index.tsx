import React from 'react';
import { RouteComponentProps } from '@reach/router';
import Card from 'components/card';
import { SpotifyIcon, hoverColorClass } from 'components/svg/spotify';
import { MenuLink } from 'components/styled/menu-link';
import { Spotify } from './spotify';

type CM = React.FC<RouteComponentProps> & {
  Spotify: React.FC<RouteComponentProps>;
}

export const ConfigMusic: CM = () => (
  <div className="w-full px-2 space-y-2">
    <Card>
      <Card.Title>Music Sources</Card.Title>
      <Card.Body>
        <MenuLink to="spotify" className={hoverColorClass}>
          <SpotifyIcon className="h-12 mr-2" />
          <span className="flex flex-col">
            <span className="text-2xl text-white">Spotify</span>
            <small className="text-sm text-gray-400">Personalized to your account</small>
          </span>
        </MenuLink>
      </Card.Body>
    </Card>
  </div>
);

ConfigMusic.Spotify = Spotify;
