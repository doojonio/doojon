import mojo from '@mojojs/mojo';

const STEPS = ['config', 'model', 'routes', 'cli'];

export default async function startup() {
  const app = mojo();

  for (const step of STEPS) {
    const imports = await import(`./startups/${step}.js`);
    await imports.default(app);
  }

  return app;
}
