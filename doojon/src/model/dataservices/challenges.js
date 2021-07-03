import { Dataservice } from '../dataservice.js';
import { ID_STATUS_AUTHORIZED } from '../services/id.js';

export default class ChallengesDataservice extends Dataservice {
  static get _tablename() {
    return 'challenges';
  }

  checkBeforeCreate(state) {
    if (state.getUserInfo().status != ID_STATUS_AUTHORIZED) {
      throw new Error('user is not authorized')
    }
  }

  _preCreateModify(state, challenges) {
    for (const challenge of challenges) {
      challenge.proposed_by = state.getUserInfo().account.id;
    }
  }
}
