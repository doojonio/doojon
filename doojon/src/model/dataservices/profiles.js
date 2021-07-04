import { Dataservice } from '../dataservice.js';
import { ID_STATUS_NOPROFILE } from '../services/id.js';

export default class ProfilesDataservice extends Dataservice {
  static get _tablename() {
    return 'profiles';
  }

  async checkBeforeCreate(state, profiles) {
    if (!Array.isArray(profiles))
      profiles = [profiles]

    if (state.getUserInfo().status != ID_STATUS_NOPROFILE )
      throw new Error("User is not authorized or already has an profile");

    if (profiles.length !== 1)
      throw new Error("number of profiles to create is not 1")
  }

  async _preCreateModify(state, profiles) {
    const account = state.getUserInfo().account;
    profiles[0].id = account.id;
  }
}
