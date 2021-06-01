import Dataservice from '../dataservice.js';

export default class PostCommentLikesDataservice extends Dataservice {
  static get _tablename() {
    return 'post_comment_likes';
  }
}
