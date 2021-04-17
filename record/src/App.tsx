import React from 'react';
import { Router } from '@reach/router';
import { SocketContext } from 'hooks/useSocket';
import { UserContext } from 'hooks/useAuth';
import Login from 'pages/login';
import AppRouter from './Router';
import { AppTemplate } from './templates/AppTemplate';
import './styles/tailwind.css';

function App() {
  return (
    <SocketContext.Provider value={{}}>
      <UserContext.Provider value={null}>
        <Router component={AppTemplate}>
          <Login path="login" />
          <AppRouter path="/" />
        </Router>
      </UserContext.Provider>
    </SocketContext.Provider>
  );
}

export default App;

