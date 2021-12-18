import { DataserviceSteward } from '../ds_steward.js';

export default class ProfilesSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Profiles';
  }
  static get _customDeps() {
    return {
      _crypt: '/s/crypt',
    };
  }

  async manageMutationsForNewObjects(profiles) {
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

  async manageMutationsForUpdatedRows(profiles) {
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
