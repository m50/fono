import React from 'react';
import { Router } from '@reach/router';
import { SocketContext } from 'hooks/useSocket';
import Login from 'pages/login';
import AppRouter from './Router';
import { AppTemplate } from './templates/AppTemplate';
import './styles/tailwind.css';

function App() {
  return (
    <SocketContext.Provider value={{}}>
      <Router component={AppTemplate}>
        <Login path="login" />
        <AppRouter path="/" />
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
