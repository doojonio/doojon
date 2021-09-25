import { Dataservice } from '../dataservice.js';

export default class PostsDataservice extends Dataservice {
  static get _tablename() {
    return 'Posts';
  }

  static get _moniker() {
    return 'posts';
  }
}
