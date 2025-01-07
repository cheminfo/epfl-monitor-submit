import search from './search.js';
import stats from './stats.js';

/**
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
export default async function v1(fastify) {
  stats(fastify);
  search(fastify);
}
