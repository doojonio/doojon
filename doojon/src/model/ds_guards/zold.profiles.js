import { DataserviceGuard } from '../ds_guard.js';
import { NotAuthorizedError, ValidationError } from '../errors.js';
import { State, IdStatus } from '../state.js';

const USERNAME_CHECK = /^[a-zA-Z]{1}[a-zA-Z\d_]{2,15}$/;

export default class ChallengesGuard extends DataserviceGuard {
  static get _createSchema() {
    return {
      type: 'array',
      maxItems: 1,
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          username: { type: 'string', maxLength: 16, minLength: 3 },
          bio: { type: 'string', maxLength: 256 },
        },
        required: ['username'],
      },
    };
  }

  /**
   *
   * @param {State} state
   * @param {Array<Object>} profiles
   */
  precreateCheck(state, profiles) {
    if (!Array.isArray(profiles)) profiles = [profiles];

    if (state.uinfo.status != IdStatus.NOPROFILE)
      throw new NotAuthorizedError();

    if (profiles.length !== 1)
      throw new ValidationError('number of profiles to create is not 1');

    if (!this._validateCreate(profiles)) {
      throw new ValidationError(this._validator.errorsText);
    };

    if (!this.isUsernameAvailable(profiles[0].username)) {
      throw new ValidationError('username is not available');
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
