import { Dataservice } from '../dataservice.js';
import { NotAuthorizedError } from '../errors.js';
import { ID_STATUS_AUTHORIZED } from '../state.js';
import { ForbiddenError } from '../errors.js';

export const EVENT_FOLLOWING_STARTED = 'following_started';
export const EVENT_CHALLENGE_CREATED = 'challenge_created';
export const EVENT_CHALLENGE_COMMENTED = 'challenge_commented';
export const EVENT_CHALLENGE_PROPOSED = 'challenge_proposed';
export const EVENT_CHALLENGE_PROPOSAL_COMMENTED =
  'challenge_proposal_commented';
export const EVENT_POST_CREATED = 'post_created';
export const EVENT_POST_LIKED = 'post_liked';
export const EVENT_POST_COMMENTED = 'post_commented';
export const EVENT_POST_COMMENT_LIKED = 'post_comment_liked';

export default class EventsDataservice extends Dataservice {
  static get _tablename() {
    return 'events';
  }

  async getEventsFromFollowing(state, options) {
    if (state.uinfo.status !== ID_STATUS_AUTHORIZED)
      throw new NotAuthorizedError();

    const limit = options?.limit ?? 25;
    if (limit > 50) throw new Error('can not fetch events more than 50');

    const userId = state.uinfo.account.id;

    const db = this._db;

    const events = db
      .with(
        'following',
        db('events').select(db.raw('object::uuid')).where({
          type: EVENT_FOLLOWING_STARTED,
          emitter: userId,
        })
      )
      .select({
        'id': 'e.id',
        'user': 'p.username',
        'type': 'e.type',
        'object': 'e.object',
        'when': 'e.when',
      })
      .from({ 'e': 'events' })
      .leftJoin({ 'p': 'profiles' }, { 'e.emitter': 'p.id' })
      .whereIn('e.emitter', db.select('object').from('following'))
      .orWhere('e.emitter', userId)
      .orderBy('e.when', 'desc')
      .limit(limit);

    const types = options?.types;
    if (types !== undefined) {
      events.whereIn('e.type', types);
    }

    const beforeEvent = options?.beforeEvent;
    if (beforeEvent !== undefined) {
      events.andWhere(
        'when',
        '<',
        this._db('events').select('when').where('id', beforeEvent)
      );
    }

    const sinceEvent = options?.sinceEvent;
    if (sinceEvent !== undefined) {
      events.andWhere(
        'when',
        '>',
        this._db('events').select('when').where('id', sinceEvent)
      );
    }

    return await events;
  }

  checkBeforeCreate(state) {
    if (state.uinfo.status !== ID_STATUS_AUTHORIZED)
      throw new NotAuthorizedError();
  }

  checkBeforeDelete(state, where) {
    if (state.uinfo.status !== ID_STATUS_AUTHORIZED)
      throw new NotAuthorizedError();

    const type = where.type;
    if (!type) throw new ForbiddenError();

    const handler = this[`_handleDeleteCheck_${type}`];

    if (!(handler instanceof Function)) throw new ForbiddenError();

    handler.call(this, state, where);
  }

  _handleDeleteCheck_post_liked(state, where) {
    this.validateFields(where, ['object', 'type'], { strict: true });
  }

  _preCreate(state, events) {
    for (const event of events) {
      event.emitter = state.uinfo.account.id;
    }
  }

  _preDelete(state, where) {
    where.emitter = state.uinfo.account.id;
  }
}
