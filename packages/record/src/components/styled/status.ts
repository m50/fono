import tw from 'tailwind-styled-components';

interface Props {
  $success: boolean;
}

export const Status = tw.pre<Props>`
  text-sm w-full
  ${({ $success }) => $success ? 'text-green-400' : 'text-red-400'}
`;
