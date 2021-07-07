
export default class ChallengesController {
  async getChallengeCommonInfo(ctx) {
    const state = await ctx.getState(ctx);

    const id = ctx.req.query.get('id');

    if (!id) return ctx.res.status(400).send('missing id parameter');

    const info = await ctx.app.model
      .getDataservice('challenges')
      .collectChallengeInfo(state, id);

    if (info === null)
      return ctx.res.status(404).send('Not found');

    return ctx.render({
      json: info,
    });
  }
}
