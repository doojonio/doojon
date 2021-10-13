import { Dataservice } from '../dataservice.js';

export default class ProgressesByThingsDonePerPeriodDataservice extends Dataservice {
  static get _tableName() {
    return 'ProgressesByThingsDonePerPeriod';
  }

  static get _moniker() {
    return 'progresses_by_things_done_per_period';
  }
}
