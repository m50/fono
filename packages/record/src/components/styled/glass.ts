import tw from 'tailwind-styled-components';

export const Glass = tw.div`
  absolute left-0 right-0 top-0 bottom-0 z-0 pointer-events-none
  bg-gradient-to-tr from-transparent to-transparent via-white opacity-30
  dark:via-gray-400
`;
