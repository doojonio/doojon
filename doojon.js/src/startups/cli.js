
export default async function startup(app) {

  for await (let module of app.home.child('cli').list()) {
    const imports = await import(module.toString());
    app.cli.addCommand(module.basename('.js'), imports.default);
  }
}