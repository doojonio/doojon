import { DataserviceSteward } from '../ds_steward.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProfilesSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Profiles';
  }

  preCreateAction(state, objects) {}
}
