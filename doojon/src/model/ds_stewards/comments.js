import { DataserviceSteward } from '../ds_steward.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class CommentsSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Comments';
  }

  preCreateAction(state, objects) {}
}
