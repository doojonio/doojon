const Dataservice = require('../dataservice');

module.exports = class ChallengesDataservice extends Dataservice {
  static get _tablename() {
    return 'challenges';
  }
};
