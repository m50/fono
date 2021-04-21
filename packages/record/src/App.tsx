import React from 'react';
import { Router } from '@reach/router';
import { SocketContext } from 'hooks/useSocket';
import { withProviders } from 'components/higher-order/withProviders';
import Login from 'pages/login';
import Graphiql from 'pages/__graphiql';
import AppRouter from './Router';
import { AppTemplate } from './templates/AppTemplate';
import './styles/tailwind.css';

const App = withProviders(() => (
  <Router component={AppTemplate}>
    <Login path="login" />
    <Graphiql path="__graphiql" />
    <AppRouter path="/" />
  </Router>
));

export default App;

