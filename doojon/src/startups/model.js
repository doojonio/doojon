import { Model } from '../model.js';

export default async function modelStartup(app) {
  app.model = new Model({
    conf: app.config,
    log: app.log
  });
  await app.model.init();
}

