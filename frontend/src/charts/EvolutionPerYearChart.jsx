import { Card } from '@blueprintjs/core';
import { ResponsiveBar } from '@nivo/bar';

import { getColorFromStatus } from '../data/getColorFromStatus.js';
import { state } from '../state/state.js';

export function EvolutionPerYearChart(props) {
  const { gridArea } = props;
  const data = state.data.stats.value?.result?.perMonths || [];

  return (
    <Card style={{ gridArea }}>
      <div
        style={{
          fontSize: '1.1em',
          fontWeight: 600,
          textAlign: 'center',
          color: '#5c7080',
          padding: '4px 0',
        }}
      >
        Evolution over the past year
      </div>
      <ResponsiveBar
        data={data}
        keys={['errored', 'processed', 'toProcess']}
        colors={[
          getColorFromStatus('errored'),
          getColorFromStatus('processed'),
          getColorFromStatus('toProcess'),
        ]}
        indexBy="month"
        margin={{ top: 10, right: 30, bottom: 90, left: 60 }}
        padding={0.3}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          legend: 'Month',
          legendPosition: 'middle',
          legendOffset: 35,
          truncateTickAt: 0,
          format: (v) => v + 1,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          tickValues: 5,
          legend: 'Nb files',
          legendPosition: 'middle',
          legendOffset: -50,
          format: (v) => (v > 1000 ? `${v / 1000}k` : v),
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 75,
            itemsSpacing: 2,
            itemWidth: 100,
            symbolSpacing: 5,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
          },
        ]}
      />
    </Card>
  );
}
