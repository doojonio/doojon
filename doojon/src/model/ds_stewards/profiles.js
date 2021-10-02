import { DataserviceSteward } from '../ds_steward.js';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProfilesSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Profiles';
  }
  static get _customDeps() {
    return {
      _crypt: '/s/crypt',
    }
  }

  async manageMutationsForNewObjects(state, profiles) {
    const promises = [];
    for (const profile of profiles) {
      promises.push(
        this._crypt.hashPassword(profile.password).then(hashedPassword => {
          profile.password = hashedPassword;
        })
      );
    }

    await Promise.all(promises);
  }
}
