import { Dataservice } from '../dataservice.js';
import { ID_STATUS_AUTHORIZED } from '../state.js';

export default class ProfileFavoriteChallengesDataservice extends Dataservice {
  static get _tablename() {
    return 'profile_favorite_challenges';
  }

  async checkBeforeCreate(state) {
    if (state.uinfo.status !== ID_STATUS_AUTHORIZED)
      throw new Error('User is not authorized');
  }

  async _preCreateModify(state, pairs) {
    for (const pair of pairs) {
      pair.profile_id = state.uinfo.account.id;
    }
  }
}
