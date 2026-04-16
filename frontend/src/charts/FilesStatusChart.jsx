import { ResponsivePie } from '@nivo/pie';

import { getColorFromStatus } from '../data/getColorFromStatus.js';
import { state } from '../state/state.js';

export function FilesStatusChart(props) {
  const { onNavigateToFiles } = props;
  const data = state.data.stats.value?.result?.statuses || [];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          textAlign: 'center',
          color: '#475569',
          padding: '4px 0',
        }}
      >
        Status of the files
      </div>
      <div style={{ flex: 1 }}>
        <ResponsivePie
          data={data}
          id="name"
          value={state.preferences.range.value}
          margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
          activeOuterRadiusOffset={8}
          colors={[
            getColorFromStatus('processed'),
            getColorFromStatus('errored'),
            getColorFromStatus('to_process'),
          ]}
          onClick={(e) => {
            if (onNavigateToFiles) {
              onNavigateToFiles(e.data.query);
            } else {
              state.view.query.value = e.data.query;
            }
          }}
        />
      </div>
    </div>
  );
}
