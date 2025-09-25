import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AppProviders } from './providers/AppProviders';
import './index.css';

// Start MSW in development when enabled
const shouldEnableMocks =
  import.meta.env.DEV && import.meta.env.VITE_ENABLE_API_MOCKS !== 'false';

if (shouldEnableMocks) {
  // Clear problematic cookies that might cause MSW serialization issues
  try {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name && !/^[a-zA-Z0-9_-]+$/.test(name)) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
  } catch (error) {
    console.warn('Cookie cleanup failed:', error);
  }

  import('./services/api/mocks/browser').then(({ worker }) => {
    worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false,
    }).catch((error) => {
      console.warn('Failed to start MSW worker:', error);
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  </React.StrictMode>
);