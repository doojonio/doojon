import { Dataservice } from '../dataservice.js';

export default class AcceptancesDataservice extends Dataservice {
  static get _tableName() {
    return 'Acceptances';
  }

  static get _moniker() {
    return 'acceptances';
  }
}
