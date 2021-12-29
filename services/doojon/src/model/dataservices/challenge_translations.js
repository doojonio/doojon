import { Dataservice } from '../dataservice.js';

export default class ChallengeTranslationsDataservice extends Dataservice {
  static get _tableName() {
    return 'ChallengeTranslations';
  }

  static get _moniker() {
    return 'challenge_translations';
  }
}
