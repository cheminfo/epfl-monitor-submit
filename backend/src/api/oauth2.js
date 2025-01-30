import oauthPlugin from '@fastify/oauth2';

import { checkAccess } from './v1/checkAccess.js';

// define EntraID: https://app-portal.epfl.ch/
// endpoints: https://login.microsoftonline.com/f6c2556a-c4fb-4ab1-a2c7-9e220df11c43/v2.0/.well-known/openid-configuration
export function registerOauth2(fastify) {
  fastify.register(oauthPlugin, {
    name: 'epflOAuth2',
    scope: ['openid', 'email'],
    credentials: {
      client: {
        id: process.env.OAUTH2_CLIENT_ID,
        secret: process.env.OAUTH2_CLIENT_SECRET,
      },
    },
    startRedirectPath: '/login',
    callbackUri: process.env.OAUTH2_CALLBACK_URI,
    discovery: {
      issuer:
        'https://login.microsoftonline.com/f6c2556a-c4fb-4ab1-a2c7-9e220df11c43/v2.0',
    },
  });

  // The service provider redirect the user here after successful login
  fastify.get('/login/callback', async (request, reply) => {
    const result =
      await fastify.epflOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const { token } = result;

    request.session.authenticated = true;
    request.session.userinfo = await fastify.epflOAuth2.userinfo(token);

    checkAccess(request, reply);
  });
}
