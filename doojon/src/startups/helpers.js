import { State } from "../model/state.js";

export default async function addHelpers(app) {
  app.addHelper('getState', _stateFromCtxHelper);
}

async function _stateFromCtxHelper(ctx) {
  const state = new State(ctx.app.log);

  let authCookieName = ctx.app.config.web.authCookie.name;
  const session = ctx.req.getCookie(authCookieName);

  if ( !session ) return state;

  ctx.log.trace('Found auth cookie');
  const accounts = ctx.app.model.getCourier('accounts');
  const acc = await accounts.getAccountBySession(session);

  if (!acc)
    return state;

  state.setUser(acc);

  return state;
}