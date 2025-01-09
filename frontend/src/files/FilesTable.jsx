import { createTableColumnHelper, Table } from 'react-science/ui';

import { useSignals } from '@preact/signals-react/runtime';
import { state } from '../getState.jsx';
import { getColorFromStatus } from './getColorFromStatus.js';

export function FilesTable() {
  useSignals();
  const filesSignal = state.view.files;

  const columnHelper = createTableColumnHelper();
  const columns = [
    columnHelper.accessor('lastModified', {
      header: 'Date',
      enableSorting: true,
      cell: ({ getValue }) =>
        new Date(getValue())
          .toISOString()
          .replace('T', ' ')
          .replace(/\..*/, ''),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor('instrument', {
      header: 'Instrument',
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      enableSorting: true,
      cell: ({ getValue }) => getValue(),
    }),
  ];

  return (
    <div>
      <Table
        bordered={true}
        compact={true}
        interactive={false}
        striped={false}
        stickyHeader={true}
        renderRowTr={(trProps, row) => {
          // transparent by default
          let color = getColorFromStatus(row.original.status);
          return <tr {...trProps} style={{ backgroundColor: color }} />;
        }}
        columns={columns}
        virtualizeRows={false}
        data={filesSignal.value?.result || []}
      />
    </div>
  );
}
