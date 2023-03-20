import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RCR } from './components';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RCR>
      <App />
    </RCR>
  </React.StrictMode>
);

