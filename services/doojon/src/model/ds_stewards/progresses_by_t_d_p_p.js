import { DataserviceSteward } from '../ds_steward.js';

export default class ProgressesByTDPPSteward extends DataserviceSteward {
  static get _tableName() {
    return 'ProgressesByTDPP';
  }
}
