import { State } from '../model/state.js';

/**
 *
 * @param {import('@mojojs/core').MojoApp} app
 */
export default async function addHelpers(app) {
  app.addHelper('getState', _stateFromCtxHelper);
}

async function _stateFromCtxHelper(ctx) {
  const authCookieName = ctx.app.config.web.authCookie.name;
  const session = ctx.req.getCookie(authCookieName);

  const idService = ctx.app.model.getService('id');
  const identity = await idService.getIdentityBySessionId(session);

  return new State(identity);
}
