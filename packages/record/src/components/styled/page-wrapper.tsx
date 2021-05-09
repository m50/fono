import React from 'react';
import tw from 'tailwind-styled-components';
import styles from '../../styles/custom-scroll.module.css';

const PageWrapperOuter = tw.div`
  w-screen h-full flex justify-center px-2 pb-2
  overflow-y-hidden overflow-x-hidden
`;

const PageWrapperInner = tw.div`
  flex items-center flex-col h-full
  lg:my-auto space-y-2 lg:space-y-20
  lg:w-1/2 w-full md:mx-0 sm:w-2/3 md:w-1/2
  overflow-y-auto overflow-x-visible
`;

export const PageWrapper = ({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) => (
  <PageWrapperOuter>
    <PageWrapperInner className={`${className} ${styles.customScrollbar}`}>
      {children}
    </PageWrapperInner>
  </PageWrapperOuter>
);
