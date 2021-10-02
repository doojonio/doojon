import { DataserviceSteward } from '../ds_steward.js';
import { hash } from 'bcrypt';

/**
 * @typedef {import('../state.js').State} State
 */

export default class ProfilesSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Profiles';
  }

  async manageMutationsForNewObjects(state, profiles) {
    const promises = [];
    for (const profile of profiles) {
      promises.push(
        hash(profile.password, 10).then(hashedPassword => {
          profile.password = hashedPassword;
        })
      );
    }

    await Promise.all(promises);
  }
}
