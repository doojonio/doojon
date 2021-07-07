import { Dataservice } from '../dataservice.js';
import { ID_STATUS_NOPROFILE } from '../state.js';

export default class ProfilesDataservice extends Dataservice {
  static get _tablename() {
    return 'profiles';
  }

  async checkBeforeCreate(state, profiles) {
    if (!Array.isArray(profiles)) profiles = [profiles];

    if (state.uinfo.status != ID_STATUS_NOPROFILE)
      throw new Error('User is not authorized or already has an profile');

    if (profiles.length !== 1)
      throw new Error('number of profiles to create is not 1');
  }

  async _preCreateModify(state, profiles) {
    const account = state.uinfo.account;
    profiles[0].id = account.id;
  }

  async isUsernameAvailable(username) {
    const result = await this._db('profiles').select(1).where({ username });

    return result.length === 0;
  }
}
