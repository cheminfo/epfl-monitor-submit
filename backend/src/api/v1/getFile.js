import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { getDB } from '../../db/getDB.js';
import { getPath } from '../../utils/getPath.js';

/**
 * Retrieve a file as a binary data
 * @param {import('fastify').FastifyInstance} fastify - fastify instance
 */
export default function getFile(fastify) {
  fastify.route({
    url: '/getFile',
    method: ['GET', 'POST'],
    handler: process,
    schema: {
      summary: 'Get the file for a specific hash',
      description: '',
      querystring: {
        type: 'object',
        properties: {
          hash: {
            type: 'string',
            description: 'The hash of the file',
          },
        },
      },
      response: {
        200: {
          description: 'Successful response',
          content: {
            'application/octet-stream': {
              schema: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Internal function to retrieve the file
 * @param {import('fastify').FastifyRequest} request - fastify request
 * @param {import('fastify').FastifyReply} response - fastify response
 * @returns {Promise<import('fastify').FastifyReply>} - promise of fastify response
 */
async function process(request, response) {
  const params = request.body || request.query || {};
  const db = await getDB();
  const hash = params.hash;

  try {
    if (!hash) {
      throw new Error('No hash provided');
    }
    const files = db.selectFilesByHash.all(hash);

    if (!files) {
      throw new Error('No file found for this hash');
    }
    const path = join(getPath(), files[0].relativePath);
    if (!existsSync(path)) {
      throw new Error('File not found');
    }
    const binary = await readFile(path);
    response.header(
      'Content-Disposition',
      `attachment; filename="${files[0].name}"`,
    );
    return response.send(binary);
  } catch (error) {
    request.log.error(error);
    return response
      .send({ result: {}, message: error.toString(), status: 'error' })
      .code(400);
  }
}
