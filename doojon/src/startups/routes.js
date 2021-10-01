/**
 * @typedef {import('@mojojs/core/lib/router/route').default}  Route
 * @typedef {import('@mojojs/core').MojoApp} App
 */

/**
 *
 * @param {App} app
 */
export default async function routesStartup(app) {
  apiV1(app);
}

/**
 *
 * @param {App} app
 */
async function apiV1(app) {
  const v1 = app.any('/api/doojon/v1');

  const dataservicesApi = {
    profiles: { create: true },
    posts: { create: true },
    comments: { create: true },
    replies: { create: true },
    challenges: { create: true },
    acceptances: { create: true },
  };

  const dataservicesEndpoint = v1.any('ds');
  for (const [dataserviceName, methods] of Object.entries(dataservicesApi)) {
    if (methods.create) {
      dataservicesEndpoint
        .post(dataserviceName)
        .to('dataservice#create', { dataserviceName });
    }
  }

  v1.get('id').to('id#id');
}
