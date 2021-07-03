import { State } from "../model/state.js";

export default async function addHelpers(app) {
  app.addHelper('getState', _stateFromCtxHelper);
}

async function _stateFromCtxHelper(ctx) {
  const state = new State(ctx.app.log);
  const idService = ctx.app.model.getService('id');

  let authCookieName = ctx.app.config.web.authCookie.name;
  const session = ctx.req.getCookie(authCookieName);

  state.setUserInfo(await idService.collectUserInformationBySession(session))

  return state;
}