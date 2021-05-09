import { cloneElement, ReactElement, PropsWithChildren, Ref } from 'react';

type Props = PropsWithChildren<{ className: string, ref?: Ref<any> }>

export const StyledChild = ({ className = '', children, ref }: Props) => cloneElement(
  children as ReactElement,
  { className, ref },
);
