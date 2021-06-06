const Dataservice = require('../dataservice');

module.exports = class PostCommentLikesDataservice extends Dataservice {
  static get _tablename() {
    return 'post_comment_likes';
  }
};
