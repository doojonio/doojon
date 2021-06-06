const Model = require('../model');

module.exports = async function modelStartup(app) {
  app.model = new Model({
    conf: app.config.model,
    log: app.log
  });
  await app.model.init();
}

