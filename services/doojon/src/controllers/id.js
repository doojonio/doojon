export default class IdController {
  async getCurrentIdentity(ctx) {
    const state = await ctx.getState(ctx);
    console.log(state);
    ctx.render({ json: state.identity });
  }
}
