const Dataservice = require('../dataservice');

class ProfilesDataservice extends Dataservice {
  static get _tablename() {
    return 'profiles';
  }
}

module.exports = ProfilesDataservice;
