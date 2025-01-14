import 'react-science/styles/preflight.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './global.css';
import styled from '@emotion/styled';
import { InstrumentTable } from './InstrumentTable.jsx';
import { useEffect } from 'react';
import { state } from './getState.jsx';
import { Test } from './test/Test.jsx';
import { Files } from './files/Files.jsx';
import { Debug } from './debug/Debug.jsx';
import { Charts } from './charts/Charts.jsx';
import { SelectRange } from './files/SelectRange.jsx';

const Container = styled.div`
  padding: 10px 20px;
  background-color: #f5f5f5;
  //height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1000px) {
    padding: 5px;
    height: auto;
    overflow: auto;
  }
`;

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
    <Container>
      <Test />
      <SelectRange />
      <div style={{ display: 'flex' }}>
        <InstrumentTable />
        <Files />
      </div>
      <Charts />
      <Debug />
    </Container>
  );
}

export default App;
