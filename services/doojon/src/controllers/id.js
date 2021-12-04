export default class IdController {
  async getCurrentIdentity(ctx) {
    const state = await ctx.getState(ctx);
    ctx.render({ json: state.identity });
  }
}
