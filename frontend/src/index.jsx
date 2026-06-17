import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { hydrateFromBackend } from './services/storeSync';
import './assets/styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Load persisted data from the backend database (if running) into localStorage
// first, then render. If the backend is unreachable, render anyway using
// whatever is already stored locally.
hydrateFromBackend().finally(renderApp);
