import { DataserviceSteward } from '../ds_steward.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ChallengesSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Challenges';
  }
}
