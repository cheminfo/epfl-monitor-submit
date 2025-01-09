import 'react-science/styles/preflight.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './global.css';
import InstrumentTable from './InstrumentTable.jsx';
import FilesTable from './FilesTable.jsx';
import Query from './Query.jsx';
import DebugViewState from './DebugViewState.jsx';
import DebugDataState from './DebugDataState.jsx';
import { useEffect } from 'react';
import getState from './getState.jsx';
import Form from './form/Form.jsx';
import DebugTempState from './DebugTempState.jsx';

function App() {
  const state = getState();

  // the first time I need to load the stats from the backend
  useEffect(() => {
    fetch('http://127.0.0.1:50107/v1/stats')
      .then((res) => res.json())
      .then((data) => {
        state.data.stats.value = data;
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://127.0.0.1:50107/v1/stats')
        .then((res) => res.json())
        .then((data) => {
          state.data.stats.value = data;
        });
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Form />
      <h2>Backend Data</h2>
      <InstrumentTable />
      <Query />
      <FilesTable />
      <DebugTempState />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <h3>Debug Data State</h3>
          <DebugDataState />
        </div>
        <div style={{ width: '50%' }}>
          <h3>Debug View State</h3>
          <DebugViewState />
        </div>
      </div>
    </>
  );
}

export default App;
