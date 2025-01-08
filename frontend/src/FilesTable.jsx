import { createTableColumnHelper, Table } from 'react-science/ui';
import useFilesState from './useFilesState.jsx';

export default function FilesTable() {
  const data = useFilesState();
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
    <Table
      bordered={true}
      compact={true}
      interactive={false}
      striped={false}
      stickyHeader={true}
      columns={columns}
      virtualizeRows={false}
      data={data?.result || []}
    />
  );
}
