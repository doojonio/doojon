import { DataserviceSteward } from '../ds_steward.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProgressesByThingsDonePerPeriodSteward extends DataserviceSteward {
  static get _tableName() {
    return 'ProgressesByThingsDonePerPeriod';
  }

  preCreateAction(state, objects) {}
}
