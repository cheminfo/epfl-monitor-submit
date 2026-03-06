import { Section } from '@blueprintjs/core';
import { Table, createTableColumnHelper } from 'react-science/ui';

import { state } from '../state/state.js';

import { getColorFromStatus } from './getColorFromStatus.js';

export function InstrumentTable(props) {
  const { gridArea } = props;

  const statsSignal = state.data.stats;
  const querySignal = state.view.query;
  const columnHelper = createTableColumnHelper();
  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: true,
      cell: ({ getValue }) => (
        <a
          onClick={() => {
            return (querySignal.value = `instrument:${getValue()}`);
          }}
        >
          {getValue()}
        </a>
      ),
    }),
    columnHelper.accessor(`processed.${state.preferences.range.value}`, {
      header: 'Processed',
      enableSorting: true,
      cell: ({ getValue, row }) => getClickableCell(getValue, row, 'processed'),
    }),
    columnHelper.accessor(`to_process.${state.preferences.range.value}`, {
      header: 'To process',
      enableSorting: true,
      cell: ({ getValue, row }) =>
        getClickableCell(getValue, row, 'to_process'),
    }),
    columnHelper.accessor(`errored.${state.preferences.range.value}`, {
      header: 'Errored',
      enableSorting: true,
      cell: ({ getValue, row }) => getClickableCell(getValue, row, 'errored'),
    }),
  ];

  return (
    <Section
      title="The list of instruments"
      style={{ gridArea, overflow: 'auto' }}
    >
      <Table
        bordered
        compact
        interactive={false}
        striped={false}
        stickyHeader
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
        return (state.view.query.value = `status:${key} instrument:${row.original.name}`);
      }}
    >
      {getValue()}
    </div>
  );
}
