import { DataserviceSteward } from '../ds_steward.js';

export default class PostsSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Posts';
  }
}
