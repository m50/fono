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
  w-full md:w-max md:min-w-[16rem] md:max-w-lg
  ml-auto mr-10 md:mt-4 px-4 py-1 border-2 border-opacity-40
  shadow-lg rounded-lg
  backdrop-filter backdrop-blur-xl backdrop-saturate-150
  text-white bg-gray-600 bg-opacity-40
`;

export const Toast = ({ toast, onComplete }: Props) => {
  const [visible, setVisible] = useState(true);
  const icon = typeIcon[toast.type];

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, (toast.ttl ?? 5) * 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Transition show={visible} className="ml-auto overflow-hidden" unmount appear
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
          {toast.body && toast.body.split(/\n/g).map((b) => (
            <p key={b} className="text-xs">{b}</p>
          ))}
        </div>
      </ToastWrapper>
    </Transition>
  );
};
