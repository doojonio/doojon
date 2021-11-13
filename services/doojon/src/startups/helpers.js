import getState from '../helpers/get_state.js';
import renderError from '../helpers/render_error.js';

/**
 *
 * @param {import('@mojojs/core').MojoApp} app
 */
export default async function addHelpers(app) {
  app.addHelper('getState', getState);
  app.addHelper('renderError', renderError);
}
