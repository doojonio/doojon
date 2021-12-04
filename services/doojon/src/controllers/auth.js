import { ParsingError } from '../errors.js';
import {
  FailedAuthError,
  NotAuthorizedError,
  NotFoundError,
} from '../model/errors.js';

export default class AuthController {
  async checkUsername(ctx) {
    const username = ctx.stash.username;

    return ctx.render({json: {
      kind: 'CheckUsernameResponse',
      isFree: await ctx.app.model.getDataservice('profiles').isUsernameFree(username),
    }})
  }

  /**
   *
   * @param {import('@mojojs/core').MojoContext} ctx
   */
  async signUp(ctx) {
    let form;
    try {
      form = await ctx.req.json();
    } catch (error) {
      return ctx.renderError(new ParsingError(error.message));
    }

    const model = ctx.app.model;
    const state = await ctx.getState();

    let signUpResult;
    try {
      const authService = model.getService('auth');
      signUpResult = await authService.signUp(state, form);
    } catch (error) {
      return ctx.renderError(error);
    }

    ctx.render({
      json: { kind: 'SignUpResponse', profileId: signUpResult.profileId },
    });

    return this._setResponseAuthCookie(ctx, signUpResult.sessionId);
  }

  /**
   *
   * @param {import('@mojojs/core').MojoContext} ctx
   */
  async signIn(ctx) {
    let form;
    try {
      form = await ctx.req.json();
    } catch (error) {
      return ctx.renderError(new ParsingError(error.message));
    }

    const state = await ctx.getState();
    let signInResult;
    try {
      const authService = ctx.app.model.getService('auth');
      signInResult = await authService.signIn(state, form);
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof FailedAuthError) {
        error = new NotAuthorizedError('email or password is incorrect');
      }

      return ctx.renderError(error);
    }

    ctx.render({
      json: {
        kind: 'SignInResponse',
        profileId: signInResult.profileId,
      },
    });

    return this._setResponseAuthCookie(ctx, signInResult.sessionId);
  }

  _setResponseAuthCookie(ctx, sessionId) {
    const cookieName = ctx.app.config.auth.web.authCookie.name;
    const cookieExpiresAfterDays =
      ctx.app.config.auth.web.authCookie.expiresAfterDays;
    const cookiePath = ctx.app.config.auth.web.authCookie.path;

    const expires = new Date(
      Date.now() + cookieExpiresAfterDays * 1000 * 60 * 60 * 24
    );

    return ctx.res.setCookie(cookieName, sessionId, {
      expires,
      path: cookiePath,
    });
  }
}
