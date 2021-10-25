import ValidationError from 'ajv/dist/runtime/validation_error';

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
      return ctx.render({
        status: 400, json: new ValidationError(`${error}`)
      });
    }

    const res = model.getService('auth');
  }
}
