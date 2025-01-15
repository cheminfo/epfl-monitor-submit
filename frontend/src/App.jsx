import 'react-science/styles/preflight.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import './global.css';
import styled from '@emotion/styled';
import { useEffect } from 'react';
import { state } from './getState.jsx';
import { Charts } from './charts/Charts.jsx';
import { getBackendURL } from './utils/getBackendURL.js';
import { Header } from './header/Header.jsx';
import { DataWrapper } from './data/DataWrapper.jsx';

const Container = styled.div`
  display: grid;
  grid-template-rows: 40px calc((100% - 40px) / 2) calc((100% - 40px) / 2);
  grid-template-columns: 1fr;
  height: 100vh;
  padding: 10px 20px;
  background-color: #f5f5f5;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
  height: 100%;
`;

function App() {
  // the first time I need to load the stats from the backend
  useEffect(() => {
    function getStats() {
      fetch(getBackendURL() + '/v1/stats')
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
      <Header />
      <DataWrapper />
      <Charts />
    </Container>
  );
}

export default App;
