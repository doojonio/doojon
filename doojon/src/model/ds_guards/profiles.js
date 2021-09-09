import { DataserviceGuard } from '../ds_guard';
import { NotAuthorizedError } from '../errors';
import { State } from '../state';

const USERNAME_CHECK = /^[a-zA-Z]{1,}[a-zA-Z\d_]{2,17}$/;

export default class ChallengesGuard extends DataserviceGuard {
  /**
   *
   * @param {State} state
   * @param {Array<Object>} profiles
   */
  precreateCheck(state, profiles) {
    if (!Array.isArray(profiles)) profiles = [profiles];

    if (state.uinfo.status != ID_STATUS_NOPROFILE)
      throw new NotAuthorizedError();

    if (profiles.length !== 1)
      throw new Error('number of profiles to create is not 1');

    if (!this.isUsernameAvailable(profiles[0].username)) {
      throw new Error('username is not available');
    }
  }

  /**
   *
   * @param {State} state
   * @param {Array<Object>} profiles
   */
  precreateAction(state, profiles) {
    const account = state.uinfo.account;
    profiles[0].id = account.id;
  }

  async isUsernameAvailable(username) {
    if (this._conf.profiles.forbiddenUsernames.includes(username)) return false;

    if (!USERNAME_CHECK.test(username)) return false;

    const { exists } = await this._db.first(
      this._db.raw(
        'exists ? as exists',
        this._db('profiles').where({ username })
      )
    );

    return !exists;
  }
}
