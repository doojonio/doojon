import { Dataservice } from '../dataservice.js';
import { NotAuthorizedError } from '../errors.js';
import { ID_STATUS_NOPROFILE } from '../state.js';

export default class ProfilesDataservice extends Dataservice {
  static get _tablename() {
    return 'profiles';
  }

  static get _customdeps() {
    return {
      _conf: '/conf',
      _events: '/ds/events',
    };
  }

  async checkBeforeCreate(state, profiles) {
    if (!Array.isArray(profiles)) profiles = [profiles];

    if (state.uinfo.status != ID_STATUS_NOPROFILE)
      throw new NotAuthorizedError();

    if (profiles.length !== 1)
      throw new Error('number of profiles to create is not 1');

    if (!this.isUsernameAvailable(profiles[0].username)) {
      throw new Error('username is not available');
    }
  }

  async _preCreate(state, profiles) {
    const account = state.uinfo.account;
    profiles[0].id = account.id;
  }

  async checkBeforeRead(state, where) {}

  async isUsernameAvailable(username) {
    if (this._conf.profiles.forbiddenUsernames.includes(username)) return false;

    const {exists} = await this._db.first(
      this._db.raw('exists ? as exists', this._db('profiles').where({ username }))
    );

    return !exists;
  }
}
