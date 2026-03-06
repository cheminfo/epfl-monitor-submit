import { setMeta } from './setMeta.js';

/**
 * Update stats and save the result in meta
 * @param {import('./getDB.js').DB} db - the database instance
 * @returns {object} - object containing the stats
 */
export function updateStatsInDB(db) {
  // retrieve distinct instruments based on files.instrument
  const instruments = db.selectDistinctInstruments.all();

  const rawStatuses = db.selectDistinctStatuses.all();

  for (const instrument of instruments) {
    for (const status of rawStatuses) {
      instrument[status.name] = {
        ...getOneStat(
          db,
          'files',
          'hash',
          `instrument = '${instrument.name}' AND status = '${status.name}'`,
        ),
        query: `instrument:${instrument.name} status:${status.name}`,
      };
    }
  }

  const statuses = rawStatuses.map((status) => ({
    name: status.name,
    ...getOneStat(db, 'files', 'hash', `status = '${status.name}'`),
    query: `status:${status.name}`,
  }));

  const stats = {
    lastUpdate: Date.now(),
    nbFiles: getOneStat(db, 'files', 'hash', '1=1'),
    instruments,
    statuses,
    perYears: getPerYears(db),
    perMonths: getPerMonths(db),
  };

  setMeta(db, 'stats', stats);
  return stats;
}

function getPerYears(db) {
  const perYears = db
    .statement(
      `
    SELECT
      COUNT(hash) as count,
      SUM(CASE WHEN status = 'to_process' THEN 1 ELSE 0 END) as toProcess,
      SUM(CASE WHEN status = 'processed' THEN 1 ELSE 0 END) as processed,
      SUM(CASE WHEN status = 'errored' THEN 1 ELSE 0 END) as errored,
      CAST(strftime('%Y', lastModified/1000, 'unixepoch') AS INTEGER) as year,
      CAST(strftime('%s', strftime('%Y-01-01', lastModified/1000, 'unixepoch')) AS INTEGER) * 1000 as firstDayOfYearEpoch
    FROM files
    GROUP BY year
    ORDER BY lastModified ASC
    `,
    )
    .all();
  //need to find first year and add missing years till current year
  const now = new Date();
  const currentYear = now.getFullYear();
  // Max 10 years
  const firstYear = Math.max(
    currentYear - 10,
    perYears.length > 0 ? perYears[0].year : currentYear,
  );
  for (let year = firstYear; year <= now.getFullYear(); year++) {
    if (!perYears.some((entry) => entry.year === year)) {
      perYears.push({
        count: 0,
        toProcess: 0,
        processed: 0,
        errored: 0,
        year,
        firstDayOfYearEpoch: new Date(year, 0, 1).getTime(),
      });
    }
  }
  perYears.sort((a, b) => a.firstDayOfYearEpoch - b.firstDayOfYearEpoch);
  return perYears;
}

function getPerMonths(db) {
  const perMonths = db
    .statement(
      `
    SELECT
      COUNT(hash) as count,
      SUM(CASE WHEN status = 'to_process' THEN 1 ELSE 0 END) as toProcess,
      SUM(CASE WHEN status = 'processed' THEN 1 ELSE 0 END) as processed,
      SUM(CASE WHEN status = 'errored' THEN 1 ELSE 0 END) as errored,       CAST(strftime('%m', lastModified/1000, 'unixepoch') -1 AS INTEGER) as month,
      CAST(strftime('%s', strftime('%Y-%m-01', lastModified/1000, 'unixepoch')) AS INTEGER) * 1000 as firstDayOfMonthEpoch
    FROM files
    WHERE lastModified / 1000 >= CAST( strftime('%s', 'now', '-12 months') AS INTEGER )
    GROUP BY month
    ORDER BY lastModified ASC
    `,
    )
    .all();
  // need to add missing months
  const now = new Date();
  let month = now.getMonth();
  let year = now.getFullYear();
  for (let i = 0; i < 12; i++) {
    month = (month + 11) % 12;
    const currentMonth = month;
    if (month === 11) {
      year--;
    }
    if (!perMonths.some((entry) => entry.month === currentMonth)) {
      perMonths.push({
        count: 0,
        toProcess: 0,
        processed: 0,
        errored: 0,
        month,
        firstDayOfMonthEpoch: new Date(year, month, 1).getTime(),
      });
    }
  }
  perMonths.sort((a, b) => a.firstDayOfMonthEpoch - b.firstDayOfMonthEpoch);
  return perMonths;
}

function getOneStat(db, table, uniqueField, query) {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const twelveMonthsAgoTimestamp = twelveMonthsAgo.getTime();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneMonthAgoTimestamp = oneMonthAgo.getTime();
  const stmt = db.statement(
    `SELECT COUNT(${uniqueField}) as count FROM ${table} WHERE ${query}`,
  );
  const stmtPeriod = db.statement(
    `SELECT COUNT(${uniqueField}) as count FROM ${table} WHERE ${query} and lastModified >= ?`,
  );
  return {
    total: stmt.get().count,
    last12Months: stmtPeriod.get(twelveMonthsAgoTimestamp).count,
    lastMonth: stmtPeriod.get(oneMonthAgoTimestamp).count,
  };
}
