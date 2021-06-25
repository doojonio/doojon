import { Dataservice } from '../dataservice.js';

export default class PostsDataservice extends Dataservice {
  static get _tablename() {
    return 'posts';
  }
}
