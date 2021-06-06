const { jsonConfigPlugin } = require('@mojojs/mojo');

async function configStartup(app) {
  const file = app.home.sibling('doojon.json').toString();
  app.plugin(jsonConfigPlugin, { file });
}

module.exports = configStartup;
