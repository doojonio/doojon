import { Dataservice } from '../dataservice.js';

export default class ProfilesDataservice extends Dataservice {
  static get _tablename() {
    return 'Profiles';
  }

  static get _moniker() {
    return 'profiles';
  }
}
