import debugLibrary from 'debug';
import { Client } from 'ldapts';

const debug = debugLibrary('search');

/**
 * Search files based on a query string
 * @param {import('fastify').FastifyInstance} fastify - fastify instance
 */
export default function search(fastify) {
  fastify.route({
    url: '/ldap',
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
  try {
    const client = new Client({
      url: 'ldaps://ldap.epfl.ch',
      timeout: 0,
      connectTimeout: 0,
      tlsOptions: {
        minVersion: 'TLSv1.2',
      },
      strictDN: true,
    });

    const searchDN = 'c=ch';

    const { searchEntries, searchReferences } = await client.search(searchDN, {
      filter: `(uid=${params.query})`,
    });

    await client.unbind();

    return await response.send({
      status: 'ok',
      result: {
        searchEntries,
        searchReferences,
      },
    });
  } catch (error) {
    debug(`Error: ${error.stack}`);
    return response
      .send({ result: {}, message: error.toString(), status: 'error' })
      .code(400);
  }
}
