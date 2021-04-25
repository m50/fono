export type Children = JSX.Element[] | JSX.Element;

export interface Props {
  children?: Children;
  className?: string;
}

export interface CardObj {
  (props: Props): JSX.Element;
  Title(props: React.PropsWithChildren<any>): JSX.Element;
  Body(props: React.PropsWithChildren<any>): JSX.Element;
  Footer(props: React.PropsWithChildren<any>): JSX.Element;
}

export interface ComponentProps extends React.PropsWithChildren<any> {
  className: string;
}

export interface TitleProps extends ComponentProps {
  children: string;
}

export interface BodyProps extends ComponentProps {
  collapsable: boolean;
  title: string;
}
