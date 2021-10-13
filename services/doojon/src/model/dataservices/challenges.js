import { Dataservice } from '../dataservice.js';

export default class ChallengesDataservice extends Dataservice {
  static get _tableName() {
    return 'Challenges';
  }

  static get _moniker() {
    return 'challenges';
  }
}
