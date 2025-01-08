import { useState } from 'react';
import useDataState from './useDataState.jsx';
import 'react-science/styles/preflight.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './global.css';
import InstrumentTable from './InstrumentTable.jsx';
import FilesTable from './FilesTable.jsx';

function App() {
  const [count, setCount] = useState(0);

  // fetch data from the backend
  const data = useDataState();

  return (
    <>
      <h2>Backend Data</h2>
      <InstrumentTable />
      <FilesTable />
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
