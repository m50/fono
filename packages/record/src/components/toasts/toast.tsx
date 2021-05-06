import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import tw from 'tailwind-styled-components';
import {
  CheckCircleIcon as SuccessIcon,
  ExclamationIcon as WarningIcon,
  ExclamationCircleIcon as ErrorInfoIcon,
} from '@heroicons/react/solid';
import { Glass } from 'components/styled/glass';
import { Toast as ToastType } from './types';

interface Props {
  toast: ToastType;
  onComplete?: () => void;
}

const typeIcon = {
  error: <ErrorInfoIcon className="h-12 text-red-400" />,
  success: <SuccessIcon className="h-12 text-green-400" />,
  info: <ErrorInfoIcon className="h-12 text-blue-400" />,
  warning: <WarningIcon className="h-12 text-yellow-400" />,
};

const typeColor = {
  error: 'border-red-400',
  success: 'border-green-400',
  info: 'border-blue-400',
  warning: 'border-yellow-400',
};

const ToastWrapper = tw.div`
  relative flex items-top z-50
  w-full md:w-64
  mr-10 md:mt-4 px-4 py-1 border-2 border-opacity-40
  shadow-lg rounded-lg
  backdrop-filter backdrop-blur-xl backdrop-saturate-150
  text-white bg-gray-600 bg-opacity-60
  dark:bg-gray-400 dark:bg-opacity-40
`;

export const Toast = ({ toast, onComplete }: Props) => {
  const [visible, setVisible] = useState(false);
  const icon = typeIcon[toast.type];

  useEffect(() => {
    setVisible(true);
    const timeout = setTimeout(() => {
      setVisible(false);
    }, (toast.ttl ?? 5) * 1000);
    return () => clearTimeout(timeout);
  }, [toast.ttl]);

  return (
    <Transition show={visible} className="overflow-hidden" unmount
      enter="transform transition-all duration-300 ease-in-out"
      enterFrom="opacity-0 translate-x-60"
      enterTo="opacity-100 translate-x-0"
      leave="transition-opacity duration-1000 ease-in-out"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={onComplete}
    >
      <ToastWrapper onClick={() => setVisible(false)} className={typeColor[toast.type]}>
        <Glass className="rounded-lg" />
        <div className="pr-2">{icon}</div>
        <div className="flex flex-col justify-center">
          <h3 className="text-md">{toast.title}</h3>
          <p className="text-xs">{toast.body}</p>
        </div>
      </ToastWrapper>
    </Transition>
  );
};
