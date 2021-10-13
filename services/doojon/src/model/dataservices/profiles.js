import { Dataservice } from '../dataservice.js';
import { NotFoundError } from '../errors.js';

export default class ProfilesDataservice extends Dataservice {
  static get _tableName() {
    return 'Profiles';
  }

  static get _moniker() {
    return 'profiles';
  }

  async getIdAndPasswordByEmail(_state, email) {
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
}
