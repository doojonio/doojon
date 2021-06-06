const Dataservice = require('../dataservice');

class PostCommentLikesDataservice extends Dataservice {
  static get _tablename() {
    return 'post_comment_likes';
  }
}

module.exports = PostCommentLikesDataservice;
