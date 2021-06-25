import { jsonConfigPlugin } from '@mojojs/core';

export default async function configStartup(app) {
  app.plugin(jsonConfigPlugin, { file: 'doojon.json' });
  app.config.migrations = {
    directory: app.home.child('src/migrations').toString(),
  };
  app.config.dataservices = {
    directory: app.home.child('src/model/dataservices').toString(),
  };
  app.config.services = {
    directory: app.home.child('src/model/services').toString(),
  };
  app.config.couriers.directory = app.home
    .child('src/model/couriers')
    .toString();
}
