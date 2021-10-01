/**
 * @typedef {import('@mojojs/core').MojoContext} Context
 */

export default class ProfilesController {
  /**
   * Returns true if username in request is available. False otherwise
   *
   * @param {Context} ctx
   * @returns
   */
  async isUsernameAvailable(ctx) {
    const username = ctx.req.query.get('username');

    if (!username) return ctx.res.status(400).send('username missing');

    const itIs = await ctx.app.model
      .getDataservice('profiles')
      .isUsernameAvailable(username);

    ctx.render({ json: itIs });
  }
}
