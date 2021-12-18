import getState from '../helpers/get_state.js';
import renderError from '../helpers/render_error.js';
import getService from '../helpers/get_service.js';

/**
 *
 * @param {import('@mojojs/core').MojoApp} app
 */
export default async function addHelpers(app) {
  app.addHelper('getService', getService);
  app.addHelper('getState', getState);
  app.addHelper('renderError', renderError);
}
