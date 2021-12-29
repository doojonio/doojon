import { Dataservice } from '../dataservice.js';

export default class ProgressesBySDDataservice extends Dataservice {
  static get _tableName() {
    return 'ProgressesBySD';
  }

  static get _moniker() {
    return 'progresses_by_s_d';
  }
}
