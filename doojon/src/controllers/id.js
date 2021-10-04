export default class IdController {
  async id(ctx) {
    const state = await ctx.getState(ctx);

    ctx.render({ json: state.identity });
  }
}
