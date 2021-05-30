import Dataservice from '../dataservice.js';

export default class PostCommentsDataservice extends Dataservice {
  static get _tablename() {
    return 'post_comments';
  }
}
