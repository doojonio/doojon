import { DataserviceSteward } from '../ds_steward.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class RepliesSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Replies';
  }
}
