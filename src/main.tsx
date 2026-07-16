import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
} from 'react-router-dom';

import { AuthProvider } from './modules/auth/context/AuthContext';

import './assets/styles/variables.css';
import './assets/styles/reset.css';
import './assets/styles/globals.css';

import App from './App';

ReactDOM.createRoot(
  document.getElementById('root')!,
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);