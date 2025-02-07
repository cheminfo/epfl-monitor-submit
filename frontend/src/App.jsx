import styled from '@emotion/styled';
import { EvolutionPerYearChart } from './charts/EvolutionPerYearChart.jsx';
import { FilesStatusChart } from './charts/FilesStatusChart.jsx';
import { Header } from './header/Header.jsx';
import { InstrumentTable } from './data/InstrumentTable.jsx';
import { Files } from './data/Files.jsx';

const Body = styled.div`
  display: grid;
  height: 100vh;
  overflow: hidden; /* hide the scrollbar */
  grid-template-rows: 40px repeat(11, 1fr);
  grid-template-columns: repeat(12, 1fr);
  grid-template-areas:
    'hd hd hd hd hd hd hd hd hd hd hd hd' /* hd: header */
    'in in in in in in fi fi fi fi fi fi' /* in: instrument / fi: files */
    'in in in in in in fi fi fi fi fi fi'
    'in in in in in in fi fi fi fi fi fi'
    'in in in in in in fi fi fi fi fi fi'
    'in in in in in in fi fi fi fi fi fi'
    'in in in in in in fi fi fi fi fi fi'
    'c1 c1 c1 c1 c1 c1 c2 c2 c2 c2 c2 c2' /* c1: status of files / c2: evolution over years */
    'c1 c1 c1 c1 c1 c1 c2 c2 c2 c2 c2 c2'
    'c1 c1 c1 c1 c1 c1 c2 c2 c2 c2 c2 c2'
    'c1 c1 c1 c1 c1 c1 c2 c2 c2 c2 c2 c2'
    'c1 c1 c1 c1 c1 c1 c2 c2 c2 c2 c2 c2';
`;

function App() {
  // the first time I need to load the stats from the backend

  return (
    <Body>
      <Header gridArea="hd" />
      <InstrumentTable gridArea="in" />
      <Files gridArea="fi" />
      <FilesStatusChart gridArea="c1" />
      <EvolutionPerYearChart gridArea="c2" />
    </Body>
  );
}

export default App;
