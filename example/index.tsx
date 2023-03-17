import * as React from 'react';
import { createRoot } from "react-dom";

import { RCR } from './components';

const App = () => {
  return (
    <div>
      xxx
    </div>
  );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<RCR><App /></RCR>);
