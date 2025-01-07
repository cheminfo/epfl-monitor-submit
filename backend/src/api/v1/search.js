import debugLibrary from 'debug';

import { queryFiles } from '../../db/queryFiles.js';
import { getDB } from '../../db/getDB.js';

const debug = debugLibrary('search');

/**
 *
 * @param {import('fastify').FastifyInstance} fastify
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
