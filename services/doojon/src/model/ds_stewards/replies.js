import { DataserviceSteward } from '../ds_steward.js';

export default class RepliesSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Replies';
  }
}
