const Dataservice = require('../dataservice');

class PostsDataservice extends Dataservice {
  static get _tablename() {
    return 'posts';
  }
}

module.exports = PostsDataservice;
