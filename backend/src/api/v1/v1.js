import getFile from './getFile.js';
import ldap from './ldap.js';
import moveFile from './moveFile.js';
import search from './search.js';
import stats from './stats.js';
import userinfo from './userinfo.js';

/**
 * Register the v1 API
 * @param {import('fastify').FastifyInstance} fastify - fastify instance
 */
export default async function v1(fastify) {
  stats(fastify);
  search(fastify);
  getFile(fastify);
  moveFile(fastify);
  ldap(fastify);
  userinfo(fastify);
}
