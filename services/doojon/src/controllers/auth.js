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

    const authService = model.getService('auth');
    try {
      const result = await authService.signup(state, form);
      ctx.render({
        json: { kind: 'SignUpResponse', profileId: result.profileId },
      });

      return ctx.res.setCookie(
        ctx.app.config.web.authCookie.name,
        result.sessionId
      );
    } catch (error) {
      ctx.renderError(error);
    }
  }
}
