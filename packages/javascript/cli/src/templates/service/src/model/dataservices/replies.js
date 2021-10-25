import { Dataservice } from '../dataservice.js';

export default class RepliesDataservice extends Dataservice {
  static get _tableName() {
    return 'Replies';
  }

  static get _moniker() {
    return 'replies';
  }
}
