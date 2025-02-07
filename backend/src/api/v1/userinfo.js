/**
 * Get the overall stats of the database
 * @param {import('fastify').FastifyInstance} fastify - fastify instance
 */
export default function stats(fastify) {
  fastify.route({
    url: '/userinfo',
    method: ['GET', 'POST'],
    handler: process,
    schema: {
      summary: 'Get logged in user information',
      description: '',
      querystring: {},
    },
  });
}

/**
 * Internal function to retrieve the stats
 * @param {import('fastify').FastifyRequest} request - fastify request
 * @param {import('fastify').FastifyReply} response - fastify response
 * @returns {Promise<import('fastify').FastifyReply>} - promise of fastify response
 */
async function process(request, response) {
  try {
    return await response.send({
      status: 'ok',
      result: request.session?.userinfo || null,
    });
  } catch (error) {
    request.log.error(error);
    return response
      .send({ result: {}, message: error.toString(), status: 'error' })
      .code(400);
  }
}
