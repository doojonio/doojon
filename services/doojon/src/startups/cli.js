/**
 *
 * @param {import('@mojojs/core').MojoApp} app
 */
export default async function cliStartup(app) {
  for await (let module of app.home.child('src/cli').list()) {
    const command = (await import(module.toString())).default;
    app.cli.addCommand(module.basename('.js'), command);
  }
}
