import { State } from '../model/state.js';

export default async function getState(ctx) {
  const authCookieName = ctx.app.config.auth.web.authCookie.name;
  const forwardedForHeaderName = ctx.app.config.id.web.forwardedForIpHeaderName;

  const session = ctx.req.getCookie(authCookieName);

  const ipFromHeader = ctx.req.get(forwardedForHeaderName);
  const ip = ipFromHeader ?? ctx.req.ip;

  const idService = ctx.app.model.getService('id');
  const identity = await idService.getIdentityBySessionId(session);

  identity.ip = ip;

  return new State(identity);
}