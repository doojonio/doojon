import mojo from '@mojojs/core';

const STEPS = ['config', 'model', 'routes', 'cli'];

export async function startup() {
  const app = mojo();

  for (const step of STEPS) {
    const stepfunc = (await import(`./startups/${step}.js`)).default;
    await stepfunc(app);
  }

  return app;
}
