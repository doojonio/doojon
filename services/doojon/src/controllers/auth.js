export default class AuthController {
  /**
   *
   * @param {import('@mojojs/core').MojoContext} ctx
   */
  async signup(ctx) {
    const model = ctx.app.model;
    const state = ctx.getState();

    let form;
    try {
      form = ctx.req.json();
    } catch (error) {
      return ctx.render({
        status: 400,
        json: error,
      });
    }

    const res = model.getService('auth');
  }
}
