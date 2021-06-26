import { Dataservice } from '../dataservice.js';

export default class ProfilesDataservice extends Dataservice {
  static get _tablename() {
    return 'profiles';
  }

  async checkBeforeCreate(state, profiles) {
    if (!Array.isArray(profiles))
      profiles = [profiles]

    if (!state.getUser())
      throw new Error("current user is not authorized");

    if (profiles.length !== 1)
      throw new Error("number of profiles to create is not 1")
  }

  async _preCreateModify(state, profiles) {
    const user = state.getUser();
    const profile = profiles[0];
    profile.id = user.id;
  }
}
