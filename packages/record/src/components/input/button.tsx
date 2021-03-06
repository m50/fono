import { cl } from 'lib/helpers';
import React, { useEffect, useMemo, useRef } from 'react';

interface Props {
  type?: 'button' | 'reset' | 'submit';
  children?: string;
  className?: string;
  primary?: boolean;
  iconLeft?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  onClick?: () => void;
}

interface Component {
  (props: Props): JSX.Element;
}

const classes = (primary: boolean, className: string) => cl`
  flex justify-between align-center
  px-5 py-2 text-gray-100 rounded-xl border capitalize
  focus:outline-none focus:ring focus:ring-purple-400
  transition-colors duration-150 ease-in-out
  ${primary
    ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-900'
    : `dark:bg-gray-500 dark:hover:bg-gray-600 dark:active:bg-gray-800
      bg-gray-600 hover:bg-gray-700 active:bg-gray-900
    `}
  ${primary
    ? 'border-purple-600 hover:border-gray-700'
    : 'border-gray-600 hover:border-gray-700'}
  ${className}
`;

const Button: Component = ({
  type = 'button',
  children = '',
  className = '',
  onClick,
  primary = false,
  icon: Icon = '',
  disabled = false,
  iconLeft = false,
}) => {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!primary) {
      return () => (null);
    }
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        button.current?.click();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [primary, button]);

  const renderedIcon = useMemo(() => (Icon ? <Icon className="fill-current h-6 inline" /> : null), [Icon]);
  return (
    // eslint-disable-next-line react/button-has-type
    <button type={type} onClick={onClick}
      className={classes(primary, className)}
      disabled={disabled} ref={button}
    >
      {iconLeft ? renderedIcon : ''}
      {children && <span className={iconLeft ? 'pl-2' : 'pr-2'}>{children}</span>}
      {iconLeft ? '' : renderedIcon}
    </button>
  );
};

export default Button;
