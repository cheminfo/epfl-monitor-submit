import { getDB } from '../../db/getDB.js';
import { queryFilesPage } from '../../db/queryFiles.js';

/**
 * Search files based on a query string with pagination
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
          limit: {
            type: 'integer',
            description: 'Number of results per page',
            default: 50,
          },
          offset: {
            type: 'integer',
            description: 'Offset for pagination',
            default: 0,
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
    const { entries, totalCount, statusCounts } = await queryFilesPage(
      params.query || '',
      db,
      {
        limit: Number(params.limit) || 50,
        offset: Number(params.offset) || 0,
        logger: request.log,
      },
    );
    return await response.send({
      status: 'ok',
      result: entries,
      totalCount,
      statusCounts,
    });
  } catch (error) {
    request.log.error(error);
    return response
      .send({ result: {}, message: error.toString(), status: 'error' })
      .code(400);
  }
}
