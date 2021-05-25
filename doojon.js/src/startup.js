
const STEPS = ['config', 'model', 'routes', 'cli'];

export default async function startup(app) {
  for (const step of STEPS) {
    const imports = await import(`./startups/${step}.js`);
    await imports.default(app);
  }
}
