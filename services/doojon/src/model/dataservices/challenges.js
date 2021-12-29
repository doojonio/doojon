import { Dataservice } from '../dataservice.js';

const CRITERION_BY_SPENDED_DAYS = 'bySpendedDays';
const CRITERION_BY_THINGS_DONE_PER_PERIOD = 'byThingsDonePerPeriod';

export default class ChallengesDataservice extends Dataservice {
  static get _tableName() {
    return 'Challenges';
  }

  static get _moniker() {
    return 'challenges';
  }
}
