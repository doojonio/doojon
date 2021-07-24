import { Dataservice } from '../dataservice.js';
import { NotAuthorizedError } from '../errors.js';
import { ID_STATUS_NOPROFILE } from '../state.js';
import { EVENT_CHALLENGE_CREATED, EVENT_FOLLOWING_STARTED, EVENT_POST_CREATED } from './events.js';

const USERNAME_CHECK = /^[a-zA-Z]{1,}[a-zA-Z\d_]{2,17}$/;

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
          .join({ e: 'events' }, { 'e.object': 'po.id', 'e.type': db.raw(`'${EVENT_POST_CREATED}'`) })
          .count()
          .where({ 'e.emitter': db.raw('p.id') }),
      })
      .where(where)
      .groupBy('p.id');

    return result[0];
  }

  async checkBeforeCreate(state, profiles) {
    if (!Array.isArray(profiles)) profiles = [profiles];

    if (state.uinfo.status != ID_STATUS_NOPROFILE)
      throw new NotAuthorizedError();

    if (profiles.length !== 1)
      throw new Error('number of profiles to create is not 1');

    if (!this.isUsernameAvailable(profiles[0].username)) {
      throw new Error('username is not available');
    }
  }

  async _preCreate(state, profiles) {
    const account = state.uinfo.account;
    profiles[0].id = account.id;
  }

  async checkBeforeRead(state, where) {}

  async isUsernameAvailable(username) {
    if (this._conf.profiles.forbiddenUsernames.includes(username)) return false;

    if (!USERNAME_CHECK.test(username)) return false;

    const { exists } = await this._db.first(
      this._db.raw(
        'exists ? as exists',
        this._db('profiles').where({ username })
      )
    );

    return !exists;
  }
}
