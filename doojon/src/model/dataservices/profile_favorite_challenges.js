import { Dataservice } from '../dataservice.js';
import { NotAuthorizedError } from '../errors.js';
import { IdStatus } from '../state.js';

export default class ProfileFavoriteChallengesDataservice extends Dataservice {
  static get _tablename() {
    return 'profile_favorite_challenges';
  }

  async checkBeforeCreate(state) {
    if (state.uinfo.status !== IdStatus.AUTHORIZED)
      throw new NotAuthorizedError();
  }

  async _preCreate(state, pairs) {
    for (const pair of pairs) {
      pair.profile = state.uinfo.account.id;
    }
  }
}
