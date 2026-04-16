import { Table, createTableColumnHelper } from 'react-science/ui';

import { state } from '../state/state.js';
import { getBackendURL } from '../utils/getBackendURL.js';
import { topMessage } from '../utils/topMessage.js';

import { getColorFromStatus } from './getColorFromStatus.js';

export function FilesTable() {
  const filesSignal = state.view.files;

  const columnHelper = createTableColumnHelper();
  const columns = [
    columnHelper.accessor('lastModified', {
      header: 'Date',
      enableSorting: true,
      size: 140,
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
      cell: ({ getValue }) => {
        const status = getValue();
        const color = getColorFromStatus(status, { light: false });
        return (
          <span
            style={{
              color,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 3,
              backgroundColor: getColorFromStatus(status),
            }}
            title={`Filter by ${status}`}
            onClick={(event) => {
              event.stopPropagation();
              const current = state.view.statusFilter.value;
              state.view.statusFilter.value =
                current === status ? null : status;
              state.view.offset.value = 0;
            }}
          >
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor('hash', {
      header: '',
      enableSorting: false,
      size: 40,
      cell: ({ getValue }) => (
        <a
          href={`${getBackendURL()}/v1/getFile?hash=${getValue()}`}
          download
          title="Download"
          style={{ textDecoration: 'none' }}
        >
          ⤓
        </a>
      ),
    }),
    columnHelper.accessor('moveToProcess', {
      header: '',
      enableSorting: false,
      size: 40,
      cell: ({ row }) =>
        row.original.status !== 'to_process' && (
          <div
            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
            title="Reprocess"
            onClick={() => moveFile(row, 'to_process')}
          >
            <span
              style={{
                color: getColorFromStatus('to_process', { light: false }),
              }}
            >
              ↻
            </span>
          </div>
        ),
    }),
    columnHelper.accessor('moveToErrored', {
      header: '',
      enableSorting: false,
      size: 40,
      cell: ({ row }) =>
        row.original.status !== 'errored' && (
          <div
            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
            title="Mark as errored"
            onClick={() => moveFile(row, 'errored')}
          >
            <span
              style={{ color: getColorFromStatus('errored', { light: false }) }}
            >
              ✕
            </span>
          </div>
        ),
    }),
  ];

  return (
    <div>
      <Table
        bordered
        compact
        interactive={false}
        striped={false}
        stickyHeader
        tableProps={{
          style: { width: '100%' },
        }}
        renderRowTr={(trProps, row) => {
          // transparent by default
          let color = getColorFromStatus(row.original.status);
          return (
            <tr
              key={row.original.hash}
              {...trProps}
              style={{ backgroundColor: color }}
            />
          );
        }}
        columns={columns}
        virtualizeRows={false}
        data={filesSignal.value?.result || []}
      />
    </div>
  );
}

// move the file and display the result in a
async function moveFile(row, targetFolder) {
  // make an ajax query to move the file
  const response = await fetch(
    `${getBackendURL()}/v1/moveFile?hash=${row.original.hash}&targetFolder=${targetFolder}`,
  );
  const data = await response.json();
  if (data.status === 'ok') {
    // show a message
    topMessage.show({ message: 'File moved', intent: 'success' });
    // need to trigger a refresh of the files by changing query string
    state.view.query.peek();
  } else {
    // show an error message
    topMessage.show({ message: data.message, intent: 'danger' });
  }
}
