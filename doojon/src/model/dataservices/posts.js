const Dataservice = require('../dataservice');

module.exports = class PostsDataservice extends Dataservice {
  static get _tablename() {
    return 'posts';
  }
};
