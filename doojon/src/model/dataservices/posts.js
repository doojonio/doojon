import { Dataservice } from '../dataservice.js';
import { NotAuthorizedError } from '../errors.js';
import { ID_STATUS_AUTHORIZED } from '../state.js';
import { EVENT_POST_CREATED } from './events.js';

const HASHTAG_REGEX = /\B((?<!#)\#{1,2}\w+\b)(?!;)/g;

export default class PostsDataservice extends Dataservice {
  static get _tablename() {
    return 'posts';
  }

  static get _customdeps() {
    return {
      _events: '/ds/events',
    };
  }

  async linkPostsToPostCreatedEvents(state, events) {
    const ids = events.map(e => e.object);
    const posts = await this._db('posts')
      .whereIn('id', ids)
      .select('id', 'text', 'is_hidden', 'tags', 'title', 'update_time');

    for (const post of posts) {
      events.find(e => e.object === post.id).post = post;
    }
  }

  checkBeforeCreate(state) {
    if (state.uinfo.status != ID_STATUS_AUTHORIZED)
      throw new NotAuthorizedError();
  }

  _preCreate(state, posts) {
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

  async _postCreate(state, pkeys) {
    const events = [];
    for (const pkey of pkeys) {
      const postId = pkey.id;
      events.push({
        object: postId,
        type: EVENT_POST_CREATED,
      });
    }

    await this._events.create(state, events);
  }
}
