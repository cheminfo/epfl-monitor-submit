import {
  createTableColumnHelper,
  Table,
  ValueRenderers,
} from 'react-science/ui';
import { useSignals } from '@preact/signals-react/runtime';
import { state } from './getState.jsx';
import { Section } from '@blueprintjs/core';

export default function InstrumentTable() {
  const statsSignal = state.data.stats;
  useSignals();
  const columnHelper = createTableColumnHelper();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: true,
      sortingFn: 'auto',
      cell: ({ getValue }) => getValue(),
      meta: { color: 'yellow', width: 400 },
    }),
    columnHelper.accessor('processed.lastMonth', {
      header: 'Processed Last Month',
      enableSorting: true,
      sortingFn: 'auto',
      cell: ({ getValue }) => getValue(),
      meta: {
        color: 'lightblue',
        width: 200,
      },
    }),
    columnHelper.accessor('to_process.lastMonth', {
      header: 'To process',
      enableSorting: true,
      sortingFn: 'auto',
      cell: ({ getValue }) => getValue(),
      meta: {
        color: 'lightblue',
        width: 200,
      },
    }),
    columnHelper.accessor('errored.lastMonth', {
      header: 'Errored',
      enableSorting: true,
      sortingFn: 'auto',
      cell: ({ getValue }) => getValue(),
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
