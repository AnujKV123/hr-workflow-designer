import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './contexts/ToastContext'
import { ToastContainer } from './components/Toast'

// Initialize MSW mock service worker
async function enableMocking() {
  if (import.meta.env.PROD) {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // Start the worker and wait for it to be ready
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
  });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <ToastProvider>
          <App />
          <ToastContainer />
        </ToastProvider>
      </ErrorBoundary>
    </React.StrictMode>,
  );
});
