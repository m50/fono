import React from 'react';
import { Router } from '@reach/router';
import { withProviders } from 'components/higher-order/withProviders';
import Login from 'pages/login';
import Home from 'pages';
import Graphiql from 'pages/__graphiql';
import { SpeakerGroups } from 'pages/speaker-groups';
import { Config, ConfigMain } from 'pages/config';
import { AuthGate } from 'templates/AuthGate';
import { AppTemplate } from 'templates/AppTemplate';
import './styles/tailwind.css';

const AppRouter = () => (
  <Router component={AppTemplate}>
    <Login path="login" />
    <AuthGate path="/">
      <Home path="/" />
      <Graphiql path="__graphiql" />
      <SpeakerGroups path="speaker-groups" />
      <Config path="options">
        <ConfigMain path="/" />
      </Config>
    </AuthGate>
  </Router>
);

export default withProviders(AppRouter);

