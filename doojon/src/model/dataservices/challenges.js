import { Dataservice } from '../dataservice.js';

export default class ChallengesDataservice extends Dataservice {
  static get _tablename() {
    return 'Challenges';
  }

  static get _moniker() {
    return 'challenges';
  }
}
