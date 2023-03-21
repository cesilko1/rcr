import logo from './logo.svg';
import './App.css';
import { useFetchApi } from 'rcr';

const fetcher = async (data: string): Promise<string> => {
  throw new Error("error");
}

function App() {
  const request = useFetchApi(fetcher, {
  }, "sdfsdf");


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {request.loading}
        </a>
      </header>
    </div>
  );
}

export default App;
