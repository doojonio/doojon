import Dataservice from '../dataservice.js';

export default class PostLikesDataservice extends Dataservice {
  static get _tablename() {
    return 'post_likes';
  }
}
