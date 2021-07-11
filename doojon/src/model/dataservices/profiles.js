import { Dataservice } from '../dataservice.js';
import { ID_STATUS_NOPROFILE } from '../state.js';

export default class ProfilesDataservice extends Dataservice {
  static get _tablename() {
    return 'profiles';
  }

  static get _customdeps() {
    return {
      _conf: '/conf',
    }
  }

  async checkBeforeCreate(state, profiles) {
    if (!Array.isArray(profiles)) profiles = [profiles];

    if (state.uinfo.status != ID_STATUS_NOPROFILE)
      throw new Error('User is not authorized or already has an profile');

    if (profiles.length !== 1)
      throw new Error('number of profiles to create is not 1');

    if (!this.isUsernameAvailable(profiles[0].username)) {
      throw new Error('username is not available');
    }
  }

  async _preCreateModify(state, profiles) {
    const account = state.uinfo.account;
    profiles[0].id = account.id;
  }

  async isUsernameAvailable(username) {
    if (this._conf.profiles.forbiddenUsernames.includes(username))
      return false;

    const result = await this._db('profiles').select(1).where({ username });

    return result.length === 0;
  }
}
