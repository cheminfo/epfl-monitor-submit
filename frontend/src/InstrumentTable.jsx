import {
  createTableColumnHelper,
  Table,
  ValueRenderers,
} from 'react-science/ui';
import useDataState from './useDataState.jsx';

export default function InstrumentTable() {
  const data = useDataState();
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
    <Table
      bordered={true}
      compact={true}
      interactive={false}
      striped={false}
      stickyHeader={true}
      columns={columns}
      virtualizeRows={false}
      data={data?.result?.instruments || []}
    />
  );
}
