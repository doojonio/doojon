import { Dataservice } from '../dataservice.js';

export default class ProgressesBySpendedDaysDataservice extends Dataservice {
  static get _tableName() {
    return 'ProgressesBySpendedDays';
  }

  static get _moniker() {
    return 'progresses_by_spended_days';
  }
}
