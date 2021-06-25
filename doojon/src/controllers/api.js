export class ApiController {
  async underEverything(ctx) {
    const authcookie = ctx.req.getCookie('auth');

    if (authcookie) {
      ctx.log.trace('Found auth cookie');
      const accounts = ctx.app.model.getCourier('accounts');
      const session = await accounts.getSession(authcookie);
      const state = ctx.app.model.getService('state');
      state.setCurrentUser(session);
    }
  }
}