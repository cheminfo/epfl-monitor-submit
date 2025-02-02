import { createTableColumnHelper, Table } from 'react-science/ui';

import { state } from '../state.js';
import { getColorFromStatus } from './getColorFromStatus.js';

import { myToaster } from '../myToaster.js';
import { getBackendURL } from '../utils/getBackendURL.js';

export function FilesTable() {
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
    columnHelper.accessor('md5', {
      header: 'Download',
      enableSorting: false,
      cell: ({ getValue }) => (
        <a href={getBackendURL() + `/v1/getFile?md5=${getValue()}`} download>
          ⤓
        </a>
      ),
    }),
    columnHelper.accessor('moveToProcess', {
      header: 'Move to to_process',
      enableSorting: false,
      cell: ({ getValue, row }) =>
        row.original.status !== 'to_process' && (
          <a
            href={
              getBackendURL() +
              `/v1/moveFile?md5=${getValue()}&targetFolder=to_process`
            }
          >
            <span
              style={{
                color: getColorFromStatus('to_process', { light: false }),
              }}
            >
              ⇥
            </span>
          </a>
        ),
    }),
    columnHelper.accessor('moveToErrored', {
      header: 'Move to errored',
      enableSorting: false,
      cell: ({ getValue, row }) =>
        // create a clickable div that use the full space of the cell and call moveFile function
        row.original.status !== 'errored' && (
          <div
            style={{ width: '100%', height: '100%', cursor: 'pointer' }}
            onClick={() => moveFile(row, 'errored')}
          >
            <span
              style={{ color: getColorFromStatus('errored', { light: false }) }}
            >
              ⇥
            </span>
          </div>
        ),
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
        tableProps={{
          style: { width: '100%', tableLayout: 'fixed' },
        }}
        renderRowTr={(trProps, row) => {
          // transparent by default
          let color = getColorFromStatus(row.original.status);
          return (
            <tr
              key={row.original.md5}
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
    getBackendURL() +
      `/v1/moveFile?md5=${row.original.md5}&targetFolder=${targetFolder}`,
  );
  const data = await response.json();
  if (data.status === 'ok') {
    // show a message
    myToaster.show({ message: 'File moved', intent: 'success' });
    // need to trigger a refresh of the files by changing query string
    state.view.query.peek();
  } else {
    // show an error message
    myToaster.show({ message: data.message, intent: 'danger' });
  }
}
