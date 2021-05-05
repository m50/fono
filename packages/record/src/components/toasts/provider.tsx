import React, { useEffect, useMemo, useState } from 'react';
import create from 'zustand';
import { ToastsState } from './types';
import { Portal } from 'components/portal';
import { Toast } from './toast';
import shallow from 'zustand/shallow'

export const useToasts = create<ToastsState>((set, get) => ({
  toasts: [],
  addToast: (toast) => set({ toasts: [...get().toasts, toast] }),
  removeToast: (toast) => {
    const oldToasts = get().toasts;
    const idx = oldToasts.findIndex((v) => v.type === toast.type
      && v.body === toast.body
      && v.title === toast.title
      && v.ttl === toast.ttl);
    const toasts = oldToasts.filter((t, index) => index !== idx);
    set({ toasts });
  },
  clearToasts: () => set({ toasts: [] }),
}));

type Props = React.PropsWithChildren<{}>;
export const ToastsProvider = ({ children }: Props) => {
  const toasts = useToasts((state) => state.toasts, shallow);
  const clearToasts = useToasts((state) => state.clearToasts, shallow);
  const [hiddenToasts, setHiddenToasts] = useState(0);
  useEffect(() => {
    if (hiddenToasts === toasts.length) {
      clearToasts();
      setHiddenToasts(0);
      console.log('clear');
    }
  }, [hiddenToasts, toasts]);
  return (
    <>
      <Portal id="toasts" className="absolute right-0 top-0 overflow-hidden md:mt-16">
        {toasts.map((toast, idx) => (
          <Toast key={idx + toast?.type} toast={toast}
            onComplete={() => setHiddenToasts((v) => v + 1)}
          />
        ))}
      </Portal>
      {children}
    </>
  )
};
