import React from 'react';
import useAuth from 'hooks/useAuth';
import Home from 'pages';
import type { RouteComponentProps } from '@reach/router';

// eslint-disable-next-line
const Router = (props: RouteComponentProps) => {
  useAuth();
  return (
    <>
      <Home path="/" />
    </>
  );
};

export default Router;
