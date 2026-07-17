import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  BrowserRouter,
} from 'react-router-dom';

import {
  RealtimeProvider,
} from './app/realtime/RealtimeContext';

import {
  AuthProvider,
} from './modules/auth/context/AuthContext';

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
        <RealtimeProvider>
          <App />
        </RealtimeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);