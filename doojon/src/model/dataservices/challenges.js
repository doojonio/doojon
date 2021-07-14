import { Dataservice } from '../dataservice.js';
import { NotAuthorizedError } from '../errors.js';
import { ID_STATUS_AUTHORIZED } from '../state.js';

export default class ChallengesDataservice extends Dataservice {
  static get _tablename() {
    return 'challenges';
  }

  checkBeforeCreate(state) {
    if (state.uinfo.status !== ID_STATUS_AUTHORIZED) {
      throw new NotAuthorizedError();
    }
  }

  _preCreate(state, challenges) {
    for (const challenge of challenges) {
      challenge.proposed_by = state.uinfo.account.id;
    }
  }

  async collectChallengeInfo(state, id) {
    if (!id) {
      throw new Error('missing id');
    }

    let info = await this._db('challenges as c')
      .join('profiles as p', 'c.proposed_by', 'p.id')
      .select({
        id: 'c.id',
        title: 'c.title',
        description: 'c.description',
        proposed_by_username: 'p.username',
      }).where({'c.id': id});

    if (info.length === 0) return null;

    info = info[0];

    if (state.uinfo?.status === ID_STATUS_AUTHORIZED) {
      const inFavorite = await this._db('profile_favorite_challenges')
        .select(1)
        .where({ profile_id: state.uinfo.account.id });

      info.in_favorite = inFavorite.length !== 0 ? true : false;
    }

    return info;
  }
}
