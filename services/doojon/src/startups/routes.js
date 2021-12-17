export default async function routesStartup(app) {
  const routesDirectory = app.home.child('src', 'routes');

  for await (const apiFile of routesDirectory.list()) {
    const routesFunction = (await import(apiFile)).default;
    routesFunction.call(app);
  }
}
