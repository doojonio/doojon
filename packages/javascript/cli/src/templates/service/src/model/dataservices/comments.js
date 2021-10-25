import { Dataservice } from '../dataservice.js';

export default class CommentsDataservice extends Dataservice {
  static get _tableName() {
    return 'Comments';
  }

  static get _moniker() {
    return 'comments';
  }
}
