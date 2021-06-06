const mojo = require('@mojojs/mojo');

const STEPS = ['config', 'model', 'routes', 'cli'];

async function startup() {
  const app = mojo();

  for (const step of STEPS) {
    const stepfunc = require(`./startups/${step}`);
    await stepfunc(app);
  }

  return app;
}

module.exports = startup;
