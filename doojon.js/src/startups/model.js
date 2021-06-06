const Model = require('../model');

async function modelStartup(app) {
  // TODO: use ejs for config file
  app.config.model.migrations = {
    directory: app.home.child('migrations').toString(),
  };
  app.config.model.dataservices = {
    directory: app.home.child('model/dataservices').toString(),
  };
  app.config.model.couriers.directory = app.home
    .child('model/couriers')
    .toString();

  app.model = new Model(app.config.model);
  await app.model.init();
}

module.exports = modelStartup;
