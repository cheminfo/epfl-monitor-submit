import { search } from 'smart-sqlite3-filter';

/**
 * Search for files based on a 'smart' query
 * @param {string} queryString - search query string like 'name:abc'
 * @param {import('./getDB.js').DB} db - the database instance
 * @param {object} [options={}] - object containing the options
 * @param {import('cheminfo-types').Logger} [options.logger] - optional logger that can return valuable debug information
 * @returns {Promise} - promise resolving to an array of files
 */
export async function queryFiles(queryString, db, options = {}) {
  const { logger } = options;
  logger?.info(`Searching for: ${queryString}`);
  const entries = search(queryString, db.db, {
    tableName: 'files',
    orderBy: 'lastModified desc',
    logger,
  });
  return entries;
}

/**
 * Search for files with pagination support
 * @param {string} queryString - search query string like 'name:abc'
 * @param {import('./getDB.js').DB} db - the database instance
 * @param {object} [options={}] - object containing the options
 * @param {number} [options.limit=50] - number of results per page
 * @param {number} [options.offset=0] - offset for pagination
 * @param {import('cheminfo-types').Logger} [options.logger] - optional logger
 * @returns {Promise<{entries: Array, totalCount: number, statusCounts: Record<string, number>}>}
 */
export async function queryFilesPage(queryString, db, options = {}) {
  const { logger, limit = 50, offset = 0 } = options;
  logger?.info(`Searching page for: ${queryString} (limit=${limit}, offset=${offset})`);

  // Get paginated results using smart-sqlite3-filter.
  // We inject LIMIT/OFFSET via the orderBy parameter and disable the default limit.
  const entries = search(queryString, db.db, {
    tableName: 'files',
    orderBy: `lastModified desc LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
    limit: 0,
    logger,
  });

  // Build the same WHERE clause to get counts.
  // We run the query with limit 1 to extract the SQL pattern,
  // then rebuild as COUNT queries.
  const baseQuery = removeStatusFilter(queryString);
  const statusCounts = getStatusCounts(baseQuery, db, logger);
  const totalCount = Object.values(statusCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  return { entries, totalCount, statusCounts };
}

/**
 * Remove status:xxx from a query string to get the base query for counting per status.
 * @param {string} queryString
 * @returns {string}
 */
function removeStatusFilter(queryString) {
  return queryString.replace(/\bstatus:\S+/g, '').trim();
}

/**
 * Get file counts grouped by status for a given base query (without status filter).
 * Uses smart-sqlite3-filter to compute the WHERE clause by running a minimal search,
 * then executes a raw COUNT/GROUP BY query with the same conditions.
 * @param {string} baseQuery - query string without status filter
 * @param {import('./getDB.js').DB} db
 * @param {import('cheminfo-types').Logger} [logger]
 * @returns {Record<string, number>}
 */
function getStatusCounts(baseQuery, db, logger) {
  // Run a search with limit 0 and count the results grouped by status.
  // For efficiency, we build a simple WHERE clause from the query tokens.
  const whereClause = buildWhereClause(baseQuery);
  let sql = `SELECT status, COUNT(*) as count FROM files`;
  if (whereClause.sql) {
    sql += ` WHERE ${whereClause.sql}`;
  }
  sql += ` GROUP BY status`;

  logger?.debug(whereClause.params, `Status count SQL: ${sql}`);

  const stmt = db.db.prepare(sql);
  const rows = stmt.all(whereClause.params);

  const counts = {};
  for (const row of rows) {
    counts[row.status] = row.count;
  }
  return counts;
}

/**
 * Build a simple SQL WHERE clause from a query string.
 * Supports field:value, field:>value, field:>=value, field:<value, field:<=value patterns.
 * @param {string} queryString
 * @returns {{sql: string, params: Record<string, any>}}
 */
function buildWhereClause(queryString) {
  const tokens = queryString.trim().split(/\s+/).filter(Boolean);
  const clauses = [];
  const params = {};
  let paramIndex = 0;

  for (const token of tokens) {
    const colonIndex = token.indexOf(':');
    if (colonIndex === -1) continue;

    const field = token.slice(0, colonIndex);
    let value = token.slice(colonIndex + 1);

    // Only allow known fields to prevent SQL injection
    const allowedFields = [
      'status',
      'instrument',
      'name',
      'lastModified',
      'hash',
      'size',
    ];
    if (!allowedFields.includes(field)) continue;

    // Parse operator
    const operatorMatch = value.match(/^(>=|<=|!=|<>|>|<|=)/);
    let operator = '=';
    if (operatorMatch) {
      operator = operatorMatch[0];
      value = value.slice(operator.length);
    }

    const paramName = `$p${paramIndex++}`;

    if (field === 'lastModified' || field === 'size') {
      clauses.push(`${field} ${operator} ${paramName}`);
      params[paramName] = Number(value);
    } else {
      clauses.push(`${field} ${operator} ${paramName}`);
      params[paramName] = value;
    }
  }

  return { sql: clauses.join(' AND '), params };
}
