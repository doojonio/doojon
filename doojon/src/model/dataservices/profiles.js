import { Dataservice } from '../dataservice.js';

export default class ProfilesDataservice extends Dataservice {
  static get _tableName() {
    return 'Profiles';
  }

  static get _moniker() {
    return 'profiles';
  }
}
