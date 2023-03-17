import React from 'react';
import ReactDOM from 'react-dom/client';

// import { RCR } from './components';
import { useFetchApi } from '../dist';
import { testApi } from './api';

const App = () => {
  const request = useFetchApi(testApi);

  return (
    // <RCR>
      <div>
        xxx
      </div>
    // </RCR>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
