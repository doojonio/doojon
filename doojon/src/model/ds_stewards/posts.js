import { DataserviceSteward } from '../ds_steward.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class PostsSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Posts';
  }

  preCreateAction(state, objects) {}
}
