
export default class IdController {

  async getUserInfo(ctx) {
    const state = await ctx.getState(ctx);

    ctx.render({json: state.getUserInfo()})
  }

}