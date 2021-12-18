import { DataserviceSteward } from '../ds_steward.js';

export default class ProgressesBySpendedDaysSteward extends DataserviceSteward {
  static get _tableName() {
    return 'ProgressesBySpendedDays';
  }
}
