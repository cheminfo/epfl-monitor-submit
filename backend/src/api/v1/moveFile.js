import { existsSync } from 'node:fs';
import { rename } from 'node:fs/promises';
import { join } from 'node:path';

import debugLibrary from 'debug';

import { getDB } from '../../db/getDB.js';
import { getPath } from '../../utils/getPath.js';

const debug = debugLibrary('search');

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
      summary: 'Get the file for a specific md5',
      description: '',
      querystring: {
        type: 'object',
        properties: {
          md5: {
            type: 'string',
            description: 'The md5 of the file',
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
  const md5 = params.md5;
  const targetFolder = params.targetFolder || 'errored';

  try {
    if (!md5) {
      throw new Error('No md5 provided');
    }
    const files = db.prepare('SELECT * FROM files WHERE md5 = ?').all(md5);

    if (!files) {
      throw new Error('No file found for this md5');
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
    debug(`Error: ${error.stack}`);
    return response
      .send({ result: {}, message: error.toString(), status: 'error' })
      .code(400);
  }
}
