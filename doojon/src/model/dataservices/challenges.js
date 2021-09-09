import { Dataservice } from '../dataservice.js';
import { NotAuthorizedError } from '../errors.js';
import { IdStatus } from '../state.js';

export default class ChallengesDataservice extends Dataservice {
  static get _tablename() {
    return 'challenges';
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

    if (state.uinfo?.status === IdStatus.AUTHORIZED) {
      const inFavorite = await this._db('profile_favorite_challenges')
        .select(1)
        .where({ profile: state.uinfo.account.id });

      info.in_favorite = inFavorite.length !== 0 ? true : false;
    }

    return info;
  }
}
