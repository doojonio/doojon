const Dataservice = require('../dataservice');

module.exports = class PostLikesDataservice extends Dataservice {
  static get _tablename() {
    return 'post_likes';
  }
};
