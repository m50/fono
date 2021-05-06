import shallow from 'zustand/shallow';
import { useToasts } from './provider';

export { ToastsProvider } from './provider';
export const useAddToast = () => useToasts((state) => state.addToast, shallow);
