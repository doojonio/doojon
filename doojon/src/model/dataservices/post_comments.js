const Dataservice = require('../dataservice');

module.exports = class PostCommentsDataservice extends Dataservice {
  static get _tablename() {
    return 'post_comments';
  }
};
