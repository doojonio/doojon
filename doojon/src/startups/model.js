import { Model } from '../model.js';

/**
 *
 * @param {import('@mojojs/core').MojoApp} app
 */
export default async function modelStartup(app) {
  app.model = new Model({
    conf: app.config,
    home: app.home,
    log: app.log,
    validator: app.validator
  });
  await app.model.init();
}
