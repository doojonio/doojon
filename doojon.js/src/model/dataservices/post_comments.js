const Dataservice = require('../dataservice');

class PostCommentsDataservice extends Dataservice {
  static get _tablename() {
    return 'post_comments';
  }
}

module.exports = PostCommentsDataservice;
