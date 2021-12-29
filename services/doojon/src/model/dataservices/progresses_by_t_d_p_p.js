import { Dataservice } from '../dataservice.js';

export default class ProgressesByTDPPDataservice extends Dataservice {
  static get _tableName() {
    return 'ProgressesByTDPP';
  }

  static get _moniker() {
    return 'progresses_by_t_d_p_p';
  }
}
