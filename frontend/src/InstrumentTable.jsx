import {
  createTableColumnHelper,
  Table,
  ValueRenderers,
} from 'react-science/ui';
import { useSignals } from '@preact/signals-react/runtime';
import { state } from './getState.jsx';
import { Section } from '@blueprintjs/core';

export function InstrumentTable() {
  const statsSignal = state.data.stats;
  const querySignal = state.view.query;
  useSignals();
  const columnHelper = createTableColumnHelper();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: true,
      sortingFn: 'auto',
      cell: ({ getValue }) => (
        <a
          onClick={() => {
            return (querySignal.value = 'instrument:' + getValue());
          }}
        >
          {getValue()}
        </a>
      ),
      meta: { color: 'yellow', width: 400 },
    }),
    columnHelper.accessor('processed.lastMonth', {
      header: 'Processed Last Month',
      enableSorting: true,
      sortingFn: 'auto',
      cell: ({ getValue, row }) => getClickableCell(getValue, row, 'processed'),
      meta: {
        color: 'lightblue',
        width: 200,
      },
    }),
    columnHelper.accessor('to_process.lastMonth', {
      header: 'To process',
      enableSorting: true,
      sortingFn: 'auto',
      cell: ({ getValue, row }) =>
        getClickableCell(getValue, row, 'to_process'),
      meta: {
        color: 'lightblue',
        width: 200,
      },
    }),
    columnHelper.accessor('errored.lastMonth', {
      header: 'Errored',
      enableSorting: true,
      sortingFn: 'auto',
      cell: ({ getValue, row }) => getClickableCell(getValue, row, 'errored'),
      meta: {
        color: 'lightblue',
        width: 200,
      },
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
      style={{ width: '100%', height: '100%', cursor: 'pointer' }}
      onClick={() => {
        return (state.view.query.value =
          'status:' + key + ' instrument:' + row.original.name);
      }}
    >
      {getValue()}
    </div>
  );
}
