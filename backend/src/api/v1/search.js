import debugLibrary from 'debug';

import { getDB } from '../../db/getDB.js';
import { queryFiles } from '../../db/queryFiles.js';

const debug = debugLibrary('search');

/**
 * Search files based on a query string
 * @param {import('fastify').FastifyInstance} fastify - fastify instance
 */
export default function search(fastify) {
  fastify.route({
    url: '/search',
    method: ['GET', 'POST'],
    handler: process,
    schema: {
      summary: 'Search for files',
      description: '',
      querystring: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query string',
          },
        },
      },
    },
  });
}

/**
 * Internal function to process the query
 * @param {import('fastify').FastifyRequest} request - fastify request
 * @param {import('fastify').FastifyReply} response - fastify response
 * @returns {Promise}
 */
async function process(request, response) {
  const params = request.body || request.query || {};
  const db = await getDB();
  try {
    const result = await queryFiles(params.query || '', db);
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
