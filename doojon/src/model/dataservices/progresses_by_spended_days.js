import { Dataservice } from '../dataservice.js';

export default class ProgressesBySpendedDaysDataservice extends Dataservice {
  static get _tablename() {
    return 'ProgressesBySpendedDays';
  }

  static get _moniker() {
    return 'progresses_by_spended_days';
  }
}
