import React from 'react';
import Home from 'pages';
import type { RouteComponentProps } from '@reach/router';

// eslint-disable-next-line
const Router = (props: RouteComponentProps) => {
  return (
    <>
      <Home path="/" />
    </>
  );
};

export default Router;
