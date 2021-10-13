import { Service } from '../service.js';
import { IdStatus } from '../state.js';

export default class IdService extends Service {
  static get deps() {
    return {
      _profiles: '/ds/profiles',
      _sessions: '/s/sessions',
    };
  }

  async getIdentityBySessionId(sessionId) {
    if (!sessionId) {
      return { status: IdStatus.UNAUTHORIZED };
    }

    return { status: IdStatus.AUTHORIZED };
  }
}
