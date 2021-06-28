
export default class IdController {

  async getUserInfo(ctx) {
    const state = await ctx.getState(ctx);
    const idService = ctx.app.model.getService('id');
    const userInfo = await idService.collectUserInformation(state);

    ctx.render({json: userInfo})
  }

}