
const STEPS = ['config', 'model', 'routes', 'cli'];

export default async function startup(app) {
  const promises = [];
  STEPS.forEach(step => {
    promises.push(import(`./startups/${step}.js`));
  })

  const stepImports = await Promise.all(promises);

  for (let imports of stepImports) {

    await imports.default(app);

  }
}
