import create from 'zustand';
import type { ToastsState } from './types';

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
