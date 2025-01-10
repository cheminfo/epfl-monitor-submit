import { ResponsivePie } from '@nivo/pie';
import { useSignals } from '@preact/signals-react/runtime';
import { state } from '../getState.jsx';

export function Pie() {
  useSignals();

  const data = state.data.stats.value?.result?.statuses || [];

  return (
    <ResponsivePie
      data={data}
      id="name"
      value={state.view.range.value}
      margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
      activeOuterRadiusOffset={8}
      colors={['lightgreen', 'pink', 'lightyellow']}
      onClick={(e) => {
        state.view.query.value = e.data.query;
      }}
    />
  );
}
