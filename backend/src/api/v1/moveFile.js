import { existsSync } from 'node:fs';
import { rename } from 'node:fs/promises';
import { join } from 'node:path';

import { getDB } from '../../db/getDB.js';
import { getPath } from '../../utils/getPath.js';

/**
 * Move the file to the errored folder
 * The
 * @param {import('fastify').FastifyInstance} fastify - fastify instance
 */
export default function moveFile(fastify) {
  fastify.route({
    url: '/moveFile',
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
          targetFolder: {
            type: 'string',
            description: 'The folder to move the file to',
            default: 'errored',
          },
        },
      },
    },
  });
}

/**
 * Internal function to move the file
 * @param {import('fastify').FastifyRequest} request - fastify request
 * @param {import('fastify').FastifyReply} response - fastify response
 * @returns {Promise<import('fastify').FastifyReply>} - promise of fastify response
 */
async function process(request, response) {
  const params = request.body || request.query || {};
  const db = await getDB();
  const hash = params.hash;
  const targetFolder = params.targetFolder || 'errored';

  try {
    if (!hash) {
      throw new Error('No hash provided');
    }
    const files = db.selectFilesByHash.all(hash);

    if (!files) {
      throw new Error('No file found for this hash');
    }
    const sourcePath = join(getPath(), files[0].relativePath);
    if (!existsSync(sourcePath)) {
      throw new Error('File not found');
    }
    const targetPath = join(
      getPath(),
      files[0].instrument,
      targetFolder,
      files[0].name,
    );
    // rename file
    await rename(sourcePath, targetPath);
    return response.send({
      status: 'ok',
      result: { sourcePath, targetPath },
      message: 'File moved',
    });
  } catch (error) {
    request.log.error(error);
    return response
      .send({ result: {}, message: error.toString(), status: 'error' })
      .code(400);
  }
}
