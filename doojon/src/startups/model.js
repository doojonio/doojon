import { Model } from '../model.js';

export default async function modelStartup(app) {
  app.model = new Model({
    conf: app.config,
    home: app.home,
    log: app.log
  });
  await app.model.init();
}

