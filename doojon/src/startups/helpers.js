import IdService from '../model/services/id.js';
import { State } from '../model/state.js';

/**
 *
 * @param {import('@mojojs/core').MojoApp} app
 */
export default async function addHelpers(app) {
  app.addHelper('getState', _stateFromCtxHelper);
}

async function _stateFromCtxHelper(ctx) {
  const state = new State();

  const idService = ctx.app.model.getService('id');

  let authCookieName = ctx.app.config.web.authCookie.name;
  const session = ctx.req.getCookie(authCookieName);

  state.uinfo = await idService.collectUserInformationBySession(session);

  return state;
}
