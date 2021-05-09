import React from 'react';
import { Portal } from 'components/portal';
import shallow from 'zustand/shallow';
import { Toast } from './toast';
import { useToasts } from './useToasts';

type Props = React.PropsWithChildren<{}>;
export const ToastsProvider = ({ children }: Props) => {
  const toasts = useToasts((state) => state.toasts, shallow);
  const removeToast = useToasts((state) => state.removeToast, shallow);
  return (
    <>
      <Portal id="toasts" className="absolute right-0 top-0 overflow-hidden md:mt-16 bottom-0">
        {toasts.map((toast) => (
          <Toast key={JSON.stringify(toast)} toast={toast}
            onComplete={() => removeToast(toast)}
          />
        ))}
      </Portal>
      {children}
    </>
  );
};
