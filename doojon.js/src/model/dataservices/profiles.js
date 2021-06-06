const Dataservice = require('../dataservice');

module.exports = class ProfilesDataservice extends Dataservice {
  static get _customdeps() {
    return { _state: '/s/state' };
  }
  static get _tablename() {
    return 'profiles';
  }

  async checkBeforeCreate(profiles) {
    if (!this._state.getCurrentUser())
      return false;
    return true;
  }

  async _preCreateModify(profiles) {
    const user = this._state.getCurrentUser();
    for (const profile of profiles) {
      profile['id'] = user.id;
    }

    return profiles;
  }

};
