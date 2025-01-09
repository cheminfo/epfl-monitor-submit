import 'react-science/styles/preflight.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './global.css';
import InstrumentTable from './InstrumentTable.jsx';
import FilesTable from './FilesTable.jsx';
import Query from './Query.jsx';
import DebugViewState from './debug/DebugViewState.jsx';
import DebugDataState from './debug/DebugDataState.jsx';
import { useEffect } from 'react';
import { state } from './getState.jsx';
import Test from './test/Test.jsx';
import { Section } from '@blueprintjs/core';

function App() {
  // the first time I need to load the stats from the backend
  useEffect(() => {
    function getStats() {
      fetch('http://127.0.0.1:50107/v1/stats')
        .then((res) => res.json())
        .then((data) => {
          state.data.stats.value = data;
        });
    }
    getStats();
    const interval = setInterval(getStats, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Test />
      <InstrumentTable />
      <Section title="List of files">
        <Query />
        <FilesTable />
      </Section>
      <Section title="Debug information">
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
      </Section>
    </>
  );
}

export default App;
