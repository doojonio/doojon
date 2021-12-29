import { Dataservice } from '../dataservice.js';

export default class ChallengeCrSettingsSDDataservice extends Dataservice {
  static get _tableName() {
    return 'ChallengeCrSettingsSD';
  }

  static get _moniker() {
    return 'challenge_cr_settings_s_d';
  }
}
