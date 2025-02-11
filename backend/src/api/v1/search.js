import { getDB } from '../../db/getDB.js';
import { queryFiles } from '../../db/queryFiles.js';

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
 * @returns {Promise<import('fastify').FastifyReply>} - promise of fastify response
 */
async function process(request, response) {
  const params = request.body || request.query || {};
  const db = await getDB();
  try {
    const result = await queryFiles(params.query || '', db, {
      logger: request.log,
    });
    return await response.send({
      status: 'ok',
      result,
    });
  } catch (error) {
    request.log.error(error);
    return response
      .send({ result: {}, message: error.toString(), status: 'error' })
      .code(400);
  }
}
