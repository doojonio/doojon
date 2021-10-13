import getState from '../helpers/get_state.js';

/**
 *
 * @param {import('@mojojs/core').MojoApp} app
 */
export default async function addHelpers(app) {
  app.addHelper('getState', getState);
}
