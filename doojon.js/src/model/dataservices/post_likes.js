const Dataservice = require('../dataservice');

class PostLikesDataservice extends Dataservice {
  static get _tablename() {
    return 'post_likes';
  }
}

module.exports = PostLikesDataservice;
