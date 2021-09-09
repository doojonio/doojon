import { Dataservice } from '../dataservice.js';
import { NotAuthorizedError } from '../errors.js';
import { IdStatus } from '../state.js';

export const Events = {
  FOLLOWING_STARTED: 'following_started',
  CHALLENGE_CREATED: 'challenge_created',
  CHALLENGE_COMMENTED: 'challenge_commented',
  CHALLENGE_PROPOSED: 'challenge_proposed',
  CHALLENGE_PROPOSAL_COMMENTED: 'challenge_proposal_commented',
  POST_CREATED: 'post_created',
  POST_LIKED: 'post_liked',
  POST_COMMENTED: 'post_commented',
  POST_COMMENT_LIKED: 'post_comment_liked',
};

export default class EventsDataservice extends Dataservice {
  static get _tablename() {
    return 'events';
  }

  async getEventsFromFollowing(state, options) {
    if (state.uinfo.status !== IdStatus.AUTHORIZED)
      throw new NotAuthorizedError();

    const limit = options?.limit ?? 25;
    if (limit > 50) throw new Error('can not fetch events more than 50');

    const userId = state.uinfo.account.id;

    const db = this._db;

    const events = db
      .with(
        'following',
        db('events').select(db.raw('object::uuid')).where({
          type: Events.FOLLOWING_STARTED,
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
}
