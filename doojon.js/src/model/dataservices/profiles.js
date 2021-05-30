import Dataservice from '../dataservice.js';

export default class ProfilesDataservice extends Dataservice {
  static get _tablename() {
    return 'profiles';
  }
}
