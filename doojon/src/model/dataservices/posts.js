import { Dataservice } from '../dataservice.js';
import { NotAuthorizedError } from '../errors.js';
import { ID_STATUS_AUTHORIZED } from '../state.js';
import { EVENT_POST_CREATED, EVENT_POST_LIKED } from './events.js';

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
    const db = this._db;
    const ids = events.map(e => e.object);
    const q = db({ 'p': 'posts' }).whereIn('p.id', ids);

    const select = {
      'id': 'p.id',
      'text': 'p.text',
      'is_hidden': 'p.is_hidden',
      'tags': 'p.tags',
      'title': 'p.title',
      'update_time': 'p.update_time',
      'likes': db('events').count('id').where({object: db.raw('p.id'), type: EVENT_POST_LIKED}),
      'comments': db('post_comments').count('*').where({post: db.raw('p.id')}),
    };

    // Is post liked info
    if (state.uinfo.status === ID_STATUS_AUTHORIZED) {
      select['liked'] = db.raw(
        'exists ?',
        db('events').where({
          type: EVENT_POST_LIKED,
          emitter: state.uinfo.account.id,
          object: db.raw('p.id'),
        })
      );
    }

    q.select(select);
    const posts = await q;

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
