import { DataserviceSteward } from '../ds_steward.js';

export default class ProgressesByThingsDonePerPeriodSteward extends DataserviceSteward {
  static get _tableName() {
    return 'ProgressesByThingsDonePerPeriod';
  }
}
