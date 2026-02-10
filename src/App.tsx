import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import Routing from './components/Routing';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routing />
      </AuthProvider>
    </Router>
  );
}

export default App;
