async function cliStartup(app) {
  for await (let module of app.home.child('cli').list()) {
    const command = require(module.toString());
    app.cli.addCommand(module.basename('.js'), command);
  }
}

module.exports = cliStartup;
