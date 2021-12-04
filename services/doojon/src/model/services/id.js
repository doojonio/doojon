import { IdStatus } from '../state.js';

export default class IdService {
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
