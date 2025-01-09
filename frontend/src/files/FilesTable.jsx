import { createTableColumnHelper, Table } from 'react-science/ui';

import { useSignals } from '@preact/signals-react/runtime';
import { state } from '../getState.jsx';

export default function FilesTable() {
  useSignals();
  const filesSignal = state.view.files;

  const columnHelper = createTableColumnHelper();
  const columns = [
    columnHelper.accessor('lastModified', {
      header: 'Date',
      enableSorting: true,
      sortingFn: 'auto',
      cell: ({ getValue }) =>
        new Date(getValue())
          .toISOString()
          .replace('T', ' ')
          .replace(/\..*/, ''),
      meta: { color: 'yellow', width: 400 },
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: true,
      sortingFn: 'auto',
      cell: ({ getValue }) => getValue(),
      meta: { color: 'yellow', width: 400 },
    }),
    columnHelper.accessor('instrument', {
      header: 'Instrument',
      enableSorting: true,
      sortingFn: 'auto',
      cell: ({ getValue }) => getValue(),
      meta: { color: 'yellow', width: 400 },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
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
    <div>
      <Table
        bordered={true}
        compact={true}
        interactive={false}
        striped={false}
        stickyHeader={true}
        renderRowTr={(trProps, row) => {
          // transparent by default
          let color = 'transparent';
          switch (row.original.status) {
            case 'to_process':
              color = 'lightyellow';
              break;
            case 'errored':
              color = 'pink';
              break;
            case 'processed':
              color = 'lightgreen';
              break;
            default:
              break;
          }
          return <tr {...trProps} style={{ backgroundColor: color }} />;
        }}
        columns={columns}
        virtualizeRows={false}
        data={filesSignal.value?.result || []}
      />
    </div>
  );
}
