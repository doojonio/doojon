import { DataserviceSteward } from '../ds_steward.js';

export default class ChallengesSteward extends DataserviceSteward {
  static get _tableName() {
    return 'Challenges';
  }
}
