import { cl } from 'lib/helpers';
import React from 'react';
import { ReactComponent as Icon } from './spotify.svg';

interface Props {
  className?: string;
}

export const SpotifyIcon = ({ className = '' }: Props) => (
  <Icon className={cl`fill-current inline ${className}`} />
);

export const color = '#1ED760';
export const colorClass = 'text-[#1ED760]';
export const hoverColorClass = 'hover:!text-[#1ED760]';
