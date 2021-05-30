import Model from '../model.js';

export default async function startup(app) {
  // TODO: use ejs for config file
  app.config.model.migrations = {
    directory: app.home.child('migrations').toString(),
  };
  app.config.model.dataservices = {
    directory: app.home.child('model/dataservices').toString(),
  };

  app.model = new Model(app.config.model);
  await app.model.init();
}
