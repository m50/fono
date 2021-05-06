import { useMemo, useEffect, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

type Props = PropsWithChildren<{
  className?: string,
  id?: string,
}>;

export const Portal = ({ children, className = '', id = '' }: Props) => {
  const el = useMemo(() => {
    const div = document.createElement('div');
    div.className = className;
    div.id = id;
    return div;
  }, []);
  useEffect(() => {
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  return createPortal(children, el, id);
};
