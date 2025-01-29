import { ResponsivePie } from '@nivo/pie';
import { state } from '../getState.jsx';
import { getColorFromStatus } from '../data/getColorFromStatus.js';

export function Pie() {
  const data = state.data.stats.value?.result?.statuses || [];

  return (
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
        state.view.query.value = e.data.query;
      }}
    />
  );
}
