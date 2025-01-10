import {
  createTableColumnHelper,
  Table,
  ValueRenderers,
} from 'react-science/ui';
import { useSignals } from '@preact/signals-react/runtime';
import { state } from './getState.jsx';
import { Section } from '@blueprintjs/core';
import { getColorFromStatus } from './files/getColorFromStatus.js';

export function InstrumentTable() {
  const statsSignal = state.data.stats;
  const querySignal = state.view.query;
  useSignals();
  const columnHelper = createTableColumnHelper();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: true,
      cell: ({ getValue }) => (
        <a
          onClick={() => {
            return (querySignal.value = 'instrument:' + getValue());
          }}
        >
          {getValue()}
        </a>
      ),
    }),
    columnHelper.accessor('processed.' + state.view.range.value, {
      header: 'Processed',
      enableSorting: true,
      cell: ({ getValue, row }) => getClickableCell(getValue, row, 'processed'),
    }),
    columnHelper.accessor('to_process.' + state.view.range.value, {
      header: 'To process',
      enableSorting: true,
      cell: ({ getValue, row }) =>
        getClickableCell(getValue, row, 'to_process'),
    }),
    columnHelper.accessor('errored.' + state.view.range.value, {
      header: 'Errored',
      enableSorting: true,
      cell: ({ getValue, row }) => getClickableCell(getValue, row, 'errored'),
    }),
  ];

  return (
    <Section title="The list of instruments">
      <Table
        bordered={true}
        compact={true}
        interactive={false}
        striped={false}
        stickyHeader={true}
        columns={columns}
        virtualizeRows={false}
        data={statsSignal.value.result?.instruments || []}
      />
    </Section>
  );
}

function getClickableCell(getValue, row, key) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        backgroundColor:
          getValue() > 0 ? getColorFromStatus(key) : 'transparent',
      }}
      onClick={() => {
        return (state.view.query.value =
          'status:' + key + ' instrument:' + row.original.name);
      }}
    >
      {getValue()}
    </div>
  );
}
