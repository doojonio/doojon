import { DataserviceSteward } from '../ds_steward.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProgressesBySpendedDaysSteward extends DataserviceSteward {
  static get _tableName() {
    return 'ProgressesBySpendedDays';
  }

  preCreateAction(state, objects) {}
}
