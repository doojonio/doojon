
const STEPS = ['config', 'model', 'routes'];

export default async function startup(app) {
  const promises = [];
  STEPS.forEach(step => {
    promises.push(import(`./startups/${step}.js`));
  })

  const stepImports = await Promise.all(promises);

  stepImports.forEach(imports => imports.default(app))
}
