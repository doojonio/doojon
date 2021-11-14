import { ValidationError } from '../model/errors.js';

export default class AuthController {
  /**
   *
   * @param {import('@mojojs/core').MojoContext} ctx
   */
  async signup(ctx) {
    const model = ctx.app.model;
    const state = await ctx.getState();

    let form;
    try {
      form = await ctx.req.json();
    } catch (error) {
      return ctx.renderError(new ValidationError('Failed to parse JSON'));
    }

    let signUpResult;
    try {
      const authService = model.getService('auth');
      signUpResult = await authService.signup(state, form);
    } catch (error) {
      return ctx.renderError(error);
    }

    ctx.render({
      json: { kind: 'SignUpResponse', profileId: signUpResult.profileId },
    });

    const cookieName = ctx.app.config.auth.web.authCookie.name;
    const cookieExpiresAfterDays =
      ctx.app.config.auth.web.authCookie.expiresAfterDays;
    const cookiePath = ctx.app.config.auth.web.authCookie.path;

    const expires = new Date(
      Date.now() + cookieExpiresAfterDays * 1000 * 60 * 60 * 24
    );

    return ctx.res.setCookie(cookieName, signUpResult.sessionId, {
      expires,
      path: cookiePath,
    });
  }
}
