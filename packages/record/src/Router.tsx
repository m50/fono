import React from 'react';
import Home from 'pages';
import type { RouteComponentProps } from '@reach/router';
import useApi from 'hooks/useApi';

// eslint-disable-next-line
const Router = (props: RouteComponentProps) => {
  useApi();
  return (
    <>
      <Home path="/" />
    </>
  );
};

export default Router;
