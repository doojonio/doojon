const Dataservice = require('../dataservice');

class ChallengesDataservice extends Dataservice {
  static get _tablename() {
    return 'challenges';
  }
}

module.exports = ChallengesDataservice;
