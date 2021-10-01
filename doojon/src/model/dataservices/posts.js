import { Dataservice } from '../dataservice.js';

export default class PostsDataservice extends Dataservice {
  static get _tableName() {
    return 'Posts';
  }

  static get _moniker() {
    return 'posts';
  }
}
