export default class AuthorizationController {
  /**
   *
   * @param {import('@mojojs/core').MojoContext} ctx
   */
  async signup(ctx) {
    const model = ctx.app.model;
    const state = ctx.getState();

    try {
      const form = ctx.req.json();
    } catch (error) {

    }
  }
}
