import { Dataservice } from '../dataservice.js';

export default class ChallengeCrSettingsTDPPDataservice extends Dataservice {
  static get _tableName() {
    return 'ChallengeCrSettingsTDPP';
  }

  static get _moniker() {
    return 'challenge_cr_settings_t_d_p_p';
  }
}
