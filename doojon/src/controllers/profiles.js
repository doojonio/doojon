
export default class ProfilesController {
  async getProfileCommonInfo(ctx) {
    const username = ctx.req.query.get('username');
    if (!username)
      return ctx.res.status(400).send('username missing');

    const info = await ctx.app.model.getDataservice('profiles').getCommonInfo({username});

    if (!info)
      return ctx.res.status(404).send('profile not found');

    ctx.render({json: info});
  }

  async isUsernameAvailable(ctx) {
    const username = ctx.req.query.get('username');

    if (!username)
      return ctx.res.status(400).send('username missing');

    const itIs = await ctx.app.model.getDataservice('profiles').isUsernameAvailable(username)

    ctx.render({json: itIs});
  }
}