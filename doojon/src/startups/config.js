const { jsonConfigPlugin } = require('@mojojs/mojo');

async function configStartup(app) {
  const file = app.home.sibling('doojon.json').toString();
  app.plugin(jsonConfigPlugin, { file });
  app.config.model.migrations = {
    directory: app.home.child('migrations').toString(),
  };
  app.config.model.dataservices = {
    directory: app.home.child('model/dataservices').toString(),
  };
  app.config.model.services = {
    directory: app.home.child('model/services').toString(),
  };
  app.config.model.couriers.directory = app.home
    .child('model/couriers')
    .toString();
}

module.exports = configStartup;
