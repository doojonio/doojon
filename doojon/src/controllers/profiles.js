
export default class ProfilesController {
  async isUsernameAvailable(ctx) {
    const username = ctx.req.query.get('username');

    if (!username)
      return ctx.res.status(200).send('username missing');

    const itIs = await ctx.app.model.getDataservice('profiles').isUsernameAvailable(username)

    ctx.render({json: itIs});
  }
}