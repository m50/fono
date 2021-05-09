import shallow from 'zustand/shallow';
import { useToasts } from './useToasts';

export { ToastsProvider } from './provider';
export const useAddToast = () => useToasts((state) => state.addToast, shallow);
