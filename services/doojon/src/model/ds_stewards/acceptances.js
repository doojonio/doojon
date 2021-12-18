import { DataserviceSteward } from '../ds_steward.js';

export default class AcceptancesSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Acceptances';
  }
}
