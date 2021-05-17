import Model from '../model.js';

export default async function startup(app) {

  app.model = new Model(app.config.model);
}