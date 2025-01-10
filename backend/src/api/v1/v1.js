import getFile from './getFile.js';
import moveFile from './moveFile.js';
import search from './search.js';
import stats from './stats.js';

/**
 * Register the v1 API
 * @param {import('fastify').FastifyInstance} fastify - fastify instance
 */
export default async function v1(fastify) {
  stats(fastify);
  search(fastify);
  getFile(fastify);
  moveFile(fastify);
}
