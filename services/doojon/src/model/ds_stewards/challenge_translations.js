import { DataserviceSteward } from '../ds_steward.js';

export default class ChallengeTranslationsSteward extends DataserviceSteward {
  static get _tableName() {
    return 'ChallengeTranslations';
  }
}
