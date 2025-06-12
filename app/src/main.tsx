import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Page';
import RootLayout from './components/RootLayout';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RootLayout>
      <Home />
    </RootLayout>
  </React.StrictMode>,
);
