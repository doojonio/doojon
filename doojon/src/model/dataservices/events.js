import { Dataservice } from '../dataservice.js';
import { NotAuthorizedError } from '../errors.js';
import { ID_STATUS_AUTHORIZED } from '../state.js';

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

  checkBeforeCreate(state) {
    if (state.uinfo.status !== ID_STATUS_AUTHORIZED)
      throw new NotAuthorizedError();
  }

  _preCreate(state, events) {
    for (const event of events) {
      event.emitter = state.uinfo.account.id;
    }
  }

  async getEventsFromFollowing(state, options) {
    if (state.uinfo.status !== ID_STATUS_AUTHORIZED)
      throw new NotAuthorizedError();

    const limit = options?.limit ?? 25;
    if (limit > 50) throw new Error('can not fetch events more than 50');

    const userId = state.uinfo.account.id;

    const events = this._db('followers')
      .rightJoin('events', 'followers.profile', '=', 'events.emitter')
      .select({
        'id': 'events.id',
        'user': 'events.emitter',
        'type': 'events.type',
        'object': 'events.object',
        'when': 'events.when',
      })
      .orderBy('events.when', 'desc')
      .limit(limit)
      .where('followers.follower', userId)
      .orWhere('events.emitter', userId);

    const beforeEvent = options?.beforeEvent;
    if (beforeEvent !== undefined) {
      events.andWhere(
        'when',
        '>',
        this._db('events').select('when').where('id', beforeEvent)
      );
    }

    const sinceEvent = options?.sinceEvent;
    if (sinceEvent !== undefined) {
      events.andWhere(
        'when',
        '<',
        this._db('events').select('when').where('id', sinceEvent)
      );
    }

    return await events;
  }
}
