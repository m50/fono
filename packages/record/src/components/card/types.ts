import React from 'react';

export type Children = JSX.Element[] | JSX.Element;

export interface Props {
  form?: JSX.IntrinsicElements['form'];
  children?: Children;
  className?: string;
}

export interface CardObj {
  (props: Props): JSX.Element;
  Title(props: React.PropsWithChildren<TitleProps>): JSX.Element;
  Body(props: React.PropsWithChildren<BodyProps>): JSX.Element;
  Footer(props: React.PropsWithChildren<ComponentProps>): JSX.Element;
}

export interface ComponentProps {
  className?: string;
}

export interface TitleProps extends ComponentProps {
  children: string;
}

export interface BodyProps extends ComponentProps {
  collapsed?: boolean;
  collapsable?: boolean;
  title?: string;
}
