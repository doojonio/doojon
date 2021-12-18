import { DataserviceSteward } from '../ds_steward.js';

export default class CommentsSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Comments';
  }
}
