import apiV1 from '../routes/api_v1.js';

/**
 * @typedef {import('@mojojs/core/lib/router/route').default}  Route
 * @typedef {import('@mojojs/core').MojoApp} App
 */

/**
 *
 * @param {App} app
 */
export default async function routesStartup(app) {
  await apiV1.call(app);
}
