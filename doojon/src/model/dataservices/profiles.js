import { Dataservice } from '../dataservice.js';
import {
  EVENT_FOLLOWING_STARTED,
  EVENT_POST_CREATED,
} from './events.js';

export default class ProfilesDataservice extends Dataservice {
  static get _tablename() {
    return 'profiles';
  }

  static get _customdeps() {
    return {
      _conf: '/conf',
      _events: '/ds/events',
    };
  }

  async getCommonInfo(by) {
    const where = {};

    if (by.username) {
      where.username = by.username;
    } else if (by.id) {
      where.id = by.id;
    } else {
      throw new Error('need id or username');
    }

    const db = this._db;
    const result = await db({ 'p': 'profiles' })
      .select({
        'id': 'p.id',
        'username': 'p.username',
        'followers': db('events')
          .count()
          .where({
            type: EVENT_FOLLOWING_STARTED,
            object: db.raw('p.id::text'),
          }),
        'following': db('events')
          .count('*')
          .where({ type: EVENT_FOLLOWING_STARTED, emitter: db.raw('p.id') }),
        'posts': db({ po: 'posts' })
          .join(
            { e: 'events' },
            { 'e.object': 'po.id', 'e.type': db.raw(`'${EVENT_POST_CREATED}'`) }
          )
          .count()
          .where({ 'e.emitter': db.raw('p.id') }),
      })
      .where(where)
      .groupBy('p.id');

    return result[0];
  }
}
