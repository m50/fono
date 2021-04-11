import React from 'react';
import { Router } from '@reach/router';
import { SocketContext } from 'hooks/useSocket';
import Home from './pages';
import './styles/tailwind.css';

function App() {
  return (
    <SocketContext.Provider value={{}}>
      <Router>
        <Home path="/" />
      </Router>
    </SocketContext.Provider>
  );
}

export default App;

