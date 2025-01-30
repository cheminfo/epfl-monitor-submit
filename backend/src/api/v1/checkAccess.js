export function checkAccess(request, reply, done) {
  if (request.session?.userinfo) {
    const allowedEmails = process.env?.OAUTH2_ALLOWED_EMAILS?.split(',') || [];
    if (allowedEmails.length === 0) {
      throw new Error('OAUTH2_ALLOWED_EMAILS not defined');
    }
    if (allowedEmails.includes(request.session.userinfo?.email)) {
      const frontEndSuccess = process.env?.OAUTH2_SUCCESS_CALLBACK_URI;
      if (!frontEndSuccess) {
        throw new Error('OAUTH2_SUCCESS_CALLBACK_URI not defined');
      }
      if (done) {
        done();
      } else {
        reply.redirect(frontEndSuccess);
      }
    } else {
      reply.code(401).send({ message: 'Unauthorized' });
    }
  } else {
    // redirect to login page
    reply.redirect('/login');
  }
}
