export interface Toast {
  title?: string;
  body?: string;
  type: 'error' | 'success' | 'info' | 'warning';
  ttl?: number;
}

export type ToastsState = {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (toast: Toast) => void;
  clearToasts: () => void;
}
