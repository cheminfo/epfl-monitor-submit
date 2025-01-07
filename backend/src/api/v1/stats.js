import debugLibrary from 'debug';

import { getDB } from '../../db/getDB.js';
import { getStatsFromDB } from '../../db/getStatsFromDB.js';

const debug = debugLibrary('stats');

/**
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
export default function stats(fastify) {
  fastify.route({
    url: '/stats',
    method: ['GET', 'POST'],
    handler: process,
    schema: {
      summary: 'Get overall stats',
      description: '',
      querystring: {},
    },
  });
}

/**
 *
 * @param {import('fastify').FastifyRequest} request
 * @param {import('fastify').FastifyReply} response
 * @param {*} response
 * @returns
 */
async function process(request, response) {
  const params = request.body || request.query || {};
  const db = await getDB();
  try {
    const result = await getStatsFromDB(db);
    return await response.send({
      status: 'ok',
      result,
    });
  } catch (error) {
    debug(`Error: ${error.stack}`);
    return response
      .send({ result: {}, message: error.toString(), status: 'error' })
      .code(400);
  }
}
