import { DataserviceSteward } from '../ds_steward.js';

export default class ProgressesBySDSteward extends DataserviceSteward {
  static get _tableName() {
    return 'ProgressesBySD';
  }
}
