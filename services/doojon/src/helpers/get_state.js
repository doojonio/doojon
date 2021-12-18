import { IdStatus, State } from '../model/state.js';

export default async function getState(ctx) {
  const authCookieName = ctx.app.config.auth.web.authCookie.name;
  const forwardedForHeaderName = ctx.app.config.id.web.forwardedForIpHeaderName;

  const session = ctx.req.getCookie(authCookieName);

  const ipFromHeader = ctx.req.get(forwardedForHeaderName);
  const ip = ipFromHeader ?? ctx.req.ip;

  const identity = { status: IdStatus.UNAUTHORIZED, ip };
  const state = new State(identity);

  await ctx.getService('id').updateIdentityForSession(state, session);

  return state;
}
