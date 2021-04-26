import React from 'react';
import { Router } from '@reach/router';
import { withProviders } from 'components/higher-order/withProviders';
import Login from 'pages/login';
import Home from 'pages';
import Graphiql from 'pages/__graphiql';
import { AuthGate } from 'templates/AuthGate';
import { AppTemplate } from 'templates/AppTemplate';
import './styles/tailwind.css';

const AppRouter = () => (
  <Router component={AppTemplate}>
    <Login path="login" />
    <AuthGate path="/">
      <Home path="/" />
      <Graphiql path="__graphiql" />
    </AuthGate>
  </Router>
);

export default withProviders(AppRouter);

