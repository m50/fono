import React from 'react';
import { Router } from '@reach/router';
import { withProviders } from 'components/higher-order/withProviders';
import Login from 'pages/login';
import Home from 'pages';
import Graphiql from 'pages/__graphiql';
import { SpeakerGroups } from 'pages/speaker-groups';
import { ConfigMain, ConfigUser, ConfigMusic } from 'pages/config';
import { AuthGate } from 'templates/AuthGate';
import { AppTemplate } from 'templates/AppTemplate';
import { StandardTemplate } from 'templates/StandardTemplate';
import './styles/tailwind.css';

const AppRouter = () => (
  <Router component={AppTemplate}>
    <Login path="login" />
    <AuthGate path="/">
      <StandardTemplate path="/" title="Home">
        <Home path="/" />
      </StandardTemplate>

      <Graphiql path="__graphiql" />

      <StandardTemplate path="speaker-groups" title="Speaker Groups">
        <SpeakerGroups path="/" />
      </StandardTemplate>

      <StandardTemplate path="settings" title="Settings">
        <ConfigMain path="/" />
        <ConfigUser path="user" />
        <ConfigMusic path="music" />
        <ConfigMusic.Spotify path="music/spotify" />
      </StandardTemplate>
    </AuthGate>
  </Router>
);

export default withProviders(AppRouter);

