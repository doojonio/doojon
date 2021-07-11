import { Dataservice } from '../dataservice.js';
import { ID_STATUS_AUTHORIZED } from '../state.js';

const HASHTAG_REGEX = /\B((?<!#)\#{1,2}\w+\b)(?!;)/g;

export default class PostsDataservice extends Dataservice {
  static get _tablename() {
    return 'posts';
  }

  checkBeforeCreate(state) {
    if (state.uinfo.status != ID_STATUS_AUTHORIZED)
      throw new Error('user is not authorized');
  }

  _preCreateModify(state, posts) {
    for (const post of posts) {
      post.written_by = state.uinfo.account.id;

      const matches = post.text.matchAll(HASHTAG_REGEX);

      if (!(post.tags instanceof Array)) {
        post.tags = [];
      }

      for (const match of matches) {
        post.tags.push(match[1]);
      }
    }
  }
}
