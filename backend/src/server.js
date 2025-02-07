import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import fastifySession from '@fastify/session';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import getFastify from 'fastify';

import { registerOauth2 } from './api/oauth2.js';
import { checkAccess } from './api/v1/checkAccess.js';
import setupV1 from './api/v1/v1.js';

const devLogger = {
  level: 'info',
  transport: {
    // https://fastify.dev/docs/latest/Reference/Logging/
    target: 'pino-pretty',
    options: {
      translateTime: 'SYS:HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
};

const fastify = await createFastify({
  logger: process.env.NODE_ENV === 'production' ? true : devLogger,
});

const port = process.env.PORT ? Number(process.env.PORT) : 50107;

// eslint-disable-next-line no-console
console.log(`Starting server: http://localhost:${port}`);

fastify.listen(
  {
    port,
    host: '0.0.0.0',
  },
  (err) => {
    if (err) {
      fastify.log.error(err);
      throw err;
    }
  },
);

async function createFastify(options) {
  const fastify = getFastify(options);

  fastify.register(fastifyCookie);
  fastify.register(fastifySession, {
    secret: process.env.SESSION_COOKIE_SECRET,
    cookieName: 'sessionInfo',
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: 'auto' },
  });

  fastify.addHook('preHandler', (request, reply, done) => {
    const allowedWithoutAuth = [
      '/login',
      '/login/callback',
      '/documentation',
      '/v1/userinfo',
    ];
    if (
      process.env.OAUTH2_CALLBACK_URI?.startsWith('http://127.0.0.1') ||
      process.env.OAUTH2_CALLBACK_URI?.startsWith('http://localhost')
    ) {
      done();
      return;
    }

    // if url starts with one of allowedWithoutAuth, then no need to check for auth
    if (
      !allowedWithoutAuth.some((url) => request.url.startsWith(url)) &&
      !request.session?.userinfo
    ) {
      reply.redirect('/login');
      return;
    }
    done();
  });

  registerOauth2(fastify);

  fastify.register(fastifyCors, {
    maxAge: 86400,
  });
  fastify.register(fastifySensible);

  fastify.get('/', (_, reply) => {
    reply.redirect('/documentation');
  });

  registerSwagger(fastify);

  fastify.register(setupV1, {
    prefix: '/v1',
    onRequest: checkAccess,
  });

  return fastify;
}

function registerSwagger(fastify) {
  fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Monitoring cheminfo importation',
        description: ``,
        version: '1.0.0',
      },
      produces: ['application/json'],
    },
  });

  fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  });
}
