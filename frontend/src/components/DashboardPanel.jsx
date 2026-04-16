import { HTMLTable } from '@blueprintjs/core';

import { EvolutionPerYearChart } from '../charts/EvolutionPerYearChart.jsx';
import { FilesStatusChart } from '../charts/FilesStatusChart.jsx';
import {
  getBackgroundFromStatus,
  getColorFromStatus,
} from '../data/getColorFromStatus.js';
import { state } from '../state/state.js';

const STATUS_ORDER = ['processed', 'to_process', 'errored'];

const STATUS_LABELS = {
  processed: 'Processed',
  // eslint-disable-next-line camelcase
  to_process: 'To process',
  errored: 'Errored',
};

export function DashboardPanel(props) {
  const { onNavigateToFiles } = props;
  const stats = state.data.stats.value?.result;
  const range = state.preferences.range.value;

  const statuses = stats?.statuses || [];
  const instruments = stats?.instruments || [];

  const total = statuses.reduce((sum, status) => sum + (status[range] || 0), 0);

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Summary cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 28,
        }}
      >
        <SummaryCard
          label="Total"
          count={total}
          dark
          onClick={() => onNavigateToFiles('')}
        />
        {STATUS_ORDER.map((statusKey) => {
          const statusData = statuses.find((s) => s.name === statusKey);
          return (
            <SummaryCard
              key={statusKey}
              label={STATUS_LABELS[statusKey]}
              count={statusData?.[range] || 0}
              color={getColorFromStatus(statusKey, { light: false })}
              background={getBackgroundFromStatus(statusKey)}
              onClick={() => onNavigateToFiles(`status:${statusKey}`)}
            />
          );
        })}
      </div>

      {/* Instruments table */}
      <div style={{ marginBottom: 28 }}>
        <SectionTitle>Instruments</SectionTitle>
        <div style={tableWrapperStyle}>
          <HTMLTable style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={thStyle}>Name</th>
                {STATUS_ORDER.map((statusKey) => (
                  <th
                    key={statusKey}
                    style={{ ...thStyle, textAlign: 'center' }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: getColorFromStatus(statusKey, {
                          light: false,
                        }),
                        marginRight: 6,
                      }}
                    />
                    {STATUS_LABELS[statusKey]}
                  </th>
                ))}
                <th style={{ ...thStyle, textAlign: 'center' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {instruments.map((instrument) => {
                const instrumentTotal = STATUS_ORDER.reduce(
                  (sum, key) => sum + (instrument[key]?.[range] || 0),
                  0,
                );
                return (
                  <tr key={instrument.name}>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                      <a
                        style={{ cursor: 'pointer', color: '#2b6cb0' }}
                        onClick={() =>
                          onNavigateToFiles(`instrument:${instrument.name}`)
                        }
                      >
                        {instrument.name}
                      </a>
                    </td>
                    {STATUS_ORDER.map((statusKey) => (
                      <td key={statusKey} style={tdCenterStyle}>
                        <CellValue
                          value={instrument[statusKey]?.[range] || 0}
                          status={statusKey}
                          onClick={() =>
                            onNavigateToFiles(
                              `status:${statusKey} instrument:${instrument.name}`,
                            )
                          }
                        />
                      </td>
                    ))}
                    <td
                      style={{
                        ...tdCenterStyle,
                        fontWeight: 700,
                      }}
                    >
                      {instrumentTotal}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </HTMLTable>
        </div>
      </div>

      {/* Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        <div style={{ ...chartWrapperStyle, height: 400 }}>
          <FilesStatusChart onNavigateToFiles={onNavigateToFiles} />
        </div>
        <div style={{ ...chartWrapperStyle, height: 400 }}>
          <EvolutionPerYearChart />
        </div>
      </div>
    </div>
  );
}

function SummaryCard(props) {
  const { label, count, color, background, dark, onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{
        background: dark ? '#1e293b' : background || '#f8fafc',
        border: dark ? 'none' : `1px solid ${color || '#e2e8f0'}20`,
        borderRadius: 10,
        padding: '14px 16px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'transform 0.1s, box-shadow 0.1s',
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = 'translateY(-2px)';
        event.currentTarget.style.boxShadow = dark
          ? '0 4px 12px rgba(0,0,0,0.15)'
          : '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = '';
        event.currentTarget.style.boxShadow = '';
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          color: dark ? 'rgba(255,255,255,0.8)' : color || '#64748b',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          marginTop: 2,
          color: dark ? '#fff' : color || '#1e293b',
        }}
      >
        {count}
      </div>
    </div>
  );
}

function SectionTitle(props) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        color: '#475569',
        marginBottom: 10,
      }}
    >
      {props.children}
    </div>
  );
}

function CellValue(props) {
  const { value, status, onClick } = props;
  if (value === 0) {
    return <span style={{ color: '#d1d5db' }}>0</span>;
  }
  return (
    <span
      style={{
        color: getColorFromStatus(status, { light: false }),
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {value}
    </span>
  );
}

const thStyle = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.3,
  color: '#64748b',
  padding: '8px 10px',
  borderBottom: '2px solid #e2e8f0',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '8px 10px',
  fontSize: 13,
  borderBottom: '1px solid #f1f5f9',
};

const tdCenterStyle = {
  ...tdStyle,
  textAlign: 'center',
};

const tableWrapperStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  overflow: 'hidden',
};

const chartWrapperStyle = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  padding: 16,
};
