import { Service } from '../service.js';
import { IdStatus } from '../state.js';

export default class IdService extends Service {
  /**
   * @type {ProfilesDataservice}
   */
  _profiles;

  static get deps() {
    return {
      _profiles: '/ds/profiles',
    };
  }

  async getIdentityBySessionId(sessionId) {
    if (!sessionId) {
      return { status: IdStatus.UNAUTHORIZED };
    }

    return { status: IdStatus.AUTHORIZED };
  }
}
