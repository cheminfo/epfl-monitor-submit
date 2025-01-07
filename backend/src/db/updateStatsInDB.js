import { setMeta } from './setMeta.js';
/**
 * Update stats and save the result in meta
 * @param {InstanceType<import('better-sqlite3')>} db
 */
export function updateStatsInDB(db) {
  const stats = {
    lastUpdate: Date.now(),
  };

  stats.nbFiles = getOneStat(db, 'files', 'md5', '1=1');

  // retrieve distinct instruments based on files.instrument
  stats.instruments = db
    .prepare('SELECT DISTINCT(instrument) AS name FROM files')
    .all();

  stats.statuses = db
    .prepare('SELECT DISTINCT(status) AS name FROM files')
    .all();

  for (const instrument of stats.instruments) {
    for (const status of stats.statuses) {
      instrument[status.name] = {
        ...getOneStat(
          db,
          'files',
          'md5',
          `instrument = '${instrument.name}' AND status = '${status.name}'`,
        ),
        query: `instrument:${instrument.name} status:${status.name}`,
      };
    }
  }
  for (let i = 0; i < stats.statuses.length; i++) {
    const status = stats.statuses[i];
    stats.statuses[i] = {
      name: status.name,
      ...getOneStat(db, 'files', 'md5', `status = '${status.name}'`),
      query: `status:${status.name}`,
    };
  }
  stats.perYears = getPerYears(db);
  stats.perMonths = getPerMonths(db);
  setMeta(db, 'stats', stats);
  return stats;
}

function getPerYears(db) {
  const stmtYears = db.prepare(
    `
    SELECT 
      COUNT(md5) as count,
      SUM(CASE WHEN status = 'to_process' THEN 1 ELSE 0 END) as toProcess, 
      SUM(CASE WHEN status = 'processed' THEN 1 ELSE 0 END) as processed, 
      SUM(CASE WHEN status = 'errored' THEN 1 ELSE 0 END) as errored, 
      CAST(strftime('%Y', lastModified/1000, 'unixepoch') AS INTEGER) as year,
      CAST(strftime('%s', strftime('%Y-01-01', lastModified/1000, 'unixepoch')) AS INTEGER) * 1000 as firstDayOfYearEpoch
    FROM files
    GROUP BY year
    ORDER BY lastModified ASC
    `,
  );
  const perYears = stmtYears.all();
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
  const stmtMonths = db.prepare(
    `
    SELECT 
      COUNT(md5) as count,
      SUM(CASE WHEN status = 'to_process' THEN 1 ELSE 0 END) as toProcess, 
      SUM(CASE WHEN status = 'processed' THEN 1 ELSE 0 END) as processed, 
      SUM(CASE WHEN status = 'errored' THEN 1 ELSE 0 END) as errored,       CAST(strftime('%m', lastModified/1000, 'unixepoch') -1 AS INTEGER) as month,
      CAST(strftime('%s', strftime('%Y-%m-01', lastModified/1000, 'unixepoch')) AS INTEGER) * 1000 as firstDayOfMonthEpoch
    FROM files
    WHERE lastModified / 1000 >= CAST( strftime('%s', 'now', '-12 months') AS INTEGER )
    GROUP BY month
    ORDER BY lastModified ASC
    `,
  );
  const perMonths = stmtMonths.all();
  // need to add missing months
  const now = new Date();
  let month = now.getMonth();
  let year = now.getFullYear();
  for (let i = 0; i < 12; i++) {
    month = (month + 11) % 12;
    if (month === 11) {
      year--;
    }
    // use rather find
    if (!perMonths.some((entry) => entry.month === month)) {
      perMonths.push({
        count: 0,
        toProcess: 0,
        processed: 0,
        errored: 0,
        countOtherNuclei: 0,
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
  const stmt = db.prepare(
    `SELECT COUNT(${uniqueField}) as count FROM ${table} WHERE ${query}`,
  );
  const stmtPeriod = db.prepare(
    `SELECT COUNT(${uniqueField}) as count FROM ${table} WHERE ${query} and lastModified >= ?`,
  );
  return {
    total: stmt.get().count,
    last12Months: stmtPeriod.get(twelveMonthsAgoTimestamp).count,
    lastMonth: stmtPeriod.get(oneMonthAgoTimestamp).count,
  };
}
