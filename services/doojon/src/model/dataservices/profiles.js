import { Dataservice } from '../dataservice.js';
import { NotFoundError } from '../errors.js';

export default class ProfilesDataservice extends Dataservice {
  static get _tableName() {
    return 'Profiles';
  }

  static get _moniker() {
    return 'profiles';
  }

  async getIdAndPasswordByEmail(email) {
    const request = {
      columns: ['id', 'password'],
      keys: [[email]],
      index: 'ProfilesByEmail',
    };

    const [rows] = await this._db.table('Profiles').read(request);

    if (rows.length !== 1) {
      throw new NotFoundError('No user with this email was found');
    }
    return rows[0].toJSON();
  }

  async isUsernameFree(username) {
    const request = {
      columns: ['id'],
      keys: [[username]],
      index: 'ProfilesByUsername',
    };

    const [rows] = await this._db.table('Profiles').read(request);

    if (rows.length === 0) {
      return true;
    }

    return false;
  }
}
